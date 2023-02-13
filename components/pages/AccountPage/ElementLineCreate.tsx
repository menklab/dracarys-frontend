import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler } from "react-hook-form";
import { useAccountPage } from "~/components/pages/AccountPage/context";
import { useTheme } from "~/contexts/theme/hooks";
import { ElementType } from "~/enums/elementType";
import { CreateAccountElementSchemaType, useCreateAccountElementForm } from "~/forms/createAccountElement";

export default function ElementLineCreate() {
  const { saveCreateAccountElement, account } = useAccountPage();
  const [intervalId, setIntervalId] = useState<any>(undefined);
  const {
    data: { theme },
  } = useTheme();

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
    <TableRow
      sx={{ backgroundColor: theme.palette.divider, "&:last-child td, &:last-child th": { border: 0 } }}
      onBlur={() => {
        const intervalIdTemp = setTimeout(() => {
          const newLineForm = window.document.getElementById(elementKey) as HTMLFormElement;
          newLineForm.requestSubmit();
        }, 1000);
        setIntervalId(intervalIdTemp);
      }}
    >
      <TableCell scope="row" align="center" sx={{ verticalAlign: "top" }}>
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
      <TableCell align="center" sx={{ width: "40%", verticalAlign: "top" }}>
        <FormControl fullWidth error={!!errors["type"]}>
          <Controller
            name="type"
            control={control}
            // @ts-ignore
            defaultValue=""
            render={({ field, field: { value } }) => (
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
            )}
          />
          <FormHelperText>{errors.type?.message}</FormHelperText>
        </FormControl>
      </TableCell>
      <TableCell align="center" sx={{ width: "72px", verticalAlign: "top" }} />
    </TableRow>
  );
}
