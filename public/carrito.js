document.addEventListener('DOMContentLoaded', function () {
    cargarCarrito();
    document.getElementById('pagoPDF').addEventListener('click', pagarConPDF);
    document.getElementById('abrirPayPal').addEventListener('click', mostrarPayPal);
});

function cargarCarrito() {
    const usuarioId = obtenerUsuarioId(); // Obtener el ID del usuario

    fetch(`/api/carrito?usuarioId=${usuarioId}`)
        .then(response => response.json())
        .then(data => {
            const listaCarrito = document.getElementById('listaCarrito');
            listaCarrito.innerHTML = ''; // Limpiar el carrito antes de llenarlo

            let total = 0;

            // Aplicar clase .carrito-pequeno si solo hay un producto
            if (data.length === 1) {
                document.querySelector('.carrito').classList.add('carrito-pequeno');
            } else {
                document.querySelector('.carrito').classList.remove('carrito-pequeno');
            }

            data.forEach(producto => {
                const precio = parseFloat(producto.precio);
                const cantidad = parseInt(producto.cantidad);

                if (isNaN(precio) || isNaN(cantidad)) {
                    console.error('Precio o cantidad no válidos:', producto);
                    return;
                }

                const subtotal = precio * cantidad;
                total += subtotal;

                const productoHTML = `
                    <div class="producto-carrito">
                        <img src="${producto.ImagenBase64}" alt="${producto.nombre}">
                        <h3>${producto.nombre}</h3>
                        <p><strong>Precio:</strong> $${precio.toFixed(2)}</p>
                        <p><strong>Cantidad:</strong> 
                            <input type="number" value="${cantidad}" min="1" onchange="actualizarCantidad(${producto.id}, this.value)">
                        </p>
                        <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
                        <button class="btn-danger" onclick="eliminarDelCarrito(${producto.id})">Eliminar</button>
                    </div>`;
                listaCarrito.innerHTML += productoHTML;
            });

            document.getElementById('totalCarrito').textContent = total.toFixed(2);
        })
        .catch(error => {
            console.error('Error al cargar el carrito:', error);
            alert('Error al cargar el carrito. Por favor, intenta nuevamente.');
        });
}

function actualizarCantidad(productoId, cantidad) {
    fetch(`/api/carrito/${productoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje || data.error);
        cargarCarrito(); // Recargar el carrito
    })
    .catch(error => console.error('Error al actualizar la cantidad:', error));
}

function eliminarDelCarrito(productoId) {
    if (confirm('¿Estás seguro de eliminar este producto del carrito?')) {
        fetch(`/api/carrito/${productoId}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                alert(data.mensaje || data.error);
                cargarCarrito(); // Recargar el carrito
            })
            .catch(error => console.error('Error al eliminar del carrito:', error));
    }
}

function obtenerUsuarioId() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario && usuario.id) {
        return usuario.id;
    } else {
        window.location.href = 'login.html';
        return null;
    }
}

function pagarConPDF() {
  const usuarioId = obtenerUsuarioId(); // Obtener el ID del usuario
  console.log('Usuario ID:', usuarioId); // Depuración

  // Obtener el correo del usuario desde el servidor
  fetch(`/api/usuario/correo?usuarioId=${usuarioId}`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Error en la solicitud');
          }
          return response.json();
      })
      .then(data => {
          console.log('Respuesta del servidor:', data); // Depuración
          if (data.error) {
              throw new Error(data.error);
          }

          const correo = data.correo; // Obtener el correo del usuario
          console.log('Correo del usuario:', correo); // Depuración

          // Enviar la solicitud para generar el PDF
          fetch('/api/pagar/pdf', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ usuarioId, correo })
          })
          .then(response => response.json())
          .then(data => {
              console.log('Respuesta del servidor:', data); // Depuración

              if (data.success) {
                  // Mostrar mensaje de éxito con SweetAlert
                  Swal.fire({
                      title: '¡Pago exitoso!',
                      text: data.mensaje || 'Pago realizado exitosamente!!',
                      icon: 'success',
                      confirmButtonText: 'Aceptar'
                  }).then(() => {
                      // Redirigir después de cerrar el mensaje
                      window.location.href = 'home.html';
                      document.getElementById('cargarCarrito').click();
                      document.addEventListener('DOMContentLoaded', cargarCarrito);
                  });
              } else {
                  // Mostrar mensaje de error con SweetAlert
                  Swal.fire({
                      title: 'Error',
                      text: data.error || 'Error al procesar el pago',
                      icon: 'error',
                      confirmButtonText: 'Aceptar'
                  });
              }
          })
          .catch(error => {
              console.error('Error al procesar el pago:', error);
              // Mostrar mensaje de error con SweetAlert
              Swal.fire({
                  title: 'Error',
                  text: 'Error al procesar el pago. Por favor, intenta nuevamente.',
                  icon: 'error',
                  confirmButtonText: 'Aceptar'
              });
          });
      })
      .catch(error => {
          console.error('Error al obtener el correo del usuario:', error);
          // Mostrar mensaje de error con SweetAlert
          Swal.fire({
              title: 'Error',
              text: 'Error al obtener el correo del usuario. Por favor, intenta nuevamente.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
          });
      });
}


const usuarioId = obtenerUsuarioId(); 
if (!usuarioId) {
    alert('Debes iniciar sesión para ver tu carrito');
    window.location.href = 'index.html';
}

let totalCompra = 0;

/*function cargarCarrito() {
    fetch('/api/carrito?usuarioId=' + usuarioId)
        .then(response => response.json())
        .then(carrito => {
            const listaCarrito = document.getElementById('listaCarrito');
            listaCarrito.innerHTML = ''; // Limpia la lista antes de cargar

            totalCompra = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
            document.getElementById('totalCarrito').innerText = totalCompra.toFixed(2);

            carrito.forEach(item => {
                const div = document.createElement('div');
                div.classList.add('producto-carrito');
                div.innerHTML = `
                    <img src="data:image/png;base64,${item.ImagenBase64}" alt="${item.nombre}" class="img-producto">
                    <p><strong>${item.nombre}</strong></p>
                    <p>${item.descripcion}</p>
                    <p>Precio: $${item.precio}</p>
                    <p>Cantidad: ${item.cantidad}</p>
                `;
                listaCarrito.appendChild(div);
            });

            inicializarPayPal();
        })
        .catch(error => console.error('Error al cargar el carrito:', error));
}*/

function mostrarPayPal() {
    const paypalContainer = document.getElementById('paypal-button-container');
    paypalContainer.style.display = 'block'; // Mostrar el contenedor de PayPal
    inicializarPayPal();
}



function inicializarPayPal() {
    paypal.Buttons({
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: document.getElementById('totalCarrito').textContent
                    }
                }]
            });
        },
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
                Swal.fire({
                    title: '¡Pago exitoso!',
                    text: `Pago realizado con éxito por ${details.payer.name.given_name}`,
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    registrarPago(); // Registrar el pago en el servidor
                });
            });
        },
        onError: function (err) {
            console.error('Error en el pago con PayPal:', err);
            Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error al procesar el pago con PayPal.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    }).render('#paypal-button-container');
}

function registrarPago() {
    const usuarioId = obtenerUsuarioId(); // Obtener el ID del usuario
    const total = parseFloat(document.getElementById('totalCarrito').textContent); // Obtener el total del carrito

    fetch('/api/pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId, total })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: '¡Pago registrado!',
                text: 'El pago se ha registrado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                // Redirigir al usuario después del pago
                window.location.href = 'home.html';
            });
        } else {
            throw new Error(data.error || 'Error al registrar el pago');
        }
    })
    .catch(error => {
        console.error('Error al registrar el pago:', error);
        Swal.fire({
            title: 'Error',
            text: error.message || 'Ocurrió un error al registrar el pago.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    });
}

document.addEventListener('DOMContentLoaded', cargarCarrito);