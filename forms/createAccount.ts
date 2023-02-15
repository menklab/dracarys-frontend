import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import { RUST_KEYWORDS } from "~/constants/rust_keywords";

export const createAccountSchema = object({
  name: string({ required_error: "Name is required", invalid_type_error: "Name must be a string" })
    .trim()
    .min(1, "Name must be between 1 and 50 characters long")
    .max(50, "Name must be between 1 and 50 characters long")
    .regex(/^[A-Za-z0-9]+$/, "Field can only include letters and numbers")
    .refine((val) => val[0] === val[0]?.toUpperCase(), "The first letter must be UpperCase")
    .refine(
      (val) => !RUST_KEYWORDS.includes(val),
      "Field can not include Rust reserved keywords. " +
        "See Keywords - The Rust Reference https://doc.rust-lang.org/reference/keywords.html"
    ),
});

export type CreateAccountSchemaType = TypeOf<typeof createAccountSchema>;

export const useCreateAccountForm = () => {
  return useForm<CreateAccountSchemaType>({ mode: "all", resolver: zodResolver(createAccountSchema) });
};
