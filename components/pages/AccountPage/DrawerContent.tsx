import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import EditIcon from "@mui/icons-material/Edit";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { Fragment } from "react";
import { SubmitHandler } from "react-hook-form";
import { useAccountPage } from "~/components/pages/AccountPage/context";
import { ROUTES } from "~/constants/routes";
import { EditProgramNameSchemaType, useEditProgramNameForm } from "~/forms/editProgramName";

export default function DrawerContent() {
  const {
    program,
    accounts,
    instructions,
    editProgramName,
    openInstructions,
    handleOpenInstructions,
    saveEditProgramName,
    cancelEditProgramName,
    isEditingProgramName,
    goBackToProgramsList,
    openAccounts,
    handleOpenAccounts,
  } = useAccountPage();

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useEditProgramNameForm({ name: program.name });

  const onSubmit: SubmitHandler<EditProgramNameSchemaType> = async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await saveEditProgramName(values.name);
  };

  return (
    <List component="form" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <ListItem
        secondaryAction={
          isEditingProgramName ? (
            <Fragment key="isEditingProgramName">
              <IconButton type="submit" disabled={isSubmitting}>
                <CheckIcon />
              </IconButton>
              <IconButton edge="end" onClick={cancelEditProgramName} disabled={isSubmitting}>
                <CancelIcon />
              </IconButton>
            </Fragment>
          ) : (
            <IconButton onClick={editProgramName}>
              <EditIcon />
            </IconButton>
          )
        }
      >
        <ListItemIcon>
          <IconButton onClick={goBackToProgramsList} disabled={isSubmitting}>
            <ChevronLeftIcon />
          </IconButton>
        </ListItemIcon>
        <ListItemText>
          {isEditingProgramName ? (
            <TextField
              sx={{ width: 140 }}
              size="small"
              variant="standard"
              error={!!errors["name"]}
              helperText={errors["name"] ? errors["name"].message : ""}
              {...register("name")}
            />
          ) : (
            program.name
          )}
        </ListItemText>
      </ListItem>
      <Divider />
      <ListItem disablePadding>
        <ListItemButton>
          <IconButton onClick={handleOpenAccounts}>{openAccounts ? <ExpandLess /> : <ExpandMore />}</IconButton>
          <Link
            key={`accounts-${program.id}`}
            href={ROUTES.ACCOUNTS(program.id)}
            style={{ textDecoration: "none", color: "unset" }}
          >
            <ListItemText>
              <b>Accounts</b>
            </ListItemText>
          </Link>
        </ListItemButton>
      </ListItem>
      <Collapse in={openAccounts} timeout="auto" unmountOnExit>
        {accounts
          .sort((a, b) => a.id - b.id)
          .map((account) => {
            return (
              <Link
                key={`account-${account.id}`}
                href={ROUTES.ACCOUNT(program.id, account.id)}
                style={{ textDecoration: "none", color: "unset" }}
              >
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 7 }}>
                    <ListItemText
                      primary={account.name}
                      primaryTypographyProps={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    />
                  </ListItemButton>
                </List>
              </Link>
            );
          })}
      </Collapse>
      <ListItem disablePadding>
        <ListItemButton>
          <IconButton onClick={handleOpenInstructions}>{openInstructions ? <ExpandLess /> : <ExpandMore />}</IconButton>
          <Link
            key={`instructions-${program.id}`}
            href={ROUTES.INSTRUCTIONS(program.id)}
            style={{ textDecoration: "none", color: "unset" }}
          >
            <ListItemText>Instructions</ListItemText>
          </Link>
        </ListItemButton>
      </ListItem>
      <Collapse in={openInstructions} timeout="auto" unmountOnExit>
        {instructions.map((instruction) => {
          return (
            <Link
              key={`account-${instruction.id}`}
              href={ROUTES.INSTRUCTION(program.id, instruction.id)}
              style={{ textDecoration: "none", color: "unset" }}
            >
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 7 }}>
                  <ListItemText
                    primary={instruction.name}
                    primaryTypographyProps={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  />
                </ListItemButton>
              </List>
            </Link>
          );
        })}
      </Collapse>
    </List>
  );
}
