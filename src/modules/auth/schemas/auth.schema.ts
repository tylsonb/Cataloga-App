import { z } from "zod";

export const loginSchema = z.object({ email: z.string().email("Ingresa un correo válido"), password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres") });
export const registerSchema = loginSchema.extend({ fullName: z.string().min(2, "Ingresa tu nombre completo") });
export const resetPasswordSchema = z.object({ email: z.string().email("Ingresa un correo válido") });
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
