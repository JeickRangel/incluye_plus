const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { JWT_SECRET } = require('../middleware/auth.middleware');

// Valida credenciales y devuelve un JWT si son correctas
async function login(req, res) {
  const { email, password } = req.body;

  try {
    const profesional = await prisma.profesional.findFirst({
      where: { email }
    });

    if (!profesional) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const claveCorrecta = await bcrypt.compare(password, profesional.password);
    if (!claveCorrecta) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      {
        id: profesional.id,
        nombre: profesional.nombre,
        disciplina: profesional.disciplina,
        entidadId: profesional.entidad_id
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, nombre: profesional.nombre, disciplina: profesional.disciplina });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { login };