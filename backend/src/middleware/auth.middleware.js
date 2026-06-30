const jwt = require('jsonwebtoken');

const JWT_SECRET = 'incluye_plus_secret_2026';

// Verifica que el JWT sea válido antes de permitir acceso a una ruta
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // formato: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.profesional = payload; // inyecta los datos del profesional en la request
    next(); // deja pasar a la siguiente función
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = { verificarToken, JWT_SECRET };