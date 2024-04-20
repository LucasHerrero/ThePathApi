const express = require('express');
const router = express.Router();
const Ejercicio = require('../module/Ejercicio.js');
const { Op } = require('sequelize');

router.get('/search', async (req, res) => {
  try {
    const { nombre, equipacion, musculo } = req.query;
    const ejercicios = await Ejercicio.findAll({
      where: {
        ...(nombre ? { nombre: { [Op.like]: '%' + nombre + '%' } } : {}),
        ...(equipacion ? { equipacion: { [Op.like]: '%' + equipacion + '%' } } : {}),
        ...(musculo ? { musculo: { [Op.like]: '%' + musculo + '%' } } : {}),
      }
    });
    res.json(ejercicios);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving exercises');
  }
});

// ... tus otras rutas ...

module.exports = router;


router.get('/ejercicios', async (req, res) => {
  try {
    const ejercicios = await Ejercicio.findAll();
    res.json(ejercicios);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving exercises');
  }
});






module.exports = router;