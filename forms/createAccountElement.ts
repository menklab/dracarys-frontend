import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, useForm } from "react-hook-form";
import { enum as zodEnum, object, string, TypeOf } from "zod";
import { TypeArrayValidation } from "~/enums/elementType";

export const createAccountElementSchema = object({
  name: string({ required_error: "Name is required", invalid_type_error: "Name must be a string" })
    .min(1, "Name must be between 1 and 50 characters long")
    .max(50, "Name must be between 1 and 50 characters long"),
  type: zodEnum(TypeArrayValidation),
});

export type CreateAccountElementSchemaType = TypeOf<typeof createAccountElementSchema>;

export const useCreateAccountElementForm = (defaultValues: DefaultValues<CreateAccountElementSchemaType>) => {
  return useForm<CreateAccountElementSchemaType>({
    mode: "all",
    resolver: zodResolver(createAccountElementSchema),
    defaultValues,
  });
};
