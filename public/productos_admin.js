// Agregar producto
document.getElementById('formAgregarProducto').addEventListener('submit', function (event) {
    event.preventDefault();

    const usuarioId = obtenerUsuarioId();

    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = parseFloat(document.getElementById('precio').value) || 0;
    const stock = parseInt(document.getElementById('stock').value);
    const tipo_instrumento = document.getElementById('tipo_instrumento').value;
    const imagenInput = document.getElementById('imagen').files[0];

    if (!nombre || !descripcion || !precio || !stock || !tipo_instrumento) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Todos los campos son obligatorios.',
        });
        return;
    }

    if (productoEditandoId) {
        // Si estamos editando, llamar a la función de actualizar
        if (imagenInput) {
            // Si hay una nueva imagen, convertirla a Base64
            convertirImagenABase64(imagenInput, function (imagenBase64) {
                guardarEdicionProducto(productoEditandoId, { nombre, descripcion, precio, stock, tipo_instrumento, imagen: imagenBase64 });
            });
        } else {
            // Si no hay nueva imagen, usar la imagen existente
            guardarEdicionProducto(productoEditandoId, { nombre, descripcion, precio, stock, tipo_instrumento, imagen: imagenExistente });
        }
    } else {
        // Si no estamos editando, agregar un nuevo producto
        if (!imagenInput) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, selecciona una imagen.',
            });
            return;
        }

        convertirImagenABase64(imagenInput, function (imagenBase64) {
            fetch('/api/productos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, descripcion, precio, stock, tipo_instrumento, imagen: imagenBase64 })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error,
                    });
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Producto agregado!',
                        text: data.mensaje,
                    }).then(() => {
                        document.getElementById('formAgregarProducto').reset();
                        document.getElementById('cargarProductos').click();
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al agregar el producto. Por favor, intenta nuevamente.',
                });
            });
        });
    }
});

// Eliminar producto
function eliminarProducto(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/api/productos?id=${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error,
                    });
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Producto eliminado!',
                        text: data.mensaje,
                    }).then(() => {
                        document.getElementById('cargarProductos').click(); // Recargar la lista de productos
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al eliminar el producto. Por favor, intenta nuevamente.',
                });
            });
        }
    });
}

let productoEditandoId = null;
let imagenExistente = null; // Variable para almacenar la imagen existente

function editarProducto(id) {
    fetch(`/api/productos/${id}`)
        .then(response => response.json())
        .then(producto => {
            // Llenamos el formulario con los datos actuales del producto
            document.getElementById('nombre').value = producto.nombre;
            document.getElementById('descripcion').value = producto.descripcion;
            document.getElementById('precio').value = producto.precio;
            document.getElementById('stock').value = producto.stock;
            document.getElementById('tipo_instrumento').value = producto.tipo_instrumento; // Nuevo campo

            // Guardamos el ID del producto en edición
            productoEditandoId = id;

            // Guardamos la imagen existente
            imagenExistente = producto.imagen;

            // Cambiamos el texto del botón para indicar que se está editando
            const botonSubmit = document.querySelector('#formAgregarProducto button');
            botonSubmit.textContent = 'Guardar Cambios';
            botonSubmit.classList.add('btn-warning');

            // Desplazar la página al formulario de edición
            window.scrollTo({ top: 0, behavior: 'smooth' });
        })
        .catch(error => console.error('Error al cargar producto:', error));
}

function habilitarEdicionProducto(botonEditar) {
    const fila = botonEditar.closest('tr');
    const celdasEditables = fila.querySelectorAll('.editable');

    botonEditar.style.display = 'none';
    fila.querySelector('.btn-success').style.display = 'inline-block';
    fila.querySelector('.btn-danger').style.display = 'inline-block';

    celdasEditables.forEach(celda => {
        const campo = celda.getAttribute('data-field');
        const valorActual = celda.textContent;

        if (campo === 'imagen') {
            celda.innerHTML = `<input type="file" class="form-control">`;
        } else {
            celda.innerHTML = `<input type="text" class="form-control" value="${valorActual}">`;
        }
    });
}
function guardarCambiosProducto(botonGuardar) {
    Swal.fire({
        title: '¿Guardar cambios?',
        text: '¿Estás seguro de que deseas guardar los cambios?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, guardar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            const fila = botonGuardar.closest('tr');
            const id = fila.getAttribute('data-id');

            const datosActualizados = {
                nombre: fila.querySelector('[data-field="nombre"] input').value,
                descripcion: fila.querySelector('[data-field="descripcion"] input').value,
                precio: parseFloat(fila.querySelector('[data-field="precio"] input').value),
                stock: parseInt(fila.querySelector('[data-field="stock"] input').value),
                tipo_instrumento: fila.querySelector('[data-field="tipo_instrumento"] input').value,
            };

            const imagenInput = fila.querySelector('[data-field="imagen"] input[type="file"]');

            if (imagenInput && imagenInput.files.length > 0) {
                const imagenFile = imagenInput.files[0];
                convertirImagenABase64(imagenFile, function (imagenBase64) {
                    datosActualizados.imagen = imagenBase64;
                    enviarCambiosProducto(id, datosActualizados);
                });
            } else {
                enviarCambiosProducto(id, datosActualizados);
            }
        }
    });
}

function enviarCambiosProducto(id, datosActualizados) {
    fetch(`/api/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosActualizados)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.error,
            });
        } else {
            Swal.fire({
                icon: 'success',
                title: '¡Cambios guardados!',
                text: data.mensaje,
            }).then(() => {
                document.getElementById('cargarProductos').click(); // Recargar la lista de productos
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al guardar los cambios. Por favor, intenta nuevamente.',
        });
    });
}

function cancelarEdicionProducto(botonCancelar) {
    const fila = botonCancelar.closest('tr');
    const celdasEditables = fila.querySelectorAll('.editable');

    fila.querySelector('.btn-primary').style.display = 'inline-block';
    fila.querySelector('.btn-success').style.display = 'none';
    fila.querySelector('.btn-danger').style.display = 'none';

    celdasEditables.forEach(celda => {
        const campo = celda.getAttribute('data-field');
        const valorOriginal = celda.querySelector('input').value;

        if (campo === 'imagen') {
            celda.innerHTML = `<img src="${valorOriginal}" alt="Imagen del producto" width="50">`;
        } else {
            celda.innerHTML = valorOriginal;
        }
    });
}

function guardarEdicionProducto(id, productoActualizado) {
    fetch(`/api/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoActualizado)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.error,
            });
        } else {
            Swal.fire({
                icon: 'success',
                title: '¡Cambios guardados!',
                text: data.mensaje,
            }).then(() => {
                // Reiniciar el formulario
                document.getElementById('formAgregarProducto').reset();
                productoEditandoId = null;

                // Restaurar el texto del botón
                const botonSubmit = document.querySelector('#formAgregarProducto button');
                botonSubmit.textContent = 'Agregar Producto';
                botonSubmit.classList.remove('btn-warning');

                // Recargar la lista de productos
                document.getElementById('cargarProductos').click();
            });
        }
    })
    .catch(error => {
        console.error('Error al actualizar producto:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al guardar los cambios. Por favor, intenta nuevamente.',
        });
    });
}

document.getElementById('cargarProductos').addEventListener('click', function () {
    fetch('/api/productos/disponibles')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#tablaProductos tbody');
            tbody.innerHTML = '';

            data.forEach(producto => {
                const row = `
                    <tr data-id="${producto.id}">
                        <td>${producto.id}</td>
                        <td class="editable" data-field="nombre">${producto.nombre}</td>
                        <td class="editable" data-field="descripcion">${producto.descripcion}</td>
                        <td class="editable" data-field="precio">${producto.precio}</td>
                        <td class="editable" data-field="stock">${producto.stock}</td>
                        <td class="editable" data-field="tipo_instrumento">${producto.tipo_instrumento}</td> <!-- Nuevo campo -->
                        <td class="editable" data-field="imagen">
                            ${producto.ImagenBase64 ? `<img src="${producto.ImagenBase64}" alt="${producto.nombre}" width="50">` : 'Sin imagen'}
                        </td>
                        <td>
                            <button onclick="habilitarEdicionProducto(this)" class="btn-primary">Editar</button>
                            <button onclick="eliminarProducto(${producto.id})" class="btn-secondary">Eliminar</button>
                            <button onclick="guardarCambiosProducto(this)" class="btn-success" style="display: none;">Guardar</button>
                            <button onclick="cancelarEdicionProducto(this)" class="btn-danger" style="display: none;">Cancelar</button>
                        </td>
                    </tr>`;
                tbody.innerHTML += row;
            });
        })
        .catch(error => console.error('Error:', error));
});


// Función para convertir imagen a Base64
function convertirImagenABase64(file, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file); // Asegura que se lea como DataURL
    reader.onload = function () {
        callback(reader.result);
    };
    reader.onerror = function (error) {
        console.error('Error al convertir la imagen:', error);
    };
}


// Evento para manejar la subida de imágenes
const inputImagen = document.getElementById('imagen');
let imagenBase64 = "";

inputImagen.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        convertirImagenABase64(file, function (base64String) {
            imagenBase64 = base64String;
            console.log('Imagen en Base64:', imagenBase64);
        });
    }
});

function obtenerUsuarioId() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario && usuario.id) {
        return usuario.id;
    } else {
        window.location.href = 'index.html'; // Redirigir al login si no hay usuario autenticado
        return null;
    }
}