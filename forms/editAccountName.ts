import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, useForm } from "react-hook-form";
import { object, string, TypeOf } from "zod";

export const editAccountNameSchema = object({
  name: string({ required_error: "Name is required", invalid_type_error: "Name must be a string" })
    .min(1, "Name must be between 1 and 50 characters long")
    .max(50, "Name must be between 1 and 50 characters long"),
});

export type EditAccountNameSchemaType = TypeOf<typeof editAccountNameSchema>;

export const useEditAccountNameForm = (defaultValues: DefaultValues<EditAccountNameSchemaType>) => {
  return useForm<EditAccountNameSchemaType>({ resolver: zodResolver(editAccountNameSchema), defaultValues });
};
