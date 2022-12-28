import { Box, Divider, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import Link from "next/link";
import { useProgramsPage } from "~/components/pages/Programs/context";
import { ROUTES } from "~/constants/routes";

export default function View() {
  const { programs } = useProgramsPage();

  return (
    <Box>
      <List sx={{ p: 0 }}>
        {programs.map((program) => (
          <Link
            key={`program-${program.id}`}
            href={ROUTES.PROGRAM(program.id)}
            style={{ textDecoration: "none", color: "unset" }}
          >
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText>{program.name}</ListItemText>
              </ListItemButton>
            </ListItem>
            <Divider />
          </Link>
        ))}
      </List>
    </Box>
  );
}
