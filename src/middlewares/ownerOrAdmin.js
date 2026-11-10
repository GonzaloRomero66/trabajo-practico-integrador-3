import EventModel from "../models/event.model.js";

export const ownerOrAdminMiddleware = async (req, res, next) => {
  try {
    const event = await EventModel.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    const isOwner = event.organizer.toString() === req.user.id;

    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Solo el organizador del evento o un admin puede hacer esto",
      });
    }

    // lo dejamos en el request para no volver a buscarlo en el controlador
    req.event = event;
    next();
  } catch (error) {
    next(error);
  }
};
