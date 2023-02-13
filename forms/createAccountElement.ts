import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, useForm } from "react-hook-form";
import { nativeEnum, object, string, TypeOf, ZodErrorMap } from "zod";
import { RUST_KEYWORDS } from "~/constants/rust_keywords";
import { ElementType } from "~/enums/elementType";

const errorMap: ZodErrorMap = () => {
  return { message: "Account Type is required" };
};

export const createAccountElementSchema = object({
  name: string({ required_error: "Name is required", invalid_type_error: "Name must be a string" })
    .trim()
    .min(1, "Name must be between 1 and 50 characters long")
    .max(50, "Name must be between 1 and 50 characters long")
    .refine(
      (val) => !RUST_KEYWORDS.includes(val),
      "Field can not include Rust reserved keywords. " +
        "See Keywords - The Rust Reference https://doc.rust-lang.org/reference/keywords.html"
    ),
  type: nativeEnum(ElementType, { errorMap: errorMap }),
});

export type CreateAccountElementSchemaType = TypeOf<typeof createAccountElementSchema>;

export const useCreateAccountElementForm = (defaultValues: DefaultValues<CreateAccountElementSchemaType>) => {
  return useForm<CreateAccountElementSchemaType>({
    mode: "onSubmit",
    resolver: zodResolver(createAccountElementSchema),
    defaultValues,
  });
};
