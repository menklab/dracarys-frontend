import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { object, string, TypeOf } from "zod";

export const createProgramSchema = object({
  name: string({ required_error: "Name is required", invalid_type_error: "Name must be a string" })
    .trim()
    .min(1, "Name must be between 1 and 50 characters long")
    .max(50, "Name must be between 1 and 50 characters long"),
});

export type CreateProgramSchemaType = TypeOf<typeof createProgramSchema>;

export const useCreateProgramForm = () => {
  return useForm<CreateProgramSchemaType>({ resolver: zodResolver(createProgramSchema) });
};
