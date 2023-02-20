import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, useForm } from "react-hook-form";
import { array, boolean, number, object, string, TypeOf } from "zod";

export const instructionElementSchema = object({
  elements: array(
    object({
      id: number().optional(),
      name: string().trim().optional(),
      accountType: string().trim().optional(),
      genericType: string().trim().optional(),
      mut: boolean(),
      description: string().optional(),
    })
  ),
});

export type InstructionElementSchemaType = TypeOf<typeof instructionElementSchema>;

export const useInstructionElementForm = (defaultValues: DefaultValues<InstructionElementSchemaType>) => {
  return useForm<InstructionElementSchemaType>({
    mode: "onSubmit",
    shouldFocusError: false,
    resolver: zodResolver(instructionElementSchema),
    defaultValues,
  });
};
