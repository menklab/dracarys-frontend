import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
import { Box, Dialog, IconButton, TextField, Typography } from "@mui/material";
import { SubmitHandler } from "react-hook-form";
import { useInstructionPage } from "~/components/pages/InstructionPage/context";
import { EditInstructionSchemaType, useEditInstructionForm } from "~/forms/editInstruction";

export default function EditInstructionDialog() {
  const { editInstructionDialogIsOpened, editInstructionDialogClose, editInstruction, instruction } =
    useInstructionPage();

  console.log(instruction);
  const {
    register,
    formState: { errors, isSubmitting },
    reset,
    handleSubmit,
  } = useEditInstructionForm({ name: instruction.name, description: instruction.description });

  const onSubmit: SubmitHandler<EditInstructionSchemaType> = async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await editInstruction(values.name, values.description);
    editInstructionDialogClose();
    reset({});
  };

  return (
    <Dialog open={editInstructionDialogIsOpened} fullWidth>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, p: 4 }}
      >
        <IconButton sx={{ alignSelf: "self-end" }} onClick={editInstructionDialogClose}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h4">Edit instruction</Typography>
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
          Save
        </LoadingButton>
      </Box>
    </Dialog>
  );
}
