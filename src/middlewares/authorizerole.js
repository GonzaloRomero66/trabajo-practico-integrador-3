export const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      message: "No tienes permiso, solo los admin pueden hacer esto",
    });
  }
  next();
};
