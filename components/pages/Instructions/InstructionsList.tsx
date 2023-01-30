import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useInstructionsPage } from "~/components/pages/Instructions/context";

export default function InstructionsList() {
  const { instructions } = useInstructionsPage();

  // const innerBlock = viewVariant === "code" ? <CodeBlock getGeneratedCode={getGeneratedAccountCode} /> : <div />;

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
            <TableRow key={`instructions-${instruction.id}`}>
              <TableCell align="center">{instruction.name}</TableCell>
              <TableCell align="center" sx={{ width: "60%" }}>
                {instruction.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
