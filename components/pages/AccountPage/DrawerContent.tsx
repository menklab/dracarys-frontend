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
import { Account } from "~/interfaces/account";

interface DrawerContentProps {
  accounts: Account[];
}

export default function DrawerContent({ accounts }: DrawerContentProps) {
  const {
    program,
    editProgramName,
    saveEditProgramName,
    cancelEditProgramName,
    isEditingProgramName,
    createAccountDialogOpen,
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
      <ListItem>
        <IconButton onClick={handleOpenAccounts}>{openAccounts ? <ExpandLess /> : <ExpandMore />}</IconButton>
        <ListItemText>Accounts</ListItemText>
      </ListItem>
      <Collapse in={openAccounts} timeout="auto" unmountOnExit>
        {accounts.map((account) => {
          return (
            <Link
              key={`account-${account.id}`}
              href={ROUTES.ACCOUNT(program.id, account.id)}
              style={{ textDecoration: "none", color: "unset" }}
            >
              <List component="div" disablePadding key={account.id}>
                <ListItemButton sx={{ pl: 7 }}>
                  <ListItemText primary={account.name} />
                </ListItemButton>
              </List>
            </Link>
          );
        })}
      </Collapse>
    </List>
  );
}
