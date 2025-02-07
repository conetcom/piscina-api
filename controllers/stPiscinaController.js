const stPiscinaModel = require('../models/stPiscinasModel');

exports.obtenerStPiscinas = async (req, res) => {
    const datos = await stPiscinaModel.getstPiscinas();
    res.json(datos);
};

exports.obtenerStPiscinasById = async (req, res) => {
    const datos = await stPiscinaModel.getstPiscinasById(req.params.id);
    res.json(datos);
};

exports.crearStPiscinas = async (req, res) => {
    const { piscina_id, ph, orp, st_bombas, st_light } = req.body;
    await stPiscinaModel.createstPiscinas(piscina_id, ph, orp, st_bombas, st_light);
    res.status(201).send('registro lectura almacenado');
};

exports.actualizarStPiscinas  = async (req, res) => {
    const { id_piscina, id_cliente, ph, orp, st_bomba,st_light } = req.body;
    await stPiscinaModel.updatestPiscinas(req.params.id, id_piscina, id_cliente, ph, orp, st_bomba, st_light);
    res.send('registro actualizado');
};

exports.eliminarStPiscinas = async (req, res) => {
    await stPiscinaModel.deletestPiscinas(req.params.id);
    res.send('Registro  eliminado');
};
