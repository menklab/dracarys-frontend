import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, useForm } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import { RUST_KEYWORDS } from "~/constants/rust_keywords";

export const editInstructionSchema = object({
  name: string({ required_error: "Name is required", invalid_type_error: "Name must be a string" })
    .trim()
    .min(1, "Name must be between 1 and 50 characters long")
    .max(50, "Name must be between 1 and 50 characters long")
    .regex(/^[a-z0-9_]+$/, "Field can only include lowercase letters, numbers and underscore")
    .refine(
      (val) => !RUST_KEYWORDS.includes(val),
      "Field can not include Rust reserved keywords. " +
        "See Keywords - The Rust Reference https://doc.rust-lang.org/reference/keywords.html"
    ),
  description: string({ invalid_type_error: "Description must be a string" }).max(
    300,
    "Description must be max 300 characters long"
  ),
});

export type EditInstructionSchemaType = TypeOf<typeof editInstructionSchema>;

export const useEditInstructionForm = (defaultValues: DefaultValues<EditInstructionSchemaType>) => {
  return useForm<EditInstructionSchemaType>({
    mode: "all",
    resolver: zodResolver(editInstructionSchema),
    defaultValues,
  });
};
