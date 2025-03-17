document.getElementById('cargarUsuarios').addEventListener('click', function() {
    fetch('/api/usuarios', {
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const tbody = document.querySelector('#tablaUsuarios tbody');
        tbody.innerHTML = ''; // Limpiar la tabla antes de llenarla

        data.forEach(usuario => {
            const row = `
                <tr data-id="${usuario.id}">
                    <td>${usuario.id}</td>
                    <td class="editable" data-field="nombre">${usuario.nombre}</td>
                    <td class="editable" data-field="correo">${usuario.correo}</td>
                    <td class="editable" data-field="contrasena">
                        <input type="password" class="form-control" placeholder="Nueva contraseña">
                    </td>
                    <td class="editable" data-field="rol_id">${usuario.rol}</td>
                    <td>
                        <button onclick="habilitarEdicion(this)" class="btn-primary">Editar</button>
                        <button onclick="eliminarUsuario(${usuario.id})" class="btn-secondary">Eliminar</button>
                        <button onclick="guardarCambios(this)" class="btn-success" style="display: none;">Guardar</button>
                        <button onclick="cancelarEdicion(this)" class="btn-danger" style="display: none;">Cancelar</button>
                    </td>
                </tr>`;
            tbody.innerHTML += row;
        });
    })
    .catch(error => console.error('Error:', error));
});

function cargarUsuarios() {
    fetch('/api/usuarios')
        .then(response => response.json())
        .then(data => {
            const lista = document.getElementById('listaUsuarios');
            lista.innerHTML = '';
            data.forEach(usuario => {
                const li = document.createElement('li');
                li.textContent = usuario.nombre;
                lista.appendChild(li);
            });
        })
        .catch(error => console.error('Error al cargar usuarios:', error));
}
//Agregar usuarios

document.getElementById('formAgregarUsuario').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;
    const rol_id = document.getElementById('rol_id').value;

    console.log({ nombre, correo, contrasena, rol_id }); // Depuración: Verifica los datos enviados

    fetch('/api/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ nombre, correo, contrasena, rol_id })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Depuración: Verifica la respuesta del backend
        if (data.error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.error,
                confirmButtonText: 'Aceptar'
            });
        } else {
            Swal.fire({
                icon: 'success',
                title: '¡Usuario agregado!',
                text: data.mensaje,
                confirmButtonText: 'Aceptar'
            }).then(() => {
                document.getElementById('cargarUsuarios').click(); // Recargar la lista de usuarios
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al agregar el usuario. Por favor, intenta nuevamente.',
            confirmButtonText: 'Aceptar'
        });
    });
});

//Editar usuarios

document.getElementById('formEditarUsuario').addEventListener('submit', function(event) {
    event.preventDefault();

    const id = document.getElementById('editarId').value;
    const nombre = document.getElementById('editarNombre').value;
    const correo = document.getElementById('editarCorreo').value;
    const contrasena = document.getElementById('editarContrasena').value;
    const rol_id = document.getElementById('editarRolId').value;

    fetch('/api/usuarios', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ id, nombre, correo, contrasena, rol_id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.error,
                confirmButtonText: 'Aceptar'
            });
        } else {
            Swal.fire({
                icon: 'success',
                title: '¡Usuario actualizado!',
                text: data.mensaje,
                confirmButtonText: 'Aceptar'
            }).then(() => {
                document.getElementById('editar-usuario').style.display = 'none'; // Ocultar el formulario
                document.getElementById('cargarUsuarios').click(); // Recargar la lista de usuarios
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al actualizar el usuario. Por favor, intenta nuevamente.',
            confirmButtonText: 'Aceptar'
        });
    });
});

document.getElementById('cancelarEdicion').addEventListener('click', function() {
    document.getElementById('editar-usuario').style.display = 'none';
});

function editarUsuario(id) {
    // Obtener los datos del usuario
    fetch(`/api/usuarios?id=${id}`)
        .then(response => response.json())
        .then(usuario => {
            // Llenar el formulario con los datos del usuario
            document.getElementById('editarId').value = usuario.id;
            document.getElementById('editarNombre').value = usuario.nombre;
            document.getElementById('editarCorreo').value = usuario.correo;
            document.getElementById('editarContrasena').value = usuario.contrasena;
            document.getElementById('editarRolId').value = usuario.rol_id;

            // Mostrar el formulario de edición
            document.getElementById('editar-usuario').style.display = 'block';
        })
        .catch(error => console.error('Error:', error));
}

function eliminarUsuario(id) {
    Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará al usuario permanentemente.',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/api/usuarios?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error,
                        confirmButtonText: 'Aceptar'
                    });
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Usuario eliminado!',
                        text: data.mensaje,
                        confirmButtonText: 'Aceptar'
                    }).then(() => {
                        document.getElementById('cargarUsuarios').click(); // Recargar la lista de usuarios
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al eliminar el usuario. Por favor, intenta nuevamente.',
                    confirmButtonText: 'Aceptar'
                });
            });
        }
    });
}

function cancelarEdicion(botonCancelar) {
    const fila = botonCancelar.closest('tr');
    const celdasEditables = fila.querySelectorAll('.editable');

    fila.querySelector('.btn-primary').style.display = 'inline-block';
    fila.querySelector('.btn-success').style.display = 'none';
    fila.querySelector('.btn-danger').style.display = 'none';

    celdasEditables.forEach(celda => {
        celda.innerHTML = celda.getAttribute('data-valor-original');
        document.getElementById('cargarUsuarios').click();
    });
}

function guardarCambios(botonGuardar) {
    const fila = botonGuardar.closest('tr');
    const id = fila.getAttribute('data-id');

    const datosActualizados = {
        nombre: fila.querySelector('[data-field="nombre"] input').value,
        correo: fila.querySelector('[data-field="correo"] input').value,
        contrasena: fila.querySelector('[data-field="contrasena"] input').value,
        rol_id: fila.querySelector('[data-field="rol_id"] select').value
    };

    if (!id || !datosActualizados.nombre || !datosActualizados.correo || !datosActualizados.rol_id) {
        // Mostrar SweetAlert de error si faltan campos obligatorios
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Los campos nombre, correo y rol son obligatorios.',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    // Si la contraseña está vacía, no la enviamos
    if (!datosActualizados.contrasena) {
        delete datosActualizados.contrasena;
    }

    fetch('/api/usuarios', {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}` // Agregar el token de autorización
        },
        body: JSON.stringify({ id, ...datosActualizados })
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
                title: '¡Usuario actualizado!',
                text: data.mensaje,
                confirmButtonText: 'Aceptar'
            }).then(() => {
                document.getElementById('cargarUsuarios').click(); // Recargar la lista de usuarios
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Mostrar SweetAlert de error en caso de fallo en la solicitud
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al actualizar el usuario. Por favor, intenta nuevamente.',
            confirmButtonText: 'Aceptar'
        });
    });
}

function habilitarEdicion(botonEditar) {
    const fila = botonEditar.closest('tr');
    const celdasEditables = fila.querySelectorAll('.editable');

    botonEditar.style.display = 'none';
    fila.querySelector('.btn-success').style.display = 'inline-block';
    fila.querySelector('.btn-danger').style.display = 'inline-block';

    celdasEditables.forEach(celda => {
        const campo = celda.getAttribute('data-field');

        if (campo === 'rol_id') {
            const valorActual = celda.textContent;
            celda.innerHTML = `
                <select class="form-control">
                    <option value="1" ${valorActual === 'Admin' ? 'selected' : ''}>Admin</option>
                    <option value="2" ${valorActual === 'Cliente' ? 'selected' : ''}>Cliente</option>
                </select>`;
        } else if (campo === 'contrasena') {
            // Hacer el campo de contraseña opcional
            celda.innerHTML = `
                <input type="password" class="form-control" placeholder="Dejar en blanco para no cambiar">`;
        } else {
            const valorActual = celda.textContent;
            celda.innerHTML = `<input type="text" class="form-control" value="${valorActual}">`;
        }
    });
}

function getToken() {
    return localStorage.getItem('token');
}