const express = require('express');
const router = express.Router();
const Rutina = require('../module/Rutina.js');
const RutinaEjercicio = require('../module/RutinaEjercicio.js');
const User = require('../module/user.js');
const Ejercicio = require('../module/Ejercicio.js');
//Endpoint for Rutina
router.get('/rutinas', async (req, res) => {
  try {
   const rutinas = await Rutina.findAll({
  include: [User]
});
    res.json(rutinas);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving routines');
  }
});


router.post('/rutina/new', async (req, res) => {
  try {
    const { nombre, cantidadEj, userFk } = req.body;
    const newRutina = await Rutina.create({ nombre, cantidadEj, userFk });
    res.json(newRutina);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating routine');
  }
});

//Endpoint for RutinaEjercicio
router.get('/rutinasEjercicio', async (req, res) => {
    try {
        const rutinaEjercicio = await RutinaEjercicio.findAll({
            include: [Rutina,Ejercicio]
          });
      res.json(rutinaEjercicio);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving routines');
    }
  });


  
module.exports = router;