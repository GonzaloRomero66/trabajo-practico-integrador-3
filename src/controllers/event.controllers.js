import { body, matchedData } from "express-validator";
import eventModel from "../models/event";

export const GetAllEvent = async (req, res) => {
  try {
    const events = await eventModel.find();
    res.json(events);
  } catch (error) {
    res.json(404).json({ message: "Error al buscar todos los eventos" });
  }
};
export const GetEventId = async (req, res) => {
  try {
    const event = await eventModel.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Error al encontrar el evento" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Error al encontrar el evento" });
  }
};

export const CreateEvent = async (req, res) => {
  try {
    const data = matchedData(req, { locations: ["body"] });
    const event = await eventModel.create(data);
    res.status(201).json(event);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear el usuario" });
  }
};
export const UpdateEvent = async (req, res) => {
  try {
    const data = matchedData(req, { locations: ["body"] });
    const event = await eventModel.findByIdAndUpdate(
      req.params.id,
      data,
      {
        returnDocument: "after",
      },
      { Runvalidators: true },
    );
    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    res
      .status(200)
      .json({ message: "Evento actualizado correctamente", event });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el usuario" });
  }
};
export const DeleteEvent = async (req, res) => {
  try {
    const event = await eventModel.findByIdAndUpdate(
      req.params.id,
      { deleted: true },
      { returnDocument: "after" },
    );
    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el evento" });
  }
};
