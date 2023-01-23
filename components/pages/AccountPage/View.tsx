import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useAccountPage } from "~/components/pages/AccountPage/context";
import ElementLine from "./ElementLine";
import ElementLineCreate from "./ElementLineCreate";

export default function View() {
  const { accountElements } = useAccountPage();

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center" />
            </TableRow>
          </TableHead>
          <TableBody>
            {accountElements.map((accountElement) => {
              return <ElementLine key={accountElement.id} accountElement={accountElement} />;
            })}
            <ElementLineCreate />
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
