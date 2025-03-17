document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token'); // Cambia orderID por token

        if (token) {
            try {
                const response = await fetch('/api/capturar/paypal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderId: token }), // Envía el token como orderId
                });

                const data = await response.json();
                if (data.status === 'COMPLETED') {
                    alert('Pago completado con éxito');
                    window.location.href = 'home_cliente.html';
                } else {
                    alert('Error al completar el pago: ' + (data.error || 'Inténtalo de nuevo'));
                }
            } catch (error) {
                console.error('Error al capturar el pago:', error);
                alert('Error al procesar el pago. Por favor, intenta nuevamente.');
            }
        } else {
            alert('No se encontró el token de la orden. Por favor, revisa tu pedido.');
        }
        
});

async function capturarPago(orderId) {
    const response = await fetch('/api/capturar/paypal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
    });

    const data = await response.json();

    if (data.status === 'COMPLETED') {
        alert('Pago completado exitosamente');
        window.location.href = '/confirmacion.html'; // Redirige a la página de éxito
    } else {
        alert('Error al completar el pago');
    }
}