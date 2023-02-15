import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, useForm } from "react-hook-form";
import { enum as zodEnum, object, string, TypeOf } from "zod";
import { RUST_KEYWORDS } from "~/constants/rust_keywords";
import { TypeArrayValidation } from "~/enums/elementType";

export const editAccountElementSchema = object({
  name: string({ required_error: "Name is required", invalid_type_error: "Name must be a string" })
    .trim()
    .min(1, "Name must be between 1 and 50 characters long")
    .max(50, "Name must be between 1 and 50 characters long")
    .refine(
      (val) => !RUST_KEYWORDS.includes(val),
      "Field can not include Rust reserved keywords. " +
        "See Keywords - The Rust Reference https://doc.rust-lang.org/reference/keywords.html"
    ),
  type: zodEnum(TypeArrayValidation),
});

export type EditAccountElementSchemaType = TypeOf<typeof editAccountElementSchema>;

export const useEditAccountElementForm = (defaultValues: DefaultValues<EditAccountElementSchemaType>) => {
  return useForm<EditAccountElementSchemaType>({
    shouldFocusError: false,
    mode: "onBlur",
    resolver: zodResolver(editAccountElementSchema),
    defaultValues,
  });
};
