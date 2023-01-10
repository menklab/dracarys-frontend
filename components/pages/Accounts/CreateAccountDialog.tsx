import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
import { Box, Dialog, IconButton, TextField, Typography } from "@mui/material";
import { SubmitHandler } from "react-hook-form";
import { useAccountsPage } from "~/components/pages/Accounts/context";
import { CreateAccountSchemaType, useCreateAccountForm } from "~/forms/createAccount";

export default function CreateAccountDialog() {
  const { createAccountDialogIsOpened, createAccountDialogClose, createNewAccount } = useAccountsPage();

  const {
    register,
    formState: { errors, isSubmitting },
    reset,
    handleSubmit,
  } = useCreateAccountForm();

  const onSubmit: SubmitHandler<CreateAccountSchemaType> = async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await createNewAccount(values.name);
    createAccountDialogClose();
    reset();
  };

  return (
    <Dialog open={createAccountDialogIsOpened} fullWidth>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, p: 4 }}
      >
        <IconButton sx={{ alignSelf: "self-end" }} onClick={createAccountDialogClose}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h4">Add account</Typography>
        <TextField
          fullWidth
          error={!!errors["name"]}
          helperText={errors["name"] ? errors["name"].message : ""}
          {...register("name")}
        />
        <LoadingButton loading={isSubmitting} variant="contained" type="submit">
          Create account
        </LoadingButton>
      </Box>
    </Dialog>
  );
}
