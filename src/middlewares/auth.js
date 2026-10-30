import { verifyToken } from "../helpers/jwt";
import { User } from "../models/user.model";

export const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Debes iniciar sesion",
      });
    }
    const decoded = verifyToken(token);

    const user = await User.findOne({ _id: decoded.id, deleted: false });

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
