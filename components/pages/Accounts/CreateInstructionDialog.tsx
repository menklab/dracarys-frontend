import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
import { Box, Dialog, IconButton, TextField, Typography } from "@mui/material";
import { SubmitHandler } from "react-hook-form";
import { useAccountsPage } from "~/components/pages/Accounts/context";
import { CreateInstructionSchemaType, useCreateInstructionForm } from "~/forms/createInstruction";

export default function CreateInstructionDialog() {
  const { createInstructionDialogIsOpened, createInstructionDialogClose, createNewInstruction } = useAccountsPage();

  const {
    register,
    formState: { errors, isSubmitting },
    reset,
    handleSubmit,
  } = useCreateInstructionForm();

  const onSubmit: SubmitHandler<CreateInstructionSchemaType> = async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await createNewInstruction(values.name, values.description);
    createInstructionDialogClose();
    reset();
  };

  const onDialogClose = () => {
    createInstructionDialogClose();
    setTimeout(reset, 100);
  };

  return (
    <Dialog open={createInstructionDialogIsOpened} onClose={onDialogClose} fullWidth>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, p: 4 }}
      >
        <IconButton sx={{ alignSelf: "self-end" }} onClick={onDialogClose}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h4">Add instruction</Typography>
        <TextField
          fullWidth
          placeholder="Name"
          error={!!errors["name"]}
          helperText={errors["name"] ? errors["name"].message : ""}
          {...register("name")}
        />
        <TextField
          fullWidth
          placeholder="Description"
          error={!!errors["description"]}
          helperText={errors["description"] ? errors["description"].message : ""}
          {...register("description")}
        />
        <LoadingButton loading={isSubmitting} variant="contained" type="submit">
          Create instruction
        </LoadingButton>
      </Box>
    </Dialog>
  );
}
