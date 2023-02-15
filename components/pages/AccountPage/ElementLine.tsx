import DeleteOutline from "@mui/icons-material/DeleteOutline";
import { IconButton } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { useAccountPage } from "~/components/pages/AccountPage/context";
import { ElementType } from "~/enums/elementType";
import { EditAccountElementSchemaType, useEditAccountElementForm } from "~/forms/editAccountElement";
import { AccountElement } from "~/interfaces/accountElement";

interface ElementLineProps {
  accountElement: AccountElement;
}

export default function ElementLine({ accountElement }: ElementLineProps) {
  const { saveEditAccountElement, removeAccountElement } = useAccountPage();
  const [intervalId, setIntervalId] = useState<any>(undefined);

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useEditAccountElementForm({ name: accountElement.name, type: accountElement.type });

  const onSubmit: SubmitHandler<EditAccountElementSchemaType> = async (values) => {
    const response = await saveEditAccountElement(accountElement.id, values.name, values.type as ElementType);
    if (response) {
      reset({
        name: response.name,
        type: response.type,
      });
    } else {
      reset();
    }
  };

  const elementKey = `elementLine${accountElement.id}`;

  return (
    <TableRow
      key={accountElement.name}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      onBlur={() => {
        const intervalIdTemp = setTimeout(() => {
          const editLineForm = window.document.getElementById(elementKey) as HTMLFormElement;
          editLineForm.requestSubmit();
        }, 1000);
        setIntervalId(intervalIdTemp);
      }}
    >
      <TableCell component="th" scope="row" align="center">
        <form id={elementKey} onSubmit={handleSubmit(onSubmit)} />
        <TextField
          fullWidth
          defaultValue={accountElement.name}
          inputProps={{ style: { textAlign: "center" }, form: elementKey }}
          error={!!errors["name"]}
          helperText={errors["name"] ? errors["name"].message : ""}
          {...register("name")}
          onFocus={() => {
            clearTimeout(intervalId);
          }}
        />
      </TableCell>
      <TableCell align="center" sx={{ width: "40%" }}>
        <FormControl fullWidth error={!!errors["type"]}>
          <Select
            native
            fullWidth
            defaultValue=""
            {...register("type")}
            inputProps={{ form: elementKey }}
            onFocus={() => {
              clearTimeout(intervalId);
            }}
          >
            <option aria-label="None" value="" />
            {Object.keys(ElementType).map((keyObj) => (
              <option key={`create-type-${keyObj}`} value={ElementType[keyObj as keyof typeof ElementType]}>
                {ElementType[keyObj as keyof typeof ElementType]}
              </option>
            ))}
          </Select>
          <FormHelperText>{errors.type?.message}</FormHelperText>
        </FormControl>
      </TableCell>
      <TableCell align="center" sx={{ width: "72px" }}>
        <IconButton
          sx={{ alignSelf: "self-end" }}
          onClick={() => {
            removeAccountElement(accountElement.id);
          }}
        >
          <DeleteOutline />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
