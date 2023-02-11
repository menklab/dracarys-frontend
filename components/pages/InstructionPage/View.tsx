import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useInstructionPage } from "~/components/pages/InstructionPage/context";
import ElementLine from "~/components/pages/InstructionPage/ElementLine";
import ElementLineCreate from "~/components/pages/InstructionPage/ElementLineCreate";

export default function View() {
  const { instructionElements } = useInstructionPage();

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Account type</TableCell>
              <TableCell align="center">Generic type</TableCell>
              <TableCell align="center">Mut</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center" />
            </TableRow>
          </TableHead>
          <TableBody>
            {instructionElements
              .sort(function (a, b) {
                return a["order"] - b["order"];
              })
              .map((instructionElement, number) => {
                return (
                  <ElementLine
                    key={instructionElement.id}
                    instructionElement={instructionElement}
                    orderNumber={number}
                  />
                );
              })}
            <ElementLineCreate orderNumber={instructionElements.length} />
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
