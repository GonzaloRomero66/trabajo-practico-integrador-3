export const errorHandler = (error, req, res, next) => {
  // json mal formado en el body
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "El JSON enviado no es válido" });
  }

  // validaciones de los esquemas de mongoose
  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Error de validación",
      errors: Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      })),
    });
  }

  // id con formato incorrecto
  if (error.name === "CastError") {
    return res
      .status(400)
      .json({ message: `El valor de ${error.path} no es válido` });
  }

  // campo unico repetido
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0];
    return res
      .status(400)
      .json({ message: `Ya existe un registro con ese ${field}` });
  }

  console.log(error);
  return res.status(500).json({ message: "Error interno del servidor" });
};
