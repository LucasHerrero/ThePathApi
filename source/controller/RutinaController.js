const express = require("express");
const router = express.Router();
const Rutina = require("../module/Rutina.js");
const RutinaEjercicio = require("../module/RutinaEjercicio.js");
const User = require("../module/user.js");
const Ejercicio = require("../module/Ejercicio.js");

//TODO: TABLA RUTINAS
router.get("/rutinas", async (req, res) => {
  try {
    const rutinas = await Rutina.findAll({
      include: [User],
    });
    res.json(rutinas);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving routines");
  }
});

//TODO: TABLA RUTINAS Y RUTINA EJERCICIO
router.post("/crearRutina", async (req, res) => {
  const { nombre, cantidadEj,Dia, userFk, ejercicios } = req.body;

  try {
    // Crear la nueva rutina
    const nuevaRutina = await Rutina.create({
      nombre,
      cantidadEj,
      Dia,
      userFk,
    });

    // Crear las relaciones con los ejercicios
    const relaciones = ejercicios.map((idEjercicio) => ({
      idRutina: nuevaRutina.id,
      idEjercicio,
    }));

    await RutinaEjercicio.bulkCreate(relaciones);

    res.status(201).json({ message: "Rutina creada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear la rutina");
  }
});

//TODO: TABLA RUTINAS EJERCICIO
router.get("/RutinasEjercicio", async (req, res) => {
  try {
    const rutinasEjercicio = await RutinaEjercicio.findAll({
      include: [
        {
          model: Rutina,
          as: "Rutina",
          include: {
            model: User,
            as: "User",
          },
        },
        {
          model: Ejercicio,
          as: "Ejercicio",
        },
      ],
    });
    res.json(rutinasEjercicio);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving routines and exercises");
  }
});
router.get("/RutinasEjercicio/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const rutinasEjercicio = await RutinaEjercicio.findAll({
      include: [
        {
          model: Rutina,
          as: "Rutina",
          where: { userFk: userId },
          include: {
            model: User,
            as: "User",
          },
        },
        {
          model: Ejercicio,
          as: "Ejercicio",
        },
      ],
    });

    // Agrupar los resultados por el ID de la rutina
    const grouped = rutinasEjercicio.reduce((result, item) => {
      const key = item.Rutina.id;
      if (!result[key]) {
        // Copiar la rutina y los ejercicios a un nuevo objeto
        result[key] = {
          ...item.dataValues.Rutina.dataValues,
          Ejercicios: [item.Ejercicio],
        };
      } else {
        // Agregar el ejercicio a la rutina existente
        result[key].Ejercicios.push(item.Ejercicio);
      }
      return result;
    }, {});

    // Convertir el objeto a un array
    const groupedArray = Object.values(grouped);

    // Mapear el array para incluir solo las propiedades necesarias

    const responseArray = groupedArray.map((item) => ({
      Rutina: {
        id: item.id,
        nombre: item.nombre,
        cantidadEj: item.cantidadEj,
        userFk: item.userFk,
      },
      Ejercicios: item.Ejercicios.map((ejercicio) => ({
        id: ejercicio.id,
        nombre: ejercicio.nombre,
        musculo: ejercicio.musculo,
        equipacion: ejercicio.equipacion,
        dificultad: ejercicio.dificultad,
        instrucciones: ejercicio.instrucciones,
      })),
    }));

    res.json(responseArray);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving routines and exercises for user");
  }
});
module.exports = router;
