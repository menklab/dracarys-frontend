import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, IconButton } from "@mui/material";
import Link from "next/link";
import { useInstructionPage } from "~/components/pages/InstructionPage/context";
import { ROUTES } from "~/constants/routes";

export default function AppBarContent() {
  const { editInstructionDialogOpen, instruction, program, openDeleteInstructionDialog } = useInstructionPage();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Link
          key={`program-${program.id}`}
          href={ROUTES.ACCOUNTS(program.id)}
          style={{ textDecoration: "none", color: "unset" }}
        >
          <IconButton sx={{ alignSelf: "self-end" }}>
            <ChevronLeftIcon />
          </IconButton>
        </Link>
        <>
          <p style={{ margin: "0 10px", fontSize: "24px" }}>{instruction.name}</p>
          <IconButton sx={{ alignSelf: "self-end" }} onClick={editInstructionDialogOpen}>
            <EditIcon />
          </IconButton>
        </>
      </Box>
      <Button sx={{ ml: "auto" }} endIcon={<DeleteIcon />} onClick={openDeleteInstructionDialog}>
        Delete instruction
      </Button>
    </>
  );
}
