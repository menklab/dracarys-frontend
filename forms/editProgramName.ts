import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, useForm } from "react-hook-form";
import { object, string, TypeOf } from "zod";

export const editProgramNameSchema = object({
  name: string({ required_error: "Name is required", invalid_type_error: "Name must be a string" })
    .trim()
    .min(1, "Name must be between 1 and 50 characters long")
    .max(50, "Name must be between 1 and 50 characters long"),
});

export type EditProgramNameSchemaType = TypeOf<typeof editProgramNameSchema>;

export const useEditProgramNameForm = (defaultValues: DefaultValues<EditProgramNameSchemaType>) => {
  return useForm<EditProgramNameSchemaType>({ resolver: zodResolver(editProgramNameSchema), defaultValues });
};
