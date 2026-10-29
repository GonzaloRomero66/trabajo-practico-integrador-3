export const validateCreateUser = [
  body("username").notEmpty().withMessage("El username no puede estar vacio"),
  body("email")
    .notEmpty()
    .withMessage("El email no puede estar vacio")
    .isEmail()
    .withMessage("Debe de ser un email valido"),
  body("password").notEmpty().withMessage("La contraseña no puede estar vacia"),
  body("role").notEmpty().withMessage("El rol no puede estar vacio"),
  body("profile.firstName")
    .notEmpty()
    .withMessage("El primer nombre no puede estar vacio"),
  body("profile.lastName")
    .notEmpty()
    .withMessage("El segundo nombre no puede estar vacio"),
  body("profile.birthData")
    .notEmpty()
    .withMessage("La fecha de nacimiento no puede estar vacio")
    .isDate()
    .withMessage("Tiene que ser una fecha valida"),
  body("profile.phone")
    .notEmpty()
    .withMessage("El telefono no puede estar vacio"),
  body("profile.deletedAt")
    .notEmpty()
    .withMessage("El estado no puede estar vacio")
    .isBoolean()
    .withMessage("El estado tiene que ser true o false"),
];

export default validateCreateUser;
