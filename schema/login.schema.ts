import { z } from "zod";

export const loginSchema = z
  .object({
    isEmail: z.boolean(),
    username: z.string().optional(),
    email: z.string().optional().nullable(),
    password: z.string().nonempty("Password is required"),
  })
  .refine(
    (data) => {
      const hasUsername = !!data.username;
      const hasEmail = !!data.email;
      const isEmail = data.isEmail;

      // Ensure either email or username is provided, based on the isEmail flag
      if (isEmail && !hasEmail) {
        return false; // If isEmail is true but no email is provided
      } else if (!isEmail && !hasUsername) {
        return false; // If isEmail is false but no username is provided
      }
      return true;
    },
    {
      message: "Provide either username or email.",
      path: ["username", "email"],
    }
  )
  .superRefine((data, ctx) => {
    const hasUsername = !!data.username;
    const hasEmail = !!data.email;
    const isEmail = data.isEmail;

    // Custom validation to ensure email is valid only when isEmail is true
    if (isEmail && !hasEmail) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email is required",
        path: ["email"],
      });
    } else if (isEmail && hasEmail) {
      const emailSchema = z.string().email("Provide a valid email address");
      const emailValidation = emailSchema.safeParse(data.email);

      if (!emailValidation.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Provide a valid email address",
          path: ["email"],
        });
      }
    }

    if (!isEmail && !hasUsername) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Username is required",
        path: ["username"],
      });
    }
  });
