import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(2, "La categoria necesita al menos 2 caracteres."),
});

export const productSchema = z.object({
  name: z.string().trim().min(2, "El nombre necesita al menos 2 caracteres."),
  description: z.string().trim().min(8, "La descripcion necesita al menos 8 caracteres."),
  price: z.preprocess((value) => {
    if (typeof value === "number") return value;
    if (typeof value !== "string") return Number.NaN;

    const cleanValue = value
      .trim()
      .replace(/\s/g, "")
      .replace(/\$/g, "")
      .replace(/\./g, "")
      .replace(",", ".");

    return cleanValue ? Number(cleanValue) : Number.NaN;
  }, z.number({ invalid_type_error: "Ingresa un precio valido." }).positive("El precio debe ser mayor a cero.")),
  category_id: z.string().min(1, "Selecciona una categoria."),
  image_url: z.string().url("La imagen debe tener una URL valida.").optional().or(z.literal("")),
});
