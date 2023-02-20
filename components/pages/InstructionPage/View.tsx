import DeleteOutline from "@mui/icons-material/DeleteOutline";
import { Box, Fade, IconButton, LinearProgress } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useFieldArray } from "react-hook-form";
import { useInstructionPage } from "~/components/pages/InstructionPage/context";
import { RUST_KEYWORDS } from "~/constants/rust_keywords";
import { useTheme } from "~/contexts/theme/hooks";
import { AccountType, GenericType } from "~/enums/instructionElementTypes";
import { InstructionElementSchemaType, useInstructionElementForm } from "~/forms/instructionElement";
import { Account } from "~/interfaces/account";

export default function View() {
  const {
    instructionElements,
    accounts,
    removeInstructionElement,
    saveEditInstructionName,
    saveCreateInstructionElement,
  } = useInstructionPage();
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: { theme },
  } = useTheme();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
    getValues,
  } = useInstructionElementForm({
    elements: [
      ...instructionElements.map((ie) => ({
        id: ie.id,
        name: ie.name,
        accountType: ie.accountType,
        description: ie.description || "",
        mut: ie.mut,
      })),
      { name: "", accountType: "", genericType: "", mut: false, description: "" },
    ],
  });

  const { fields, append, remove, update } = useFieldArray({ control, name: "elements", keyName: "customId" });

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
            instructionElements[idx].genericType === genericType &&
            instructionElements[idx].mut === mut &&
            instructionElements[idx].description === description
          )
            continue;
          await saveEditInstructionName(id, name, idx, description || "", mut, accountType as AccountType, genericType);
        } else {
          const res = await saveCreateInstructionElement(
            name,
            idx,
            description || "",
            mut,
            accountType as AccountType,
            genericType
          );
          update(idx, { id: res?.id!, name, accountType, genericType, mut, description });
        }
      }
      setIsLoading(false);
    },
    [instructionElements, isLoading, saveCreateInstructionElement, saveEditInstructionName, setError, update]
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

  return (
    <Box component="form" onBlur={debouncedHandleSubmit} onChange={onChange}>
      <Fade in={isLoading}>
        <LinearProgress />
      </Fade>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Account type</TableCell>
              <TableCell align="center">Generic type</TableCell>
              <TableCell align="center">Mut</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center" />
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map((field, idx) => (
              <TableRow
                key={`instruction-element-${idx}`}
                sx={{
                  ...(fields.length - 1 === idx ? { backgroundColor: theme.palette.divider } : {}),
                  "&:last-child ttyped, &:last-child th": { border: 0 },
                }}
              >
                <TableCell align="center" sx={{ width: "20%" }}>
                  <TextField
                    fullWidth
                    inputProps={{ style: { textAlign: "center" } }}
                    error={!!errors.elements?.[idx]?.name}
                    helperText={errors.elements?.[idx]?.name?.message}
                    {...register(`elements.${idx}.name`)}
                  />
                </TableCell>
                <TableCell align="center" sx={{ width: "20%" }}>
                  <FormControl fullWidth error={!!errors.elements?.[idx]?.accountType}>
                    <Select
                      native
                      fullWidth
                      defaultValue={field.accountType}
                      {...register(`elements.${idx}.accountType`)}
                    >
                      <option aria-label="None" value="" disabled />
                      {Object.keys(AccountType).map((keyAccountLabel) => (
                        <option
                          key={`account-type-${keyAccountLabel}`}
                          value={AccountType[keyAccountLabel as keyof typeof AccountType]}
                        >
                          {AccountType[keyAccountLabel as keyof typeof AccountType]}
                        </option>
                      ))}
                    </Select>
                    <FormHelperText>{errors.elements?.[idx]?.accountType?.message}</FormHelperText>
                  </FormControl>
                </TableCell>
                <TableCell align="center" sx={{ width: "20%" }}>
                  <FormControl fullWidth error={!!errors.elements?.[idx]?.genericType}>
                    <Select
                      native
                      fullWidth
                      defaultValue={field.genericType}
                      {...register(`elements.${idx}.genericType`)}
                    >
                      <option aria-label="None" value="" disabled />
                      {Object.keys(GenericType).map((keyObjLabel) => (
                        <optgroup key={`generic-type-${keyObjLabel}`} label={keyObjLabel}>
                          {GenericType[keyObjLabel as keyof typeof GenericType].map((subType: string) => {
                            return (
                              <option key={`generic-subtype-${subType}`} value={subType}>
                                {subType}
                              </option>
                            );
                          })}
                        </optgroup>
                      ))}
                      <optgroup label="Custom Accounts">
                        {accounts.map((accountType: Account) => {
                          return (
                            <option key={`generic-subtype-${accountType.name}`} value={accountType.name}>
                              {accountType.name}
                            </option>
                          );
                        })}
                      </optgroup>
                    </Select>
                    <FormHelperText>{errors.elements?.[idx]?.genericType?.message}</FormHelperText>
                  </FormControl>
                </TableCell>
                <TableCell align="center" sx={{ width: "10%" }}>
                  <Controller
                    name={`elements.${idx}.mut`}
                    control={control}
                    defaultValue={false}
                    render={({ field: mutField, field: { value: mutValue } }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            inputProps={{ style: { textAlign: "center" } }}
                            {...mutField}
                            checked={!!mutValue}
                          />
                        }
                        label={mutValue ? "Yes" : "No"}
                        labelPlacement="start"
                      />
                    )}
                  />
                </TableCell>
                <TableCell align="center" sx={{ width: "20%" }}>
                  <TextField
                    fullWidth
                    inputProps={{ style: { textAlign: "center" } }}
                    error={!!errors.elements?.[idx]?.description}
                    helperText={errors.elements?.[idx]?.description?.message}
                    {...register(`elements.${idx}.description`)}
                  />
                </TableCell>
                <TableCell align="center" sx={{ width: "5%" }}>
                  <IconButton disabled={idx === fields.length - 1 || isLoading} onClick={() => onDelete(idx)}>
                    <DeleteOutline />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
