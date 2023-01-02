import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Dialog, IconButton, Typography } from "@mui/material";
import { useAccountsPage } from "~/components/pages/Accounts/context";

export default function DeleteProgramDialog() {
  const { isDeleteProgramDialogOpen, closeDeleteProgramDialog, deleteProgram, isProgramDeleting } = useAccountsPage();

  return (
    <Dialog open={isDeleteProgramDialogOpen} fullWidth>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, p: 4 }}>
        <IconButton sx={{ alignSelf: "self-end" }} onClick={closeDeleteProgramDialog}>
          <CloseIcon />
        </IconButton>
        <WarningAmberIcon sx={{ fontSize: 70, color: "warning.main" }} />
        <Typography variant="h5">Delete program</Typography>
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          Are you sure you want to delete this program?
          <br />
          This operation cannot be undone
        </Typography>
        <Box sx={{ display: "flex", gap: 4 }}>
          <LoadingButton loading={isProgramDeleting} variant="contained" onClick={deleteProgram}>
            Yes, delete
          </LoadingButton>
          <Button variant="outlined" onClick={closeDeleteProgramDialog}>
            No, keep it
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
