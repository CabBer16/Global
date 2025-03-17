const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

// Configura el entorno de PayPal (Sandbox o Producción)
function environment() {
    let clientId = 'AR2G7LooVUIcD-mr0vWBX1WlPrTKF7dXjC-M--LLWTSFrdwzTuebgeyuoU13aqiEGXHM7YMU3wogBU1i'; // Reemplaza con tu Client ID
    let clientSecret = 'EA3T4nDcSdwqsjATEmAZnKwEqCVlzQlQYnFDh0amZL-pL-bEvmyV05CeRQ-OHiuJ8xaACCR1ZPUVNBGv'; // Reemplaza con tu Secret

    return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
    // Para producción, usa:
    // return new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
}

// Crea el cliente de PayPal
function client() {
    return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

module.exports = { client };

