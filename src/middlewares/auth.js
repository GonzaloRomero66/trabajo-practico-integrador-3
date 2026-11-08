import { verifyToken } from "../helpers/jwt.js";
import UserModel from "../models/user.model.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Debes iniciar sesion",
      });
    }
    const decoded = verifyToken(token);

    const user = await UserModel.findOne({ _id: decoded.id, deletedAt: false });

    if (!user) {
      return res.status(401).json({ message: "La sesion no es valida" });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalido o expirado" });
  }
};
