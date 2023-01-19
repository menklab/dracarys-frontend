import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, useForm } from "react-hook-form";
import { enum as zodEnum, object, string, TypeOf } from "zod";

export const editAccountElementSchema = object({
  name: string({ required_error: "Name is required", invalid_type_error: "Name must be a string" })
    .min(1, "Name must be between 1 and 50 characters long")
    .max(50, "Name must be between 1 and 50 characters long"),
  type: zodEnum([
    "Pubkey",
    "bool",
    "u8",
    "u16",
    "u32",
    "u64",
    "u128",
    "i8",
    "i16",
    "i32",
    "i64",
    "i128",
    "f32",
    "f64",
    "Enum",
    "Struct",
    "String",
    "[T; N]",
    "Vec<T>",
  ]),
});

export type EditAccountElementSchemaType = TypeOf<typeof editAccountElementSchema>;

export const useEditAccountElementForm = (defaultValues: DefaultValues<EditAccountElementSchemaType>) => {
  return useForm<EditAccountElementSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(editAccountElementSchema),
    defaultValues,
  });
};
