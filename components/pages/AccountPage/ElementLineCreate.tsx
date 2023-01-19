import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { Controller, SubmitHandler } from "react-hook-form";
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
    control,
    reset,
  } = useCreateAccountElementForm({});

  const defaultValues = {
    name: "",
    type: "",
  };

  const onSubmit: SubmitHandler<CreateAccountElementSchemaType> = async () => {
    const values = getValues();
    await saveCreateAccountElement(values.name, values.type as ElementType);
    // @ts-ignore
    reset(defaultValues);
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
        <FormControl fullWidth error={!!errors["type"]}>
          <Controller
            name="type"
            control={control}
            // @ts-ignore
            defaultValue=""
            render={({ field, field: { value } }) => (
              <Select fullWidth defaultValue="" {...field} value={value} onBlur={handleSubmit(onSubmit)}>
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {Object.keys(ElementType).map((keyObj) => (
                  <MenuItem value={ElementType[keyObj as keyof typeof ElementType]} key={keyObj}>
                    {ElementType[keyObj as keyof typeof ElementType]}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <FormHelperText>{errors.type?.message}</FormHelperText>
        </FormControl>
      </TableCell>
      <TableCell align="center" sx={{ width: "72px", verticalAlign: "top" }} />
    </TableRow>
  );
}
