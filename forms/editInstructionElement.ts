import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, useForm } from "react-hook-form";
import { boolean, nativeEnum, object, string, TypeOf, ZodErrorMap } from "zod";
import { AccountType } from "~/enums/instructionElementTypes";

const errorMap: ZodErrorMap = () => {
  return { message: "Account Type is required" };
};

export const editInstructionElementSchema = object({
  name: string({ required_error: "Name is required", invalid_type_error: "Name must be a string" })
    .trim()
    .min(1, "Name must be between 1 and 50 characters long")
    .max(50, "Name must be between 1 and 50 characters long")
    .regex(/^[a-z0-9_]+$/, "Field can only include lowercase letters, numbers and underscore"),
  description: string({ invalid_type_error: "Description must be a string" }).max(
    300,
    "Description must be max 300 characters long"
  ),
  mut: boolean(),
  accountType: nativeEnum(AccountType, { errorMap: errorMap }),
  genericType: string({ required_error: "Generic Type is required" }).trim().min(1, "Generic Type is required"),
});

export type EditInstructionElementSchemaType = TypeOf<typeof editInstructionElementSchema>;

export const useEditInstructionElementForm = (defaultValues: DefaultValues<EditInstructionElementSchemaType>) => {
  return useForm<EditInstructionElementSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(editInstructionElementSchema),
    defaultValues,
  });
};
