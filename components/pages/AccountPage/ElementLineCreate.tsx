import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { SubmitHandler } from "react-hook-form";
import { useAccountPage } from "~/components/pages/AccountPage/context";
import { CreateAccountElementSchemaType, useCreateAccountElementForm } from "~/forms/createAccountElement";
import { ElementType } from "~/interfaces/accountElement";

export default function ElementLineCreate() {
  const { saveCreateAccountElement } = useAccountPage();

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
    reset,
  } = useCreateAccountElementForm({});

  const defaultValues = {
    name: "",
    type: "",
  };

  const onSubmit: SubmitHandler<CreateAccountElementSchemaType> = async () => {
    const values = getValues();
    console.log(values);
    await saveCreateAccountElement(values.name, values.type as ElementType);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // @ts-ignore
    reset(defaultValues);
    setValue("name", "");
    // @ts-ignore
    setValue("type", "");
  };

  return (
    <TableRow sx={{ backgroundColor: "#ededed", "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell scope="row" align="center" sx={{ verticalAlign: "top" }}>
        <TextField
          fullWidth
          inputProps={{ style: { textAlign: "center" } }}
          error={!!errors["name"]}
          helperText={errors["name"] ? errors["name"].message : ""}
          {...register("name")}
          onBlur={handleSubmit(onSubmit)}
        />
      </TableCell>
      <TableCell align="center" sx={{ width: "40%", verticalAlign: "top" }}>
        <Select
          fullWidth
          defaultValue=""
          error={!!errors["type"]}
          {...register("type")}
          onBlur={handleSubmit(onSubmit)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {Object.keys(ElementType).map((keyObj) => (
            <MenuItem value={ElementType[keyObj as keyof typeof ElementType]} key={keyObj}>
              {ElementType[keyObj as keyof typeof ElementType]}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{errors.type?.message}</FormHelperText>
      </TableCell>
      <TableCell align="center" sx={{ width: "72px", verticalAlign: "top" }} />
    </TableRow>
  );
}
