import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, List, ListItem, ListItemIcon, ListItemText, TextField } from "@mui/material";
import { Fragment } from "react";
import { SubmitHandler } from "react-hook-form";
import { useAccountsPage } from "~/components/pages/Accounts/context";
import { EditProgramNameSchemaType, useEditProgramNameForm } from "~/forms/editProgramName";

export default function DrawerContent() {
  const {
    program,
    editProgramName,
    saveEditProgramName,
    cancelEditProgramName,
    isEditingProgramName,
    goBackToProgramsList,
  } = useAccountsPage();

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
    </List>
  );
}
