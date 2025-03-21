
function cerrarSesion() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn'); // Eliminar el estado de autenticación
    window.location.href = 'index.html';
}

// Registro 

document.getElementById('formRegistro')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const contrasena = document.getElementById('contrasena').value.trim();

    // Validación básica
    if (!nombre || !correo || !contrasena) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Todos los campos son obligatorios.',
        });
        return;
    }

    if (contrasena.length < 8) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La contraseña debe tener al menos 8 caracteres.',
        });
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El correo no es válido.',
        });
        return;
    }

    // Enviar datos al servidor
    fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, contrasena })
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
                title: '¡Registro exitoso!',
                text: data.mensaje,
                timer: 5000, // Duración de 5 segundos
                showConfirmButton: false,
            }).then(() => {
                window.location.href = 'index.html'; // Redirigir después de 5 segundos
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al conectar con el servidor.',
        });
    });
});

// LOGIN

document.getElementById('formLogin')?.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario

    const correo = document.getElementById('emailLogin').value.trim();
    const contrasena = document.getElementById('passwordLogin').value.trim();

    // Validación básica
    if (!correo || !contrasena) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Correo y contraseña son obligatorios.',
        });
        return;
    }

    // Enviar datos al servidor
    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.error,
            });
        } else {
            // Guardar el token y usuario en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            localStorage.setItem('isLoggedIn', 'true');

            // Mostrar SweetAlert de éxito
            Swal.fire({
                icon: 'success',
                title: '¡Inicio de sesión exitoso!',
                text: 'Serás redirigido en breve.',
                timer: 3000, // Duración de 3 segundos
                showConfirmButton: false,
            }).then(() => {
                // Redirigir según el rol del usuario
                if (data.usuario.rol === 'admin') {
                    window.location.href = 'home_admin.html';
                } else {
                    window.location.href = 'home.html';
                }
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al iniciar sesión.',
        });
    });
});

