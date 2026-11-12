import { body } from "express-validator";

// reglas del perfil embebido, se reutilizan en registro, perfil y usuarios
// required = true  -> firstName y lastName obligatorios (registro)
// required = false -> todos opcionales (actualizaciones)
// prefix           -> "profile" si viene anidado, "" si viene en la raiz del body
export const profileRules = ({ required = true, prefix = "profile" } = {}) => {
  const path = (name) => (prefix ? `${prefix}.${name}` : name);

  const campo = (name) => {
    const chain = body(path(name));
    return required ? chain : chain.optional();
  };

  const nombreRules = (name, etiqueta) =>
    campo(name)
      .trim()
      .notEmpty()
      .withMessage(`El ${etiqueta} no puede estar vacio`)
      .bail()
      .isLength({ min: 2, max: 50 })
      .withMessage(`El ${etiqueta} tiene que tener entre 2 y 50 caracteres`)
      .bail()
      .isAlpha("es-ES", { ignore: " " })
      .withMessage(`El ${etiqueta} solo puede tener letras`);

  return [
    nombreRules("firstName", "nombre"),
    nombreRules("lastName", "apellido"),
    body(path("birthDate"))
      .optional()
      .isISO8601({ strict: true })
      .withMessage("La fecha de nacimiento debe ser válida (YYYY-MM-DD)")
      .bail()
      .custom((date) => {
        if (new Date(date) > new Date()) {
          throw new Error("La fecha de nacimiento no puede ser futura");
        }
        return true;
      })
      .toDate(),
    body(path("phone"))
      .optional()
      .trim()
      .isNumeric({ no_symbols: true })
      .withMessage("El telefono solo puede tener numeros")
      .bail()
      .isLength({ min: 8, max: 15 })
      .withMessage("El telefono tiene que tener entre 8 y 15 digitos"),
  ];
};
