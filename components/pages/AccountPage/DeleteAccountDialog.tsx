import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Dialog, IconButton, Typography } from "@mui/material";
import { useAccountPage } from "~/components/pages/AccountPage/context";

export default function DeleteAccountDialog() {
  const { isDeleteAccountDialogOpen, closeDeleteAccountDialog, removeAccount, isAccountDeleting } = useAccountPage();

  return (
    <Dialog open={isDeleteAccountDialogOpen} fullWidth>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, p: 4 }}>
        <IconButton sx={{ alignSelf: "self-end" }} onClick={closeDeleteAccountDialog}>
          <CloseIcon />
        </IconButton>
        <WarningAmberIcon sx={{ fontSize: 70, color: "warning.main" }} />
        <Typography variant="h5">Delete account</Typography>
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          Are you sure you want to delete this account?
          <br />
          This operation cannot be undone
        </Typography>
        <Box sx={{ display: "flex", gap: 4 }}>
          <LoadingButton loading={isAccountDeleting} variant="contained" onClick={removeAccount}>
            Yes, delete
          </LoadingButton>
          <Button variant="outlined" onClick={closeDeleteAccountDialog}>
            No, keep it
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
