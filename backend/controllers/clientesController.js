const clienteModel = require('../models/clienteModel');

exports.getAllClientes = async (req, res) => {
  try {
    const clientes = await clienteModel.getAll();
    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los clientes' });
  }
};

exports.createCliente = async (req, res) => {
  const { nombre, apellido, email, cuit_cuil, direccion, telefono } = req.body;

  if (!nombre || !apellido || !email || !cuit_cuil || !direccion || !telefono) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const existe = await clienteModel.existsByCuitCuil(cuit_cuil);
    if (existe) {
      return res.status(400).json({ message: 'El cliente ya existe' });
    }

    await clienteModel.create({ nombre, apellido, email, cuit_cuil, direccion, telefono });
    res.status(201).json({ message: 'Cliente creado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el cliente' });
  }
};

exports.getClienteById = async (req, res) => {
  const { id } = req.params;

  try {
    const cliente = await clienteModel.getById(id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el cliente' });
  }
};

exports.updateCliente = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, email, cuit_cuil, direccion, telefono } = req.body;

  try {
    await clienteModel.update(id, { nombre, apellido, email, cuit_cuil, direccion, telefono });
    res.json({ message: 'Cliente actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el cliente' });
  }
};

exports.deleteCliente = async (req, res) => {
  const { id } = req.params;

  try {
    await clienteModel.softDelete(id);
    res.json({ message: 'Cliente dado de baja correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el cliente' });
  }
};
