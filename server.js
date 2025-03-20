const http = require('http');
const fs = require('fs');
const path = require('url');
const mysql = require('mysql2');

const bcrypt = require('bcrypt');



const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'adopta_pets'
});

db.connect(err => {
    if (err) {
        console.error('Error de conexión a MySQL:', err);
    } else {
        console.log('Conectado a MySQL');
    }
});

const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'a23310409@ceti.mx', 
        pass: 'mmkb guzk mqjz vsvb' 
    }
});

const jwt = require('jsonwebtoken');
const secretKey = 'usertoken';

function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Acceso denegado. Token no proporcionado.' }));
    }

    const token = authHeader.split(' ')[1]; // Extrae solo el token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Token inválido' }));
        }

        req.usuario = decoded; 
        next();
    });
}

function obtenerUsuarioNombre(req) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        console.error('No se proporcionó el encabezado de autorización');
        return null; 
    }

    const token = authHeader.split(' ')[1]; 
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded.nombre; 
    } catch (error) {
        console.error('Error al verificar el token:', error);
        return null;
    }
}

function registrarBitacora(usuarioNombre, tablaAfectada, accion, sentencia, contrasentencia) {
    const query = `
        INSERT INTO bitacora (usuario_nombre, tabla_afectada, accion, sentencia, contrasentencia)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(query, [usuarioNombre, tablaAfectada, accion, sentencia, contrasentencia], (err, result) => {
        if (err) {
            console.error('Error al registrar en la bitácora:', err);
        } else {
            console.log('Registro en la bitácora exitoso');
        }
    });
}

/* 

if (req.url.startsWith('/api/')) {
        verificarToken(req, res, () => {

        
        
           
        });
    } else {
        // Aquí van tus rutas que no requieren autenticación
        // ...
    }



*/

const server = http.createServer(async (req, res) => {
    const url = path.parse(req.url, true);
    const pathname = url.pathname;

   /* const filePath = path.join(__dirname, 'public', req.url);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Archivo no encontrado');
        } else {
            const ext = path.extname(filePath).toLowerCase();
            let contentType = 'text/plain';

            // Configura el tipo MIME según la extensión del archivo
            switch (ext) {
                case '.jpg':
                case '.jpeg':
                    contentType = 'image/jpeg';
                    break;
                case '.png':
                    contentType = 'image/png';
                    break;
                case '.gif':
                    contentType = 'image/gif';
                    break;
                case '.css':
                    contentType = 'text/css';
                    break;
                case '.js':
                    contentType = 'application/javascript';
                    break;
                case '.html':
                    contentType = 'text/html';
                    break;
            }

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });*/

    if (pathname === '/' || pathname === '/home.html') {
        fs.readFile('./public/home.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error al cargar la página');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });

    } 

    else if (pathname === '/home.js') {
        fs.readFile('./public/home.js', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });
    }

    else if (pathname === '/script.js') {
        fs.readFile('./public/script.js', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });
    } else if (pathname === '/styles.css') {
        fs.readFile('./public/styles.css', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(data);
        });
    } 

    else if (pathname === '/productos_admin.js') {
        fs.readFile('./public/productos_admin.js', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });
    }
    else if (pathname === '/gestion_usuarios.js') {
        fs.readFile('./public/gestion_usuarios.js', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });
    }

    else if (pathname === '/productos_clientes.js') {
        fs.readFile('./public/productos_clientes.js', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });
    }

    else if (pathname === '/carrito.js') {
        fs.readFile('./public/carrito.js', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });
    }
    else if (pathname === "/carrito.html") {
        fs.readFile('./public/carrito.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error al cargar la página del cliente');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }

    else if (pathname === "/confirmacion.html") {
        fs.readFile('./public/confirmacion.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error al cargar la página del cliente');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }
    else if (pathname === '/confirmacion.js') {
        fs.readFile('./public/confirmacion.js', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });
    }
    else if (pathname === '/paypal.js') {
        fs.readFile('./public/paypal.js', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });
    }
    else if (pathname === "/bitacora.html") {
        fs.readFile('./public/bitacora.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error al cargar la página del cliente');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }
    else if (pathname === '/bitacora.js') {
        fs.readFile('./public/bitacora.js', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });
    }

    else if (pathname === "/adopcion.html") {
        fs.readFile('./public/adopcion.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error al cargar la página del cliente');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }

    else if (pathname === "/adopcion_admin.html") {
        fs.readFile('./public/adopcion_admin.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error al cargar la página del cliente');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }

                                                                                             
    //Api para registrar
    else if (pathname === '/api/registro' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const { nombre, correo, contrasena } = JSON.parse(body);
    
                // Validar datos
                if (!nombre || !correo || !contrasena) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Todos los campos son obligatorios' }));
                }
    
                if (contrasena.length < 8) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'La contraseña debe tener al menos 8 caracteres' }));
                }
    
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'El correo no es válido' }));
                }
    
                const queryVerificar = 'SELECT id FROM usuarios WHERE correo = ?';
                db.query(queryVerificar, [correo], async (err, resultados) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Error al verificar el correo' }));
                    }
    
                    if (resultados.length > 0) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'El correo ya está registrado' }));
                    }
    
                    const contrasenaHash = await bcrypt.hash(contrasena, 10);
    
                    const queryInsertar = 'INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)';
                    db.query(queryInsertar, [nombre, correo, contrasenaHash], (err, result) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            return res.end(JSON.stringify({ error: 'Error al registrar usuario' }));
                        }
    
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ mensaje: 'Usuario registrado exitosamente' }));
                    });
                });
            } catch (error) {
                console.error('Error al procesar la solicitud:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error interno del servidor' }));
            }
        });
    }

    

    //Api para login

    else if (pathname === '/api/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const { correo, contrasena } = JSON.parse(body);
    
                if (!correo || !contrasena) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Correo y contraseña son obligatorios' }));
                }
    
                const query = `
                    SELECT usuarios.id, usuarios.nombre, usuarios.correo, usuarios.contrasena, roles.rol 
                    FROM usuarios 
                    INNER JOIN roles ON usuarios.rol_id = roles.id 
                    WHERE usuarios.correo = ?
                `;
                db.query(query, [correo], async (err, results) => {
                    if (err) {
                        console.error('Error en la consulta SQL:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Error en el servidor' }));
                    }
    
                    if (results.length === 0) {
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Usuario no encontrado' }));
                    }
    
                    const usuario = results[0];
    
                    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
                    if (!contrasenaValida) {
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Contraseña incorrecta' }));
                    }
    
                    const token = jwt.sign(
                        { usuario_id: usuario.id, correo: usuario.correo, rol: usuario.rol }, 
                        secretKey, 
                        { expiresIn: '2h' } 
                    );
    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ 
                        mensaje: 'Inicio de sesión exitoso', 
                        token, 
                        usuario: {
                            id: usuario.id,
                            nombre: usuario.nombre,
                            correo: usuario.correo,
                            rol_id: usuario.rol_id,
                            rol: usuario.rol
                        } 
                    }));
                });
            } catch (error) {
                console.error('Error al procesar la solicitud:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Formato de datos inválido' }));
            }
        });
    }



    else if (pathname === '/registro.html') {
        fs.readFile('./public/registro.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error al cargar la página de registro');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }

    else if (pathname === "/index.html") {
        fs.readFile('./public/index.html', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }

    else if (pathname === "/home_cliente.html") {
        fs.readFile('./public/home_cliente.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error al cargar la página de inicio del cliente');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }

    else if (pathname === "/home_admin.html") {
        fs.readFile('./public/home_admin.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error al cargar la página de inicio del cliente');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }

    else if (pathname === '/api/usuarios' && req.method === 'GET') {
        const query = `
            SELECT usuarios.id, usuarios.nombre, usuarios.correo, roles.rol 
            FROM usuarios 
            INNER JOIN roles ON usuarios.rol_id = roles.id`;
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error en la consulta SQL:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error al obtener usuarios' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(results));
            }
        });
    }
    
    // Obtener usuarios

    else if (pathname === '/api/usuarios' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
    
        req.on('end', () => {
            try {
                const { nombre, correo, contrasena, rol_id } = JSON.parse(body);
    
                if (!nombre || !correo || !contrasena || !rol_id) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Todos los campos son obligatorios' }));
                }
    
                const query = 'INSERT INTO usuarios (nombre, correo, contrasena, rol_id) VALUES (?, ?, ?, ?)';
                db.query(query, [nombre, correo, contrasena, rol_id], (err, result) => {
                    if (err) {
                        console.error('Error en la consulta SQL:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Error al agregar usuario' }));
                    } else {
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ mensaje: 'Usuario agregado exitosamente' }));
                    }
                });
            } catch (error) {
                console.error('Error al parsear el cuerpo de la solicitud:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Formato de datos inválido' }));
            }
        });
    }
    
    // Agregar usuarios

    else if (pathname === '/api/usuarios' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
    
        req.on('end', async () => {
            try {
                const { nombre, correo, contrasena, rol_id } = JSON.parse(body);
    
                if (!nombre || !correo || !contrasena || !rol_id) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Todos los campos son obligatorios' }));
                }
    
                console.log('Datos recibidos:', { nombre, correo, contrasena, rol_id }); 
    
                const saltRounds = 10; 
                const contrasenaHash = await bcrypt.hash(contrasena, saltRounds); 
                console.log('Contraseña hash:', contrasenaHash); 
    
                const query = 'INSERT INTO usuarios (nombre, correo, contrasena, rol_id) VALUES (?, ?, ?, ?)';
                console.log('Query:', query); 
                console.log('Valores:', [nombre, correo, contrasenaHash, rol_id]); 
    
                db.query(query, [nombre, correo, contrasenaHash, rol_id], (err, result) => {
                    if (err) {
                        console.error('Error en la consulta SQL:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Error al agregar usuario', detalles: err.message }));
                    } else {
                        console.log('Usuario agregado correctamente:', result); 
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ mensaje: 'Usuario agregado exitosamente' }));
                    }
                });
            } catch (error) {
                console.error('Error al procesar la solicitud:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error interno del servidor', detalles: error.message }));
            }
        });
    }

// Modificar usuarios
else if (pathname === '/api/usuarios' && req.method === 'PUT') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });

    req.on('end', async () => {
        try {
            const { id, nombre, correo, contrasena, rol_id } = JSON.parse(body);

            if (!id || !nombre || !correo || !rol_id) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Los campos nombre, correo y rol son obligatorios' }));
            }

            let contrasenaHash = null;
            if (contrasena) {
                const salt = await bcrypt.genSalt(10);
                contrasenaHash = await bcrypt.hash(contrasena, salt);
            }

            let query = 'UPDATE usuarios SET nombre = ?, correo = ?, rol_id = ?';
            const params = [nombre, correo, rol_id];

            if (contrasenaHash) {
                query += ', contrasena = ?';
                params.push(contrasenaHash);
            }

            query += ' WHERE id = ?';
            params.push(id);

            db.query(query, params, (err, result) => {
                if (err) {
                    console.error('Error en la consulta SQL:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Error al actualizar usuario' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ mensaje: 'Usuario actualizado exitosamente' }));
                }
            });
        } catch (error) {
            console.error('Error al parsear el cuerpo de la solicitud:', error);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Formato de datos inválido' }));
        }
    });
}


// Eliminar usuario
else if (pathname === '/api/usuarios' && req.method === 'DELETE') {
    const urlParams = new URL(req.url, `http://${req.headers.host}`).searchParams;
    const id = urlParams.get('id');

    if (!id) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'ID de usuario es obligatorio' }));
    }

    const query = 'DELETE FROM usuarios WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error en la consulta SQL:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al eliminar usuario' }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Usuario eliminado exitosamente' }));
        }
    });
}

    else if (pathname === '/gestion_usuarios.html') {
        fs.readFile('./public/gestion_usuarios.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error al cargar la página de gestión de usuarios');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }

    //Obtener correo usuario

    else if (pathname === '/api/usuario/correo' && req.method === 'GET') {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const usuarioId = url.searchParams.get('usuarioId'); 
    
        if (!usuarioId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Usuario no autenticado' }));
        }
    
        const query = 'SELECT correo FROM usuarios WHERE id = ?';
        db.query(query, [usuarioId], (err, results) => {
            if (err) {
                console.error('Error en la consulta SQL:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Error al obtener el correo del usuario' }));
            }
    
            if (results.length === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Usuario no encontrado' }));
            }
    
            const correo = results[0].correo;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ correo }));
        });
    }

    //PRODUCTOS

    else if (pathname === '/productos_admin.html') {
        fs.readFile('./public/productos_admin.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error al cargar la página de gestión de usuarios');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }

    else if (pathname === '/productos_cliente.html') {
        fs.readFile('./public/productos_cliente.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error al cargar la página de gestión de usuarios');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }

    else if (pathname === '/api/productos' && req.method === 'GET') {
        const query = 'SELECT * FROM productos';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error en la consulta SQL:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error al obtener productos' }));
            } else {

                const productos = results.map(producto => ({
                    ...producto,
                    precio: parseFloat(producto.precio) 
                }));

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(results));
            }
        });
    }

    //AGREGAR PRODUCTOS
    else if (pathname === '/api/productos' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
    
        req.on('end', () => {
            try {
                /* const usuario_id = obtenerUsuarioId(req); // Obtiene el usuario desde el token
    
                if (!usuario_id) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'No autorizado. Debes iniciar sesión.' }));
                }*/
    
                const { nombre, descripcion, precio, imagen, stock, tipo_instrumento } = JSON.parse(body);
    
                if (!nombre || !descripcion || !precio || !imagen || !stock || !tipo_instrumento) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Todos los campos son obligatorios' }));
                }
    
                const query = 'INSERT INTO productos (nombre, descripcion, precio, imagen, stock, tipo_instrumento) VALUES (?, ?, ?, ?, ?, ?)';
                db.query(query, [nombre, descripcion, precio, imagen, stock, tipo_instrumento], (err, result) => {
                    if (err) {
                        console.error('Error en la consulta SQL:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Error al agregar producto' }));
                    }
    
                    /* Crear la sentencia y contrasentencia para la bitácora
                    const sentencia = `INSERT INTO productos (nombre, descripcion, precio, imagen, stock) VALUES ('${nombre}', '${descripcion}', ${precio}, '${imagen}', ${stock})`;
                    const contrasentencia = `DELETE FROM productos WHERE id = ${result.insertId}`;
    
                    registrarBitacora(usuario_id, 'productos', 'insert', sentencia, contrasentencia); ¨*/
    
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ mensaje: 'Producto agregado exitosamente' }));
                });
            } catch (error) {
                console.error('Error al parsear el cuerpo de la solicitud:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Formato de datos inválido' }));
            }
        });
    }
    
    
    // EDITAR PRODUCTOS 
     
    else if (pathname.startsWith('/api/productos') && req.method === 'PUT') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
    
        req.on('end', () => {
            try {
                const { nombre, descripcion, precio, imagen, stock, tipo_instrumento } = JSON.parse(body);
                const id = pathname.split('/')[3]; // Extraer ID de la URL (Ejemplo: /api/productos/5)
    
                if (!id || isNaN(id)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'ID de producto inválido' }));
                }
    
                if (!nombre || !descripcion || !precio || !stock || !tipo_instrumento) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Todos los campos son obligatorios excepto la imagen' }));
                }
    
                let query = 'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, tipo_instrumento =? WHERE id = ?';
                let values = [nombre, descripcion, precio, stock, tipo_instrumento, id];
    
                if (imagen) {
                    query = 'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, imagen = ?, tipo_instrumento WHERE id = ?';
                    values = [nombre, descripcion, precio, stock, imagen, tipo_instrumento, id];
                }
    
                db.query(query, values, (err, result) => {
                    if (err) {
                        console.error('Error en la consulta SQL:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Error al actualizar producto' }));
                    }
    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ mensaje: 'Producto actualizado exitosamente' }));
                });
            } catch (error) {
                console.error('Error al parsear el cuerpo de la solicitud:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Formato de datos inválido' }));
            }
        });
    }

    // ELIMINAR PRODUCTOS

    else if (pathname === '/api/productos' && req.method === 'DELETE') {
        const urlParams = new URL(req.url, `http://${req.headers.host}`).searchParams;
        const id = urlParams.get('id');
    
        if (!id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'ID de producto es obligatorio' }));
        }
    
        const query = 'DELETE FROM productos WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) {
                console.error('Error en la consulta SQL:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error al eliminar producto' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ mensaje: 'Producto eliminado exitosamente' }));
            }
        });
    }

    // Ruta para obtener productos disponibles
    else if (pathname === '/api/productos/disponibles' && req.method === 'GET') {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const tipo = url.searchParams.get('tipo'); 
    
        let query = 'SELECT id, nombre, descripcion, precio, stock, CAST(imagen AS CHAR) AS ImagenBase64, tipo_instrumento FROM productos WHERE stock > 0';

        if (tipo && tipo !== 'todos') {
            query += ` AND tipo_instrumento = '${tipo}'`;
        }
    
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error en la consulta SQL:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Error al obtener productos' }));
            }
    
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(results));
        });
    }

    else if (pathname.startsWith('/api/productos/') && req.method === 'GET') {
        const productoId = pathname.split('/')[3]; // Extraer el ID de la URL
    
        const query = 'SELECT id, nombre, descripcion, precio, stock, tipo_instrumento, CAST(imagen AS CHAR) AS ImagenBase64 FROM productos WHERE id = ?';
        db.query(query, [productoId], (err, results) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Error al obtener el producto' }));
            }
    
            if (results.length === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Producto no encontrado' }));
            }
    
            const producto = results[0];
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(producto));
        });
    }



    //Carrito

    // Obtener productos en el carrito
    else if (pathname === '/api/carrito' && req.method === 'GET') {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const usuarioId = url.searchParams.get('usuarioId'); 
    
        if (!usuarioId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Usuario no autenticado' }));
        }
    
        const query = `
            SELECT p.id, p.nombre, p.descripcion, p.precio, CAST (p.imagen AS CHAR) AS ImagenBase64, p.tipo_instrumento, c.cantidad
            FROM carrito c
            JOIN productos p ON c.producto_id = p.id
            WHERE c.usuario_id = ?`;
        db.query(query, [usuarioId], (err, results) => {
            if (err) {
                console.error('Error en la consulta SQL:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Error al obtener el carrito' }));
            }
    
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(results)); 
        });
    }

// Actualizar cantidad de un producto en el carrito
else if (pathname.startsWith('/api/carrito/') && req.method === 'PUT') {
    const productoId = pathname.split('/')[3];
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
        const { cantidad } = JSON.parse(body);
        const query = 'UPDATE carrito SET cantidad = ? WHERE producto_id = ?';
        db.query(query, [cantidad, productoId], (err, result) => {
            if (err) {
                console.error('Error en la consulta SQL:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Error al actualizar el carrito' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Cantidad actualizada exitosamente' }));
        });
    });
}

// Eliminar un producto del carrito
else if (pathname.startsWith('/api/carrito/') && req.method === 'DELETE') {
    const productoId = pathname.split('/')[3];
    const query = 'DELETE FROM carrito WHERE producto_id = ?';
    db.query(query, [productoId], (err, result) => {
        if (err) {
            console.error('Error en la consulta SQL:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Error al eliminar del carrito' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensaje: 'Producto eliminado del carrito' }));
    });
}

    //Agregar productos al carrito 
    else if (pathname === '/api/carrito' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const { usuarioId, productoId, cantidad } = JSON.parse(body);
    
                if (!usuarioId || !productoId || !cantidad) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Todos los campos son obligatorios' }));
                }
    
                const query = 'INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)';
                db.query(query, [usuarioId, productoId, cantidad], (err, result) => {
                    if (err) {
                        console.error('Error en la consulta SQL:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Error al agregar al carrito' }));
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ mensaje: 'Producto agregado al carrito' }));
                });
            } catch (error) {
                console.error('Error al parsear el cuerpo de la solicitud:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Formato de datos inválido' }));
            }
        });
    }

    else if (pathname === '/api/carrito/cantidad' && req.method === 'GET') {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const usuarioId = url.searchParams.get('usuarioId'); 
    
        if (!usuarioId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Usuario no autenticado' }));
        }
    
        const query = 'SELECT SUM(cantidad) AS cantidad FROM carrito WHERE usuario_id = ?';
        db.query(query, [usuarioId], (err, results) => {
            if (err) {
                console.error('Error en la consulta SQL:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Error al obtener la cantidad del carrito' }));
            }
    
            const cantidad = results[0].cantidad || 0;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ cantidad }));
        });
    }
    

    //Generar PDF y mandar correo

    else if (pathname === '/api/pagar/pdf' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const { usuarioId, correo } = JSON.parse(body);
    
                if (!usuarioId || !correo) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Datos incompletos' }));
                }
    
                const queryCarrito = `
                    SELECT p.id, p.nombre, p.precio, c.cantidad
                    FROM carrito c
                    JOIN productos p ON c.producto_id = p.id
                    WHERE c.usuario_id = ?`;
                db.query(queryCarrito, [usuarioId], (err, resultados) => {
                    if (err) {
                        console.error('Error en la consulta SQL:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Error al obtener el carrito' }));
                    }
    
                    if (resultados.length === 0) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'El carrito está vacío' }));
                    }
    
                    const totalCompra = resultados.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
    
                    const ordenId = `ORDEN_${Date.now()}`; 
                    const queryOrden = `
                        INSERT INTO ordenes (id, usuario_id, total, fecha)
                        VALUES (?, ?, ?, NOW())`;
                    db.query(queryOrden, [ordenId, usuarioId, totalCompra], (err, result) => {
                        if (err) {
                            console.error('Error en la consulta SQL:', err);
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            return res.end(JSON.stringify({ error: 'Error al crear la orden' }));
                        }
    
                        let detallesInsertados = 0;
                        resultados.forEach(producto => {
                            const queryDetalles = `
                                INSERT INTO detalles_orden (orden_id, producto_id, cantidad, precio)
                                VALUES (?, ?, ?, ?)`;
                            db.query(queryDetalles, [ordenId, producto.id, producto.cantidad, producto.precio], (err, result) => {
                                if (err) {
                                    console.error('Error en la consulta SQL:', err);
                                    res.writeHead(500, { 'Content-Type': 'application/json' });
                                    return res.end(JSON.stringify({ error: 'Error al insertar detalles de la orden' }));
                                }
    
                                detallesInsertados++;
                                if (detallesInsertados === resultados.length) {
                                    const queryPago = `
                                        INSERT INTO pagos (orden_id, usuario_id, metodo, estado, fecha)
                                        VALUES (?, ?, 'PDF', 'Completado', NOW())`;
                                    db.query(queryPago, [ordenId, usuarioId], (err, result) => {
                                        if (err) {
                                            console.error('Error en la consulta SQL:', err);
                                            res.writeHead(500, { 'Content-Type': 'application/json' });
                                            return res.end(JSON.stringify({ error: 'Error al registrar el pago' }));
                                        }
    
                                        const doc = new PDFDocument({ margin: 50 });
                                        let buffers = [];
                                        doc.on('data', buffers.push.bind(buffers));
                                        doc.on('end', () => {
                                            const pdfBuffer = Buffer.concat(buffers);
    
                                            const mailOptions = {
                                                from: 'tucorreo@gmail.com',
                                                to: correo,
                                                subject: 'Compra en AdoptaPet',
                                                text: 'Detalles de tu compra en AdoptaPet, muchas gracias por su compra.',
                                                attachments: [{ filename: 'adoptapet.pdf', content: pdfBuffer }]
                                            };
    
                                            transporter.sendMail(mailOptions, (error, info) => {
                                                if (error) {
                                                    console.error('Error al enviar el correo:', error);
                                                    res.writeHead(500, { 'Content-Type': 'application/json' });
                                                    return res.end(JSON.stringify({ error: 'Error al enviar el correo' }));
                                                }
    
                                                const deleteQuery = 'DELETE FROM carrito WHERE usuario_id = ?';
                                                db.query(deleteQuery, [usuarioId], (err, result) => {
                                                    if (err) {
                                                        console.error('Error al limpiar el carrito:', err);
                                                        res.writeHead(500, { 'Content-Type': 'application/json' });
                                                        return res.end(JSON.stringify({ error: 'Error al limpiar el carrito' }));
                                                    }
    
                                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                                    res.end(JSON.stringify({ success: true, mensaje: 'PDF enviado exitosamente', ordenId }));
                                                });
                                            });
                                        });
    
                                        doc.fontSize(24).text('AdoptaPet', { align: 'center', underline: true });
                                        doc.moveDown();
                                        doc.fontSize(16).text('¡Gracias por tu compra!', { align: 'center' });
                                        doc.moveDown(2);
    
                                        doc.fontSize(14).text('Detalles:', { underline: true });
                                        doc.moveDown();
    
                                        const tableStartX = 50;
                                        const tableStartY = 150;
                                        const columnWidths = [200, 80, 100, 100];
                                        const rowHeight = 25;
    
                                        doc.font('Helvetica-Bold');
                                        doc.text('Producto', tableStartX, tableStartY, { width: columnWidths[0] });
                                        doc.text('Cantidad', tableStartX + columnWidths[0], tableStartY, { width: columnWidths[1], align: 'center' });
                                        doc.text('Precio', tableStartX + columnWidths[0] + columnWidths[1], tableStartY, { width: columnWidths[2], align: 'right' });
                                        doc.text('Subtotal', tableStartX + columnWidths[0] + columnWidths[1] + columnWidths[2], tableStartY, { width: columnWidths[3], align: 'right' });
                                        doc.moveDown();
    
                                        doc.moveTo(tableStartX, tableStartY + rowHeight - 5)
                                            .lineTo(tableStartX + columnWidths.reduce((a, b) => a + b), tableStartY + rowHeight - 5)
                                            .stroke();
    
                                        doc.font('Helvetica');
                                        let currentY = tableStartY + rowHeight;
                                        let total = 0;
    
                                        resultados.forEach(producto => {
                                            const precio = parseFloat(producto.precio);
                                            const subtotal = precio * producto.cantidad;
                                            total += subtotal;
    
                                            doc.text(producto.nombre, tableStartX, currentY, { width: columnWidths[0] });
                                            doc.text(producto.cantidad.toString(), tableStartX + columnWidths[0], currentY, { width: columnWidths[1], align: 'center' });
                                            doc.text(`$${precio.toFixed(2)}`, tableStartX + columnWidths[0] + columnWidths[1], currentY, { width: columnWidths[2], align: 'right' });
                                            doc.text(`$${subtotal.toFixed(2)}`, tableStartX + columnWidths[0] + columnWidths[1] + columnWidths[2], currentY, { width: columnWidths[3], align: 'right' });
    
                                            currentY += rowHeight;
                                        });
    
                                        doc.moveTo(tableStartX, currentY + 5)
                                            .lineTo(tableStartX + columnWidths.reduce((a, b) => a + b), currentY + 5)
                                            .stroke();
    
                                        doc.font('Helvetica-Bold');
                                        doc.text('Total:', tableStartX + columnWidths[0] + columnWidths[1] - 30, currentY + 10, { width: columnWidths[2], align: 'right' });
                                        doc.text(`$${total.toFixed(2)}`, tableStartX + columnWidths[0] + columnWidths[1] + columnWidths[2], currentY + 10, { width: columnWidths[3], align: 'right' });
    
                                        currentY += 50;
    
                                        doc.end();
                                    });
                                }
                            });
                        });
                    });
                });
            } catch (error) {
                console.error('Error al procesar la solicitud:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Formato de datos inválido' }));
            }
        });
    }

    //PAYPAL

    else if (pathname === '/api/pago' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const { usuarioId, total } = JSON.parse(body);
    
                if (!usuarioId || !total) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Datos incompletos' }));
                }
    
                const queryCarrito = `
                    SELECT p.id, p.nombre, p.precio, c.cantidad
                    FROM carrito c
                    JOIN productos p ON c.producto_id = p.id
                    WHERE c.usuario_id = ?`;
                db.query(queryCarrito, [usuarioId], (err, resultados) => {
                    if (err) {
                        console.error('Error en la consulta SQL:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Error al obtener el carrito' }));
                    }
    
                    if (resultados.length === 0) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'El carrito está vacío' }));
                    }
    
                    const ordenId = `ORDEN_${Date.now()}`; 
                    const queryOrden = `
                        INSERT INTO ordenes (id, usuario_id, total, fecha)
                        VALUES (?, ?, ?, NOW())`;
                    db.query(queryOrden, [ordenId, usuarioId, total], (err, result) => {
                        if (err) {
                            console.error('Error en la consulta SQL:', err);
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            return res.end(JSON.stringify({ error: 'Error al crear la orden' }));
                        }
    
                        let detallesInsertados = 0;
                        resultados.forEach(producto => {
                            const queryDetalles = `
                                INSERT INTO detalles_orden (orden_id, producto_id, cantidad, precio)
                                VALUES (?, ?, ?, ?)`;
                            db.query(queryDetalles, [ordenId, producto.id, producto.cantidad, producto.precio], (err, result) => {
                                if (err) {
                                    console.error('Error en la consulta SQL:', err);
                                    res.writeHead(500, { 'Content-Type': 'application/json' });
                                    return res.end(JSON.stringify({ error: 'Error al insertar detalles de la orden' }));
                                }
    
                                detallesInsertados++;
                                if (detallesInsertados === resultados.length) {
                                    const queryPago = `
                                        INSERT INTO pagos (orden_id, usuario_id, metodo, estado, fecha)
                                        VALUES (?, ?, 'PAYPAL', 'Completado', NOW())`;
                                    db.query(queryPago, [ordenId, usuarioId], (err, result) => {
                                        if (err) {
                                            console.error('Error en la consulta SQL:', err);
                                            res.writeHead(500, { 'Content-Type': 'application/json' });
                                            return res.end(JSON.stringify({ error: 'Error al registrar el pago' }));
                                        }
    
                                        const deleteQuery = 'DELETE FROM carrito WHERE usuario_id = ?';
                                        db.query(deleteQuery, [usuarioId], (err, result) => {
                                            if (err) {
                                                console.error('Error al limpiar el carrito:', err);
                                                res.writeHead(500, { 'Content-Type': 'application/json' });
                                                return res.end(JSON.stringify({ error: 'Error al limpiar el carrito' }));
                                            }
    
                                            res.writeHead(200, { 'Content-Type': 'application/json' });
                                            res.end(JSON.stringify({ success: true, mensaje: 'Pago registrado exitosamente', ordenId }));
                                        });
                                    });
                                }
                            });
                        });
                    });
                });
            } catch (error) {
                console.error('Error al procesar la solicitud:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Formato de datos inválido' }));
            }
        });
    }

    //BITACORA ADMINISTRADOR

    else if (req.url === '/api/bitacora' && req.method === 'GET') {
        db.query(`
            SELECT b.id, b.tabla_afectada, b.accion, b.fecha, b.sentencia, b.contrasentencia
            FROM bitacora b
            ORDER BY b.fecha DESC
        `, (err, results) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Error al obtener la bitácora' }));
            }
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(results));
        });
    }

// Ruta para obtener mascotas adoptables
else if (pathname === '/api/mascotas' && req.method === 'GET') {
    const query = 'SELECT id, nombre, especie, raza, edad, descripcion, CAST(imagen AS CHAR) AS ImagenBase64 FROM mascotas WHERE estado = "Disponible"';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error en la consulta SQL:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Error al obtener mascotas' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results));
    });
}

// Ruta para adoptar una mascota
else if (pathname === '/api/adoptar' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
        try {
            const { usuario_id, mascota_id } = JSON.parse(body);

            if (!usuario_id || !mascota_id) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Todos los campos son obligatorios' }));
            }

            const queryAdoptar = 'INSERT INTO adopciones (usuario_id, mascota_id) VALUES (?, ?)';
            db.query(queryAdoptar, [usuario_id, mascota_id], (err, result) => {
                if (err) {
                    console.error('Error en la consulta SQL:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Error al registrar la adopción' }));
                }

                const queryActualizarMascota = 'UPDATE mascotas SET estado = "Adoptado" WHERE id = ?';
                db.query(queryActualizarMascota, [mascota_id], (err, result) => {
                    if (err) {
                        console.error('Error en la consulta SQL:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Error al actualizar el estado de la mascota' }));
                    }

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ mensaje: 'Mascota adoptada exitosamente' }));
                });
            });
        } catch (error) {
            console.error('Error al procesar la solicitud:', error);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Formato de datos inválido' }));
        }
    });
}

// Ruta para agregar una mascota
else if (pathname === '/api/mascotas' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
        try {
            const { nombre, especie, raza, edad, descripcion, imagen } = JSON.parse(body);

            if (!nombre || !especie || !raza || !edad || !descripcion || !imagen) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Todos los campos son obligatorios' }));
            }

            const query = 'INSERT INTO mascotas (nombre, especie, raza, edad, descripcion, imagen, estado) VALUES (?, ?, ?, ?, ?, ?, "Disponible")';
            db.query(query, [nombre, especie, raza, edad, descripcion, imagen], (err, result) => {
                if (err) {
                    console.error('Error en la consulta SQL:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Error al agregar la mascota' }));
                }

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ mensaje: 'Mascota agregada exitosamente' }));
            });
        } catch (error) {
            console.error('Error al procesar la solicitud:', error);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Formato de datos inválido' }));
        }
    });
}

// Ruta para editar una mascota
else if (pathname.startsWith('/api/mascotas/') && req.method === 'PUT') {
    const mascotaId = pathname.split('/')[3];
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
        try {
            const { nombre, especie, raza, edad, descripcion, imagen } = JSON.parse(body);

            if (!nombre || !especie || !raza || !edad || !descripcion) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Todos los campos son obligatorios excepto la imagen' }));
            }

            let query = 'UPDATE mascotas SET nombre = ?, especie = ?, raza = ?, edad = ?, descripcion = ?';
            const values = [nombre, especie, raza, edad, descripcion];

            if (imagen) {
                query += ', imagen = ?';
                values.push(imagen);
            }

            query += ' WHERE id = ?';
            values.push(mascotaId);

            db.query(query, values, (err, result) => {
                if (err) {
                    console.error('Error en la consulta SQL:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Error al actualizar la mascota' }));
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ mensaje: 'Mascota actualizada exitosamente' }));
            });
        } catch (error) {
            console.error('Error al procesar la solicitud:', error);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Formato de datos inválido' }));
        }
    });
}

// Ruta para eliminar una mascota
else if (pathname.startsWith('/api/mascotas/') && req.method === 'DELETE') {
    const mascotaId = pathname.split('/')[3];

    if (!mascotaId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'ID de mascota es obligatorio' }));
    }

    const query = 'DELETE FROM mascotas WHERE id = ?';
    db.query(query, [mascotaId], (err, result) => {
        if (err) {
            console.error('Error en la consulta SQL:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Error al eliminar la mascota' }));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensaje: 'Mascota eliminada exitosamente' }));
    });
}

// Ruta para obtener mascotas adoptadas
else if (pathname === '/api/mascotas/adoptadas' && req.method === 'GET') {
    const query = `
        SELECT m.id, m.nombre, m.especie, m.raza, m.edad, m.descripcion, CAST(m.imagen AS CHAR) AS ImagenBase64, u.nombre AS adoptado_por
        FROM mascotas m
        INNER JOIN adopciones a ON m.id = a.mascota_id
        INNER JOIN usuarios u ON a.usuario_id = u.id
        WHERE m.estado = "Adoptado"
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error en la consulta SQL:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Error al obtener mascotas adoptadas' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results));
    });
}

    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
    }
});


server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});

