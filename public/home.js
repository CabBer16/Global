// Verificar si el usuario está logueado
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
console.log('Estado de autenticación:', isLoggedIn); // Depuración

// Obtener el elemento del enlace de autenticación
const authLink = document.getElementById('auth-link');
console.log('Elemento auth-link:', authLink); // Depuración

if (authLink) {
    if (isLoggedIn) {
        // Si el usuario está logueado, mostrar "Cerrar sesión"
        authLink.innerHTML = '<a href="#" id="logout-link">Cerrar sesión</a>';
        console.log('Mostrando "Cerrar sesión"'); // Depuración

        // Agregar un evento para cerrar sesión
        const logoutLink = document.getElementById('logout-link');
        if (logoutLink) {
            logoutLink.addEventListener('click', function (e) {
                e.preventDefault(); // Evitar que el enlace redirija
                console.log('Cerrando sesión...'); // Depuración
                localStorage.removeItem('isLoggedIn'); // Eliminar el estado de autenticación
                localStorage.removeItem('token'); // Eliminar el token
                localStorage.removeItem('usuario'); // Eliminar el usuario
                window.location.href = 'index.html'; // Redirigir al login
            });
        } else {
            console.error('No se encontró el enlace de cierre de sesión'); // Depuración
        }
    } else {
        // Si el usuario no está logueado, mostrar "Login"
        authLink.innerHTML = '<a href="index.html">Login</a>';
        console.log('Mostrando "Login"'); // Depuración
    }
} else {
    console.error('No se encontró el elemento auth-link'); // Depuración
}

// Mostrar/ocultar la información de contacto
document.getElementById('boton-contacto').addEventListener('click', function () {
    document.getElementById('contacto-flotante').classList.toggle('mostrar');
});

// Ocultar la información de contacto al hacer clic fuera
document.addEventListener('click', function (event) {
    const contactoFlotante = document.getElementById('contacto-flotante');
    const botonContacto = document.getElementById('boton-contacto');
    if (!contactoFlotante.contains(event.target)) {
        contactoFlotante.classList.remove('mostrar');
    }
});