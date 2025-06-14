const rubroModel = require('../models/rubroModel');

exports.getAll = async (req, res) => {
  try {
    const { rows } = await rubroModel.getAll();
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener rubros:', error);
    res.status(500).json({ message: 'Error al obtener rubros', error });
  }
};

exports.getById = async (req, res) => {
  try {
    const { rows } = await rubroModel.getById(req.params.id);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Rubro no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener rubro', error });
  }
};

exports.create = async (req, res) => {
  try {
    await rubroModel.create(req.body);
    res.status(201).json({ message: 'Rubro creado correctamente' });
  } catch (error) {
    if (error.code === '23505') {
      // Código de error de Postgres para violación de UNIQUE
      return res.status(400).json({ message: 'Ya existe un rubro con ese nombre.' });
    }
    //console.error('Error al crear rubro:', error);
    res.status(500).json({ message: 'Error al crear rubro', error });
  }
};

exports.update = async (req, res) => {
  try {
    await rubroModel.update(req.params.id, req.body);
    res.json({ message: 'Rubro actualizado correctamente' });
  } catch (error) {
    if (error.code === '23505') {
      // Código de error de Postgres para violación de UNIQUE
      return res.status(400).json({ message: 'Ya existe un rubro con ese nombre.' });
    }
    res.status(500).json({ message: 'Error al actualizar rubro', error });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const tieneProductos = await rubroModel.tieneProductos(id);

    if (tieneProductos) {
      return res.status(400).json({ message: 'No se puede eliminar el rubro: tiene productos asociados.' });
    }

    await rubroModel.delete(id);
    res.status(200).json({ message: 'Rubro eliminado con éxito' });
  } catch (err) {
    console.error('Error al eliminar rubro:', err);
    res.status(500).json({ message: 'Error al eliminar rubro' });
  }
};

/* version simple
exports.delete = async (req, res) => {
  try {
    await rubroModel.delete(req.params.id);
    res.json({ message: 'Rubro eliminado' });
  } catch (error) {
    console.error('Error al eliminar rubro:', error);
    res.status(500).json({ message: 'Error al eliminar rubro', error });
  }
};
*/