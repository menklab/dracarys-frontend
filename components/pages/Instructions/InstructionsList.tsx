import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Link from "next/link";
import { useInstructionsPage } from "~/components/pages/Instructions/context";
import { ROUTES } from "~/constants/routes";

export default function InstructionsList() {
  const { instructions, program } = useInstructionsPage();

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {instructions.map((instruction) => (
            <TableRow
              hover
              key={`instructions-${instruction.id}`}
              component={Link}
              style={{ textDecoration: "none", color: "unset" }}
              href={ROUTES.INSTRUCTION(program.id, instruction.id)}
            >
              <TableCell align="center">{instruction.name}</TableCell>
              <TableCell
                align="center"
                sx={{ width: "60%", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 0 }}
              >
                {instruction.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
