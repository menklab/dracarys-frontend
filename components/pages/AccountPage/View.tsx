import DeleteOutline from "@mui/icons-material/DeleteOutline";
import { Box, Fade, IconButton, LinearProgress } from "@mui/material";
import FormControl from "@mui/material/FormControl";
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
import { SubmitHandler, useFieldArray } from "react-hook-form";
import { useAccountPage } from "~/components/pages/AccountPage/context";
import { RUST_KEYWORDS } from "~/constants/rust_keywords";
import { useTheme } from "~/contexts/theme/hooks";
import { ElementType, TypeArrayValidation } from "~/enums/elementType";
import { AccountElementSchemaType, useAccountElementForm } from "~/forms/accountElements";

export default function View() {
  const { accountElements, saveCreateAccountElement, saveEditAccountElement, removeAccountElement } = useAccountPage();
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
    watch,
  } = useAccountElementForm({
    elements: [...accountElements.map((a) => ({ id: a.id, name: a.name, type: a.type })), { name: "", type: "" }],
  });

  const { fields, append, remove, update } = useFieldArray({ control, name: "elements", keyName: "customId" });
  const elements = watch("elements");

  const onSubmit: SubmitHandler<AccountElementSchemaType> = useCallback(
    async (values) => {
      for (const [idx, element] of values.elements.entries()) {
        if (idx === values.elements.length - 1) continue;
        const { id, name, type } = element;
        if (name) {
          if (name.length < 1 || name.length >= 50) {
            setError(`elements.${idx}.name`, { message: "Name must be between 1 and 50 characters long" });
            continue;
          }
          if (RUST_KEYWORDS.includes(name)) {
            setError(`elements.${idx}.name`, { message: "Field can not include Rust reserved keywords." });
            continue;
          }
        } else {
          setError(`elements.${idx}.name`, { message: "Name is required" });
          continue;
        }
        if (type) {
          if (!(TypeArrayValidation as ReadonlyArray<string>).includes(type)) {
            setError(`elements.${idx}.name`, { message: "Value must be in type range" });
            continue;
          }
        } else {
          setError(`elements.${idx}.type`, { message: "Type is required" });
          continue;
        }

        if (!isLoading) setIsLoading(true);

        if (id) {
          if (accountElements[idx].name === name && accountElements[idx].type === type) continue;
          await saveEditAccountElement(id, name, type as ElementType);
        } else {
          const res = await saveCreateAccountElement(name, type as ElementType);
          update(idx, { id: res?.id!, name, type });
        }
      }
      setIsLoading(false);
    },
    [accountElements, isLoading, saveCreateAccountElement, saveEditAccountElement, setError, update]
  );

  const debouncedHandleSubmit = useMemo(() => debounce(handleSubmit(onSubmit), 1000), [handleSubmit, onSubmit]);
  useEffect(() => () => debouncedHandleSubmit.cancel(), [debouncedHandleSubmit]);

  const onChange = () => {
    const appendNew = !elements.find((e) => !e.name || !e.type);
    if (appendNew) append({ name: "", type: "" }, { shouldFocus: false });
  };

  const onDelete = async (idx: number) => {
    if (fields?.[idx]?.id) {
      setIsLoading(true);
      await removeAccountElement(fields[idx].id!);
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
              <TableCell align="center">Type</TableCell>
              <TableCell align="center" />
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map((field, idx) => (
              <TableRow
                key={`account-element-${idx}`}
                sx={{
                  ...(fields.length - 1 === idx ? { backgroundColor: theme.palette.divider } : {}),
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell component="th" scope="row" align="center">
                  <TextField
                    fullWidth
                    defaultValue={field.name}
                    inputProps={{ style: { textAlign: "center" } }}
                    error={!!errors.elements?.[idx]?.name}
                    helperText={errors.elements?.[idx]?.name?.message}
                    {...register(`elements.${idx}.name`)}
                  />
                </TableCell>
                <TableCell align="center" sx={{ width: "40%" }}>
                  <FormControl fullWidth error={!!errors.elements?.[idx]?.type}>
                    <Select
                      native
                      fullWidth
                      defaultValue={field.type}
                      inputProps={{ min: 0, style: { textAlign: "center" } }}
                      {...register(`elements.${idx}.type`)}
                    >
                      <option aria-label="None" value="" disabled />
                      {Object.keys(ElementType).map((keyObj) => (
                        <option
                          key={`${idx}-create-type-${keyObj}`}
                          value={ElementType[keyObj as keyof typeof ElementType]}
                        >
                          {ElementType[keyObj as keyof typeof ElementType]}
                        </option>
                      ))}
                    </Select>
                    {/* @ts-ignore */}
                    <FormHelperText>{errors.elements?.[idx]?.type?.message}</FormHelperText>
                  </FormControl>
                </TableCell>
                <TableCell align="center" sx={{ width: "72px" }}>
                  <IconButton
                    disabled={idx === fields.length - 1 || isLoading}
                    sx={{ alignSelf: "self-end" }}
                    onClick={() => onDelete(idx)}
                  >
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
