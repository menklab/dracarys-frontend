import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Dialog, IconButton, Typography } from "@mui/material";
import { useInstructionPage } from "~/components/pages/InstructionPage/context";

export default function DeleteInstructionDialog() {
  const { isDeleteInstructionDialogOpen, closeDeleteInstructionDialog, removeInstruction, isInstructionDeleting } =
    useInstructionPage();

  return (
    <Dialog open={isDeleteInstructionDialogOpen} fullWidth>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, p: 4 }}>
        <IconButton sx={{ alignSelf: "self-end" }} onClick={closeDeleteInstructionDialog}>
          <CloseIcon />
        </IconButton>
        <WarningAmberIcon sx={{ fontSize: 70, color: "warning.main" }} />
        <Typography variant="h5">Delete instruction</Typography>
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          Are you sure you want to delete this instruction?
          <br />
          This operation cannot be undone
        </Typography>
        <Box sx={{ display: "flex", gap: 4 }}>
          <LoadingButton loading={isInstructionDeleting} variant="contained" onClick={removeInstruction}>
            Yes, delete
          </LoadingButton>
          <Button variant="outlined" onClick={closeDeleteInstructionDialog}>
            No, keep it
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
