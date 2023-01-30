import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { object, string, TypeOf } from "zod";

export const createInstructionSchema = object({
  name: string({ required_error: "Name is required", invalid_type_error: "Name must be a string" })
    .trim()
    .min(1, "Name must be between 1 and 50 characters long")
    .max(50, "Name must be between 1 and 50 characters long"),
  description: string({ invalid_type_error: "Description must be a string" }).max(
    300,
    "Description must be max 300 characters long"
  ),
});

export type CreateInstructionSchemaType = TypeOf<typeof createInstructionSchema>;

export const useCreateInstructionForm = () => {
  return useForm<CreateInstructionSchemaType>({ resolver: zodResolver(createInstructionSchema) });
};
