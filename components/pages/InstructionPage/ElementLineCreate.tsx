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
import { CreateInstructionElementSchemaType, useCreateInstructionElementForm } from "~/forms/createInstructionElement";
import { Account } from "~/interfaces/account";

interface CreateElementLineProps {
  orderNumber: number;
}

export default function ElementLineCreate({ orderNumber }: CreateElementLineProps) {
  const { saveCreateInstructionElement, accounts } = useInstructionPage();
  const [intervalId, setIntervalId] = useState<any>(undefined);

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useCreateInstructionElementForm({});

  const defaultValues = {
    name: "",
    description: "",
    mut: false,
    accountType: "",
    genericType: "",
  };

  const onSubmit: SubmitHandler<CreateInstructionElementSchemaType> = async (values) => {
    await saveCreateInstructionElement(
      values.name,
      orderNumber,
      values.description,
      values.mut,
      values.accountType as AccountType,
      values.genericType
    );
    // @ts-ignore
    reset(defaultValues);
  };

  const elementKey = "elementLineNew";

  return (
    <TableRow
      sx={{ backgroundColor: "#ededed", "&:last-child td, &:last-child th": { border: 0 } }}
      onBlur={() => {
        const intervalIdTemp = setTimeout(() => {
          const newLineForm = window.document.getElementById(elementKey) as HTMLFormElement;
          newLineForm.requestSubmit();
        }, 1000);
        setIntervalId(intervalIdTemp);
      }}
    >
      <TableCell scope="row" align="center" sx={{ verticalAlign: "top", width: "23%" }}>
        <form id={elementKey} onSubmit={handleSubmit(onSubmit)} />
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
            defaultValue=""
            inputProps={{ form: elementKey }}
            {...register("genericType")}
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
            <FormControl error={!!errors["mut"]}>
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
            </FormControl>
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
      <TableCell align="center" sx={{ width: "72px", verticalAlign: "top" }} />
    </TableRow>
  );
}
