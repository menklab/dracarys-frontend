import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, useForm } from "react-hook-form";
import { array, number, object, string, TypeOf } from "zod";

export const accountElementSchema = object({
  elements: array(
    object({
      id: number().optional(),
      name: string().trim().optional(),
      type: string().trim().optional(),
    })
  ),
});

export type AccountElementSchemaType = TypeOf<typeof accountElementSchema>;

export const useAccountElementForm = (defaultValues: DefaultValues<AccountElementSchemaType>) => {
  return useForm<AccountElementSchemaType>({
    mode: "onSubmit",
    shouldFocusError: false,
    resolver: zodResolver(accountElementSchema),
    defaultValues,
  });
};
