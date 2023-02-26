import { Box, Fade, LinearProgress } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SubmitHandler, useFieldArray } from "react-hook-form";
import { useInstructionPage } from "~/components/pages/InstructionPage/context";
import TableLine from "~/components/pages/InstructionPage/TableLine";
import { RUST_KEYWORDS } from "~/constants/rust_keywords";
import { AccountType } from "~/enums/instructionElementTypes";
import { InstructionElementSchemaType, useInstructionElementForm } from "~/forms/instructionElement";
import { GenericCustomSubType, GenericSubType, GenericType } from "~/interfaces/genericType";

export default function View() {
  const {
    instructionElements,
    genericTypes,
    removeInstructionElement,
    saveEditInstructionElement,
    saveCreateInstructionElement,
  } = useInstructionPage();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
    getValues,
  } = useInstructionElementForm({
    elements: [
      ...instructionElements
        .sort((ie) => ie.order - ie.order)
        .map((ie) => {
          return {
            id: ie.id,
            name: ie.name,
            accountType: ie.accountType,
            genericType: ie.genericType.name,
            description: ie.description || "",
            mut: ie.mut,
          };
        }),
      { name: "", accountType: "", genericType: "", mut: false, description: "" },
    ],
  });

  const { fields, append, remove, update, move } = useFieldArray({ control, name: "elements", keyName: "customId" });

  const searchGenTypeObj = (genTypeName: string) => {
    let result = null;
    Object.keys(genericTypes).forEach((genKey) => {
      genericTypes[genKey as keyof GenericType].options.forEach(
        (subType: GenericSubType | GenericCustomSubType, index) => {
          if (subType.name == genTypeName) {
            result = subType;
          }
        }
      );
    });
    return result;
  };

  const onSubmit: SubmitHandler<InstructionElementSchemaType> = useCallback(
    async (values) => {
      for (const [idx, element] of values.elements.entries()) {
        if (idx === values.elements.length - 1) continue;
        const { id, name, accountType, genericType, mut, description } = element;
        if (!name) {
          setError(`elements.${idx}.name`, { message: "Name is required" });
          continue;
        }

        if (name.length < 1 || name.length >= 50) {
          setError(`elements.${idx}.name`, { message: "Name must be between 1 and 50 characters long" });
          continue;
        }

        if (!/^[a-z0-9_]+$/.test(name)) {
          setError(`elements.${idx}.name`, {
            message: "Field can only include lowercase letters, numbers and underscore",
          });
          continue;
        }

        if (RUST_KEYWORDS.includes(name)) {
          setError(`elements.${idx}.name`, { message: "Field can not include Rust reserved keywords." });
          continue;
        }

        if (!accountType) {
          setError(`elements.${idx}.accountType`, { message: "Account Type is required" });
          continue;
        }

        if (!Object.values(AccountType).includes(accountType as AccountType)) {
          setError(`elements.${idx}.accountType`, { message: "Account Type is required" });
          continue;
        }

        if (!genericType) {
          setError(`elements.${idx}.genericType`, { message: "Generic Type is required" });
          continue;
        }

        if (description && description.length >= 300) {
          setError(`elements.${idx}.description`, { message: "Description must be max 300 characters long" });
          continue;
        }

        if (!isLoading) setIsLoading(true);

        if (id) {
          if (
            instructionElements[idx].name === name &&
            instructionElements[idx].accountType === accountType &&
            instructionElements[idx].genericType.name === genericType &&
            instructionElements[idx].mut === mut &&
            instructionElements[idx].description === description
          )
            continue;

          const genericTypeToSend = searchGenTypeObj(genericType);
          await saveEditInstructionElement(
            id,
            name,
            idx,
            description || "",
            mut,
            accountType as AccountType,
            // @ts-ignore
            genericTypeToSend
          );
        } else {
          const genericTypeToSend = searchGenTypeObj(genericType);

          const res = await saveCreateInstructionElement(
            name,
            idx,
            description || "",
            mut,
            accountType as AccountType,
            // @ts-ignore
            genericTypeToSend
          );
          update(idx, { id: res?.id!, name, accountType, genericType, mut, description });
        }
      }
      setIsLoading(false);
    },
    [instructionElements, isLoading, saveCreateInstructionElement, saveEditInstructionElement, setError, update]
  );

  const debouncedHandleSubmit = useMemo(() => debounce(handleSubmit(onSubmit), 1000), [handleSubmit, onSubmit]);
  useEffect(() => () => debouncedHandleSubmit.cancel(), [debouncedHandleSubmit]);

  const onChange = () => {
    const appendNew = !getValues().elements.find((e) => !e.name || !e.accountType || !e.genericType);
    if (appendNew)
      append({ name: "", accountType: "", genericType: "", mut: false, description: "" }, { shouldFocus: false });
  };

  const onDelete = async (idx: number) => {
    if (fields?.[idx]?.id) {
      setIsLoading(true);
      await removeInstructionElement(fields[idx].id!);
      setIsLoading(false);
    }

    debouncedHandleSubmit.cancel();
    remove(idx);
  };

  const moveRow = useCallback((dragIndex: number, hoverIndex: number) => {
    move(dragIndex, hoverIndex);
    debouncedHandleSubmit();
  }, []);

  const renderRow = useCallback((field: any, idx: number) => {
    return (
      <TableLine
        key={`instruction-element-fn-${idx}`}
        idx={idx}
        id={field.id}
        field={field}
        moveRow={moveRow}
        control={control}
        isLoading={isLoading}
        onDelete={onDelete}
        register={register}
        errors={errors}
        fieldsLength={fields.length}
      />
    );
  }, []);

  return (
    <Box component="form" onBlur={debouncedHandleSubmit} onChange={onChange}>
      <Fade in={isLoading}>
        <LinearProgress />
      </Fade>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center" />
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Account type</TableCell>
              <TableCell align="center">Generic type</TableCell>
              <TableCell align="center">Mut</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center" />
            </TableRow>
          </TableHead>
          <TableBody>{fields.map((field, idx) => renderRow(field, idx))}</TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
