import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
import { Box, Dialog, IconButton, TextField, Typography } from "@mui/material";
import { SubmitHandler } from "react-hook-form";
import { useProgramsPage } from "~/components/pages/Programs/context";
import { CreateProgramSchemaType, useCreateProgramForm } from "~/forms/createProgram";

export default function CreateProgramDialog() {
  const { createProgramDialogIsOpened, createNewProgram, createProgramDialogClose } = useProgramsPage();

  const {
    register,
    formState: { errors, isSubmitting },
    reset,
    handleSubmit,
  } = useCreateProgramForm();

  const onSubmit: SubmitHandler<CreateProgramSchemaType> = async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await createNewProgram(values.name);
    createProgramDialogClose();
    reset();
  };

  return (
    <Dialog open={createProgramDialogIsOpened} fullWidth>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, p: 4 }}
      >
        <IconButton sx={{ alignSelf: "self-end" }} onClick={createProgramDialogClose}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h4">Add program</Typography>
        <TextField
          fullWidth
          label="Name"
          error={!!errors["name"]}
          helperText={errors["name"] ? errors["name"].message : ""}
          {...register("name")}
        />
        <LoadingButton loading={isSubmitting} variant="contained" type="submit">
          Create program
        </LoadingButton>
      </Box>
    </Dialog>
  );
}
