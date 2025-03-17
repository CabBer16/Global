document.addEventListener('DOMContentLoaded', function () {
    verificarSesion();
    cargarProductosDisponibles();
    actualizarIconoCarrito();
});

function verificarSesion() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario && usuario.id) {
        // Usuario logueado: mostrar carrito y cerrar sesión, ocultar iniciar sesión
        document.getElementById('carritoLink').style.display = 'block';
        document.getElementById('logoutLink').style.display = 'block';
        document.getElementById('loginLink').style.display = 'none';
    } else {
        // Usuario no logueado: mostrar iniciar sesión, ocultar carrito y cerrar sesión
        document.getElementById('carritoLink').style.display = 'none';
        document.getElementById('logoutLink').style.display = 'none';
        document.getElementById('loginLink').style.display = 'block';
    }
}

function cargarProductosDisponibles() {
    fetch('/api/productos/disponibles')
        .then(response => response.json())
        .then(productos => {
            const listaProductos = document.getElementById('listaProductos');
            listaProductos.innerHTML = ''; 
            productos.forEach(producto => {
                const stockTexto = producto.stock > 0 ? 'Stock disponible' : 'Agotado'; // Mostrar "Stock disponible" o "Agotado"
                const productoHTML = `
                    <div class="product-card" data-categoria="${producto.tipo_instrumento}" onclick="mostrarDetallesProducto(${producto.id})">
                        <div class="product-image">
                            <img src="${producto.ImagenBase64}" alt="${producto.nombre}">
                        </div>
                        <div class="product-info">
                            <h3>${producto.nombre}</h3>
                            <p class="price">$${parseFloat(producto.precio).toFixed(2)}</p>
                            <p class="stock">${stockTexto}</p>
                        </div>
                    </div>`;
                listaProductos.innerHTML += productoHTML;
            });
            agregarFiltros();
        })
        .catch(error => console.error('Error al cargar productos:', error));
}

function mostrarDetallesProducto(productoId) {
    fetch(`/api/productos/${productoId}`)
        .then(response => response.json())
        .then(producto => {
            if (producto.error) {
                alert(producto.error);
                return;
            }

            const stockTexto = producto.stock > 0 ? 'Stock disponible' : 'Agotado'; 
            const modalContenido = document.getElementById('modalContenido');
            modalContenido.innerHTML = `
                <div class="modal-header">
                    <h2>${producto.nombre}</h2>
                    <span class="cerrar-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="product-image">
                        <img src="${producto.ImagenBase64}" alt="${producto.nombre}">
                    </div>
                    <div class="product-details">
                        <p><strong>Descripción:</strong> ${producto.descripcion}</p>
                        <p><strong>Precio:</strong> $${parseFloat(producto.precio).toFixed(2)}</p>
                        <p><strong>Stock:</strong> ${stockTexto}</p>
                        <p><strong>Tipo de Instrumento:</strong> ${producto.tipo_instrumento}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary" onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
                </div>`;
            const modal = document.getElementById('modalProducto');
            modal.style.display = 'flex';
        })
        .catch(error => {
            console.error('Error al cargar detalles del producto:', error);
            alert('Error al cargar los detalles del producto.');
        });
}

function agregarAlCarrito(productoId) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario || !usuario.id) {
        // Si el usuario no está logueado, mostrar SweetAlert y redirigir a la página de inicio de sesión
        Swal.fire({
            icon: 'warning',
            title: 'Inicia sesión',
            text: 'Debes iniciar sesión para agregar productos al carrito.',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            window.location.href = 'index.html'; // Redirigir a la página de inicio de sesión
        });
        return;
    }

    const usuarioId = usuario.id;
    const cantidad = 1; // Cantidad predeterminada

    fetch('/api/carrito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId, productoId, cantidad })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            // Mostrar SweetAlert de error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.error,
                confirmButtonText: 'Aceptar'
            });
        } else {
            // Mostrar SweetAlert de éxito
            Swal.fire({
                icon: 'success',
                title: '¡Producto agregado!',
                text: data.mensaje,
                confirmButtonText: 'Aceptar'
            });
        }
        actualizarIconoCarrito(); // Actualizar el ícono del carrito
    })
    .catch(error => {
        console.error('Error al agregar al carrito:', error);
        // Mostrar SweetAlert de error en caso de fallo en la solicitud
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al agregar el producto al carrito. Por favor, intenta nuevamente.',
            confirmButtonText: 'Aceptar'
        });
    });
}


function actualizarIconoCarrito() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario || !usuario.id) return;

    fetch(`/api/carrito/cantidad?usuarioId=${usuario.id}`)
    .then(response => response.json())
    .then(data => {
        const iconoCarrito = document.getElementById('iconoCarrito');
        if (iconoCarrito) {
            iconoCarrito.textContent = data.cantidad;
        }
    })
    .catch(error => console.error('Error al actualizar el ícono del carrito:', error));
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

function agregarFiltros() {
    const buscador = document.getElementById('buscador');
    const filtros = document.querySelectorAll('.filtro-btn');

    // Filtros por categoría
    filtros.forEach(filtro => {
        filtro.addEventListener('click', () => {
            const tipo = filtro.dataset.categoria;
            filtros.forEach(f => f.classList.remove('active'));
            filtro.classList.add('active');

            // Obtener productos filtrados por tipo
            fetch(`/api/productos/disponibles?tipo=${tipo}`)
                .then(response => response.json())
                .then(productos => {
                    const listaProductos = document.getElementById('listaProductos');
                    listaProductos.innerHTML = '';
                    productos.forEach(producto => {
                        const productoHTML = `
                            <div class="product-card" data-categoria="${producto.tipo}" onclick="mostrarDetallesProducto(${producto.id})">
                                <div class="product-image">
                                    <img src="${producto.ImagenBase64}" alt="${producto.nombre}">
                                </div>
                                <div class="product-info">
                                    <h3>${producto.nombre}</h3>
                                    <p class="price">$${parseFloat(producto.precio).toFixed(2)}</p>
                                    <p class="stock">Stock: ${producto.stock}</p>
                                </div>
                            </div>`;
                        listaProductos.innerHTML += productoHTML;
                    });
                })
                .catch(error => console.error('Error al cargar productos:', error));
        });
    });

    buscador.addEventListener('input', () => {
        const texto = buscador.value.toLowerCase();
        const productos = document.querySelectorAll('.product-card');
        productos.forEach(producto => {
            const nombre = producto.querySelector('h3').textContent.toLowerCase();
            if (nombre.includes(texto)) {
                producto.style.display = 'block';
            } else {
                producto.style.display = 'none';
            }
        });
    });
}

document.querySelector('.cerrar-modal').addEventListener('click', () => {
    document.getElementById('modalProducto').style.display = 'none';
});

window.addEventListener('click', (event) => {
    const modal = document.getElementById('modalProducto');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

function cerrarSesion() {
    localStorage.removeItem('usuario');
    window.location.href = 'index.html'; 
}
