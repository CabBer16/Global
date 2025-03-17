document.addEventListener('DOMContentLoaded', function () {
    const tbody = document.querySelector('#tabla-bitacora tbody');

    // Mostrar mensaje de carga
    tbody.innerHTML = `<tr><td colspan="7" class="loading">Cargando bitácora...</td></tr>`;

    fetch('/api/bitacora')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener la bitácora');
            }
            return response.json();
        })
        .then(data => {
            // Limpiar el mensaje de carga
            tbody.innerHTML = '';

            // Ordenar los registros por fecha (de más reciente a más antiguo)
            data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

            // Mostrar los registros en la tabla
            data.forEach(registro => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${registro.id}</td>
                    <td>${registro.usuario}</td>
                    <td>${registro.tabla_afectada}</td>
                    <td>${registro.accion}</td>
                    <td>${new Date(registro.fecha).toLocaleString()}</td>
                    <td>${registro.sentencia}</td>
                    <td>${registro.contrasentencia}</td>
                `;

                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error al obtener la bitácora:', error);

            // Mostrar mensaje de error con SweetAlert2
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo cargar la bitácora. Por favor, intenta nuevamente.',
            });

            // Mostrar mensaje de error en la tabla
            tbody.innerHTML = `<tr><td colspan="7" class="error">Error al cargar la bitácora.</td></tr>`;
        });
});