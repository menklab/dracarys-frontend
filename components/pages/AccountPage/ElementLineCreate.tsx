import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { useEffect } from "react";
import { Controller, SubmitHandler } from "react-hook-form";
import { useAccountPage } from "~/components/pages/AccountPage/context";
import { ElementType } from "~/enums/elementType";
import { CreateAccountElementSchemaType, useCreateAccountElementForm } from "~/forms/createAccountElement";

export default function ElementLineCreate() {
  const { saveCreateAccountElement, account } = useAccountPage();

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useCreateAccountElementForm({});

  const defaultValues = {
    name: "",
    type: "",
  };

  useEffect(() => {
    // @ts-ignore
    reset(defaultValues);
  }, [account]);

  const onSubmit: SubmitHandler<CreateAccountElementSchemaType> = async (values) => {
    await saveCreateAccountElement(values.name, values.type as ElementType);
    // @ts-ignore
    reset(defaultValues);
  };

  const elementKey = "elementLineNew";

  return (
    <TableRow sx={{ backgroundColor: "#ededed", "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell scope="row" align="center" sx={{ verticalAlign: "top" }}>
        <form id={elementKey} onSubmit={handleSubmit(onSubmit)} />
        <TextField
          fullWidth
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
      <TableCell align="center" sx={{ width: "40%", verticalAlign: "top" }}>
        <FormControl fullWidth error={!!errors["type"]}>
          <Controller
            name="type"
            control={control}
            // @ts-ignore
            defaultValue=""
            render={({ field, field: { value } }) => (
              <Select
                fullWidth
                defaultValue=""
                {...field}
                value={value}
                inputProps={{ form: elementKey }}
                onBlur={(e) => {
                  e.preventDefault();
                  // can't find a better way because e.currentTarget doesn't work
                  const newLineForm = window.document.getElementById(elementKey) as HTMLFormElement;
                  newLineForm.requestSubmit();
                }}
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
            )}
          />
          <FormHelperText>{errors.type?.message}</FormHelperText>
        </FormControl>
      </TableCell>
      <TableCell align="center" sx={{ width: "72px", verticalAlign: "top" }} />
    </TableRow>
  );
}
