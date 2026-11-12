// convierte { profile: { firstName: "a" } } en { "profile.firstName": "a" }
// sirve para actualizar campos de documentos embebidos sin pisar el resto
export const flattenObject = (obj, prefix = "") => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      Object.assign(acc, flattenObject(value, path));
    } else {
      acc[path] = value;
    }

    return acc;
  }, {});
};
