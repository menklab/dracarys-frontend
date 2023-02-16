import AddIcon from "@mui/icons-material/Add";
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
import { useAccountsPage } from "~/components/pages/Accounts/context";
import { ROUTES } from "~/constants/routes";
import { EditProgramNameSchemaType, useEditProgramNameForm } from "~/forms/editProgramName";

export default function DrawerContent() {
  const {
    program,
    accounts,
    instructions,
    editProgramName,
    saveEditProgramName,
    cancelEditProgramName,
    isEditingProgramName,
    createAccountDialogOpen,
    goBackToProgramsList,
    openAccounts,
    handleOpenAccounts,
    openInstructions,
    handleOpenInstructions,
    createInstructionDialogOpen,
  } = useAccountsPage();

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useEditProgramNameForm({ name: program.name });

  const onEditCancel = () => {
    cancelEditProgramName();
    reset();
  };

  const onSubmit: SubmitHandler<EditProgramNameSchemaType> = async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await saveEditProgramName(values.name);
    reset({ name: values.name });
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
              <IconButton edge="end" onClick={onEditCancel} disabled={isSubmitting} sx={{ mr: 0 }}>
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
        <ListItemText primaryTypographyProps={{ style: { wordBreak: "break-all" } }}>
          {isEditingProgramName ? (
            <TextField
              disabled={isSubmitting}
              sx={{ width: 140, mt: "2.5px" }}
              inputProps={{ style: { paddingBottom: 3.5 } }}
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
      <ListItem
        secondaryAction={
          <IconButton onClick={createAccountDialogOpen}>
            <AddIcon />
          </IconButton>
        }
      >
        <IconButton onClick={handleOpenAccounts}>{openAccounts ? <ExpandLess /> : <ExpandMore />}</IconButton>
        <ListItemText>
          <b>Accounts</b>
        </ListItemText>
      </ListItem>
      <Collapse in={openAccounts} timeout="auto" unmountOnExit>
        {accounts.map((account) => {
          return (
            <Link
              key={`account-${account.id}`}
              href={ROUTES.ACCOUNT(program.id, account.id)}
              style={{ textDecoration: "none", color: "unset" }}
            >
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 7 }}>
                  <ListItemText primary={account.name} />
                </ListItemButton>
              </List>
            </Link>
          );
        })}
      </Collapse>
      <ListItem
        secondaryAction={
          <IconButton onClick={createInstructionDialogOpen}>
            <AddIcon />
          </IconButton>
        }
        disablePadding
      >
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
                  <ListItemText primary={instruction.name} />
                </ListItemButton>
              </List>
            </Link>
          );
        })}
      </Collapse>
    </List>
  );
}
