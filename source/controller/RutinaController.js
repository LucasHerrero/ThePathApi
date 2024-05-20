const express = require("express");
const router = express.Router();
const Rutina = require("../module/Rutina.js");
const RutinaEjercicio = require("../module/RutinaEjercicio.js");
const User = require("../module/user.js");
const Ejercicio = require("../module/Ejercicio.js");
const { Op, where } = require("sequelize");

router.get("/RutinasEjercicio/search", async (req, res) => {
  try {
    const { userId, nombre, Dia } = req.query;

    if (!userId) {
      return res.status(400).send("El parámetro userId es requerido");
    }

    const whereClause = { userFk: userId };
    if (nombre) {
      whereClause.nombre = { [Op.like]: "%" + nombre + "%" };
    }
    if (Dia) {
      whereClause.Dia = { [Op.like]: "%" + Dia + "%" };
    }

    const rutinasEjercicio = await RutinaEjercicio.findAll({
      include: [
        {
          model: Rutina,
          as: "Rutina",
          where: whereClause,
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
        Dia: item.Dia,
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
    res.status(500).send("Error retrieving routines and exercises");
  }
});

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

//TODO: TABLA RUTINAS
router.put("/rutinaEjercicioKg/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { idRutina, idEjercicio, kg, sets, reps } = req.body;

    const rutinasEjercicio = await RutinaEjercicio.findAll({
      where: { idRutina },
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
          where: { id: idEjercicio },
        },
      ],
    });

    rutinasEjercicio.forEach(async (rutinaEjercicio) => {
      rutinaEjercicio.kg = kg;
      rutinaEjercicio.sets = sets;
      rutinaEjercicio.reps = reps;
      await rutinaEjercicio.save();
    });

    res.json(rutinasEjercicio);
    console.log(idRutina, kg, sets, reps);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving routines and exercises for user");
  }
});
//TODO: TABLA ARRIBA

router.put("/rutinas/:id", async (req, res) => {
  const { id } = req.params;
  const { Dia } = req.body;

  try {
    const rutina = await Rutina.findByPk(id);

    if (!rutina) {
      return res.status(404).send("Rutina no encontrada");
    }

    rutina.Dia = Dia;
    await rutina.save();

    res.json({ message: "Rutina actualizada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar la rutina");
  }
});

//TODO: TABLA RUTINAS Y RUTINA EJERCICIO
router.post("/crearRutina", async (req, res) => {
  const { nombre, cantidadEj, Dia, userFk, ejercicios } = req.body;

  try {
    // Comprobar si ya existe una rutina para el usuario y el día especificados
    const existingRutina = await Rutina.findOne({ where: { Dia, userFk } });
    if (existingRutina) {
      return res.status(400).send("No puedes crear 2 rutinas con el mismo dia");
    }

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
          Ejercicios: [
            {
              ...item.Ejercicio.dataValues,
              reps: item.reps,
              sets: item.sets,
              kg: item.kg,
            },
          ],
        };
      } else {
        // Agregar el ejercicio a la rutina existente
        result[key].Ejercicios.push({
          ...item.Ejercicio.dataValues,
          reps: item.reps,
          sets: item.sets,
          kg: item.kg,
        });
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
        Dia: item.Dia,
        userFk: item.userFk,
      },
      Ejercicios: item.Ejercicios.map((ejercicio) => ({
        id: ejercicio.id,
        nombre: ejercicio.nombre,
        musculo: ejercicio.musculo,
        equipacion: ejercicio.equipacion,
        dificultad: ejercicio.dificultad,
        instrucciones: ejercicio.instrucciones,
        reps: ejercicio.reps,
        sets: ejercicio.sets,
        kg: ejercicio.kg,
      })),
    }));

    res.json(responseArray);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving routines and exercises for user");
  }
});

router.delete("/rutinas/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar la rutina
    const rutina = await Rutina.findByPk(id);

    if (!rutina) {
      return res.status(404).send("Rutina no encontrada");
    }

    // Eliminar las relaciones con los ejercicios
    await RutinaEjercicio.destroy({ where: { idRutina: id } });

    // Eliminar la rutina
    await rutina.destroy();

    res.json({ message: "Rutina eliminada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar la rutina");
  }
});
router.post("/addEjercicio/:idRutina", async (req, res) => {
  const { idRutina } = req.params;
  const { idEjercicios } = req.body; // Ahora es un array de IDs

  try {
    // Primero, verifica si todos los ejercicios son únicos
    for (const idEjercicio of idEjercicios) {
      const existingEjercicio = await RutinaEjercicio.findOne({
        where: { idRutina, idEjercicio },
      });
      if (existingEjercicio) {
        return res.status(400).send("No puedes añadir un ejercicio ya existente");
      }
    }

    // Si todos los ejercicios son únicos, procede con la creación
    for (const idEjercicio of idEjercicios) {
      const rutina = await Rutina.findByPk(idRutina);

      if (rutina) {
        rutina.cantidadEj = rutina.cantidadEj + 1;
        await rutina.save();
      }
      const rutinaEjercicio = await RutinaEjercicio.create({
        idRutina,
        idEjercicio,
        reps: 0,
        sets: 0,
        kg: 0,
      });
    }

    res.json({ message: "Ejercicios añadidos exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al añadir los ejercicios a la rutina.");
  }
});

router.delete("/deleteEjercicio/:idRutina/:idEjercicio", async (req, res) => {
  const { idRutina, idEjercicio } = req.params;

  try {
    const existingEjercicio = await RutinaEjercicio.findOne({
      where: { idRutina, idEjercicio },
    });
    if (existingEjercicio) {
      existingEjercicio.destroy();

      const rutina = await Rutina.findByPk(idRutina);

      if (rutina) {
        if (rutina.cantidadEj > 0) {
          if (rutina.cantidadEj == 1) {
            console.log(rutina);
            rutina.destroy();
            res.json({ message: "Ejercicio y rutina elimnados exitosamente." });
          } else {
            rutina.cantidadEj = rutina.cantidadEj - 1;
            await rutina.save();
            res.json({ message: "Ejercicio eliminado exitosamente." });
          }
        }
      }
    } else {
      return res
        .status(400)
        .send("No puedes eliminar un ejercicio que no existe");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al elimar el ejercicio a la rutina.");
  }
});
module.exports = router;
