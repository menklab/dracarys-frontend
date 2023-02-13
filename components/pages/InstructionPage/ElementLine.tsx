import DeleteOutline from "@mui/icons-material/DeleteOutline";
import { IconButton } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Controller, SubmitHandler } from "react-hook-form";
import { useInstructionPage } from "~/components/pages/InstructionPage/context";
import { AccountType, GenericType } from "~/enums/instructionElementTypes";
import { EditInstructionElementSchemaType, useEditInstructionElementForm } from "~/forms/editInstructionElement";
import { Account } from "~/interfaces/account";
import { InstructionElement } from "~/interfaces/instructionElement";

interface ElementLineProps {
  instructionElement: InstructionElement;
  orderNumber: number;
}

export default function ElementLine({ instructionElement, orderNumber }: ElementLineProps) {
  const { saveEditInstructionName, accounts, removeInstructionElement } = useInstructionPage();
  const [intervalId, setIntervalId] = useState<any>(undefined);

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useEditInstructionElementForm({
    name: instructionElement.name,
    accountType: instructionElement.accountType,
    description: instructionElement.description,
    mut: instructionElement.mut,
  });

  const onSubmit: SubmitHandler<EditInstructionElementSchemaType> = async (values) => {
    const response = await saveEditInstructionName(
      instructionElement.id,
      values.name,
      orderNumber,
      values.description,
      values.mut,
      values.accountType as AccountType,
      values.genericType
    );
    if (response) {
      reset({
        name: response.name,
        accountType: response.accountType,
        description: response.description,
        mut: response.mut,
      });
    } else {
      reset();
    }
  };

  const elementKey = `elementLine${instructionElement.id}`;

  return (
    <TableRow
      sx={{ "&:last-child ttyped, &:last-child th": { border: 0 } }}
      onBlur={() => {
        const intervalIdTemp = setTimeout(() => {
          const editLineForm = window.document.getElementById(elementKey) as HTMLFormElement;
          editLineForm.requestSubmit();
        }, 1000);
        setIntervalId(intervalIdTemp);
      }}
    >
      <TableCell scope="row" align="center" sx={{ verticalAlign: "top", width: "23%" }}>
        <form onSubmit={handleSubmit(onSubmit)} id={elementKey} />
        <TextField
          fullWidth
          inputProps={{ style: { textAlign: "center" }, form: elementKey }}
          error={!!errors["name"]}
          helperText={errors["name"] ? errors["name"].message : ""}
          {...register("name")}
          onFocus={() => {
            clearTimeout(intervalId);
          }}
        />
      </TableCell>
      <TableCell scope="row" align="center" sx={{ verticalAlign: "top", width: "23%" }}>
        <FormControl fullWidth error={!!errors["accountType"]}>
          <Select
            native
            fullWidth
            defaultValue=""
            {...register("accountType")}
            inputProps={{ form: elementKey }}
            onFocus={() => {
              clearTimeout(intervalId);
            }}
          >
            <option aria-label="None" value="" />
            {Object.keys(AccountType).map((keyAccountLabel) => (
              <option
                key={`account-type-${keyAccountLabel}`}
                value={AccountType[keyAccountLabel as keyof typeof AccountType]}
              >
                {AccountType[keyAccountLabel as keyof typeof AccountType]}
              </option>
            ))}
          </Select>
          <FormHelperText>{errors.accountType?.message}</FormHelperText>
        </FormControl>
      </TableCell>
      <TableCell scope="row" align="center" sx={{ verticalAlign: "top", width: "23%" }}>
        <FormControl fullWidth error={!!errors["genericType"]}>
          <Select
            native
            fullWidth
            defaultValue={instructionElement.genericType}
            {...register("genericType")}
            inputProps={{ form: elementKey }}
            onFocus={() => {
              clearTimeout(intervalId);
            }}
          >
            <option aria-label="None" value="" />
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
          <FormHelperText>{errors.genericType?.message}</FormHelperText>
        </FormControl>
      </TableCell>
      <TableCell scope="row" align="center" sx={{ verticalAlign: "top", paddingTop: "22px" }}>
        <Controller
          name="mut"
          control={control}
          defaultValue={false}
          render={({ field, field: { value } }) => (
            <FormControlLabel
              control={
                <Checkbox
                  inputProps={{ style: { textAlign: "center" }, form: elementKey }}
                  {...field}
                  checked={!!value}
                  onFocus={() => {
                    clearTimeout(intervalId);
                  }}
                />
              }
              label={value ? "Yes" : "No"}
              labelPlacement="start"
            />
          )}
        />
      </TableCell>
      <TableCell scope="row" align="center" sx={{ verticalAlign: "top", width: "23%" }}>
        <TextField
          fullWidth
          inputProps={{ style: { textAlign: "center" }, form: elementKey }}
          error={!!errors["description"]}
          helperText={errors["description"] ? errors["description"].message : ""}
          {...register("description")}
          onFocus={() => {
            clearTimeout(intervalId);
          }}
        />
      </TableCell>
      <TableCell align="center" sx={{ width: "72px", verticalAlign: "top" }}>
        <IconButton
          sx={{ alignSelf: "self-end" }}
          onClick={() => {
            removeInstructionElement(instructionElement.id);
          }}
        >
          <DeleteOutline />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
