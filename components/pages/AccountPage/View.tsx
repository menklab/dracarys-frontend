import DeleteOutline from "@mui/icons-material/DeleteOutline";
import { IconButton } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Account } from "~/interfaces/account";

interface AccountViewProps {
  account: Account;
}

function createData(name: string, type: string) {
  return { name, type };
}

const rows = [
  createData("Frozen", "Type 1"),
  createData("Ice", "Pubkey"),
  createData("Eclair", "String"),
  createData("Cupcake", "Test 3"),
];

export default function View({ account }: AccountViewProps) {
  console.log(account);
  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Type</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.type}</TableCell>
                <TableCell align="right">
                  <IconButton sx={{ alignSelf: "self-end" }}>
                    <DeleteOutline />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
