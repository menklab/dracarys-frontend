import DeleteOutline from "@mui/icons-material/DeleteOutline";
import { IconButton } from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
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

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useEditAccountElementForm({ name: accountElement.name, type: accountElement.type });

  const onSubmit: SubmitHandler<EditAccountElementSchemaType> = async (values) => {
    await saveEditAccountElement(accountElement.id, values.name, values.type as ElementType);
    reset({});
  };

  const elementKey = `elementLine${accountElement.id}`;

  return (
    <TableRow key={accountElement.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell component="th" scope="row" align="center">
        <form id={elementKey} onSubmit={handleSubmit(onSubmit)} />
        <TextField
          fullWidth
          defaultValue={accountElement.name}
          inputProps={{ style: { textAlign: "center" }, form: elementKey }}
          error={!!errors["name"]}
          helperText={errors["name"] ? errors["name"].message : ""}
          {...register("name")}
          onBlur={(e) => {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
          }}
        />
      </TableCell>
      <TableCell align="center" sx={{ width: "40%" }}>
        <Select
          fullWidth
          error={!!errors["type"]}
          defaultValue={accountElement.type}
          {...register("type")}
          inputProps={{ form: elementKey }}
          onBlur={(e) => {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
          }}
        >
          {Object.keys(ElementType).map((keyObj) => (
            <MenuItem value={ElementType[keyObj as keyof typeof ElementType]} key={keyObj}>
              {ElementType[keyObj as keyof typeof ElementType]}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{errors.type?.message}</FormHelperText>
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
