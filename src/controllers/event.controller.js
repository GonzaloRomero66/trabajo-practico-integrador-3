import { matchedData } from "express-validator";
import eventModel from "../models/event.model.js";
import { flattenObject } from "../helpers/flatten.js";

const populateOptions = [
  { path: "organizer", select: "username email profile" },
  { path: "categories", select: "name description" },
];

export const GetAllEvent = async (req, res, next) => {
  try {
    const events = await eventModel.find().populate(populateOptions);
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

export const GetMyEvents = async (req, res, next) => {
  try {
    const events = await eventModel
      .find({ organizer: req.user.id })
      .populate(populateOptions);
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

export const GetEventId = async (req, res, next) => {
  try {
    const event = await eventModel
      .findById(req.params.id)
      .populate(populateOptions);

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

export const CreateEvent = async (req, res, next) => {
  try {
    const data = matchedData(req, { locations: ["body"] });

    // el organizador siempre es el usuario autenticado
    const event = await eventModel.create({ ...data, organizer: req.user.id });
    await event.populate(populateOptions);

    res.status(201).json({ message: "Evento creado correctamente", event });
  } catch (error) {
    next(error);
  }
};

export const UpdateEvent = async (req, res, next) => {
  try {
    const data = matchedData(req, { locations: ["body"] });

    // req.event lo deja ownerOrAdminMiddleware
    const event = req.event;
    event.set(flattenObject(data));
    await event.save();
    await event.populate(populateOptions);

    res.status(200).json({ message: "Evento actualizado correctamente", event });
  } catch (error) {
    next(error);
  }
};

export const DeleteEvent = async (req, res, next) => {
  try {
    // eliminacion fisica
    await req.event.deleteOne();

    res.status(200).json({ message: "Evento eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};
