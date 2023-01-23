import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Button, IconButton, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Link from "next/link";
import { Fragment } from "react";
import { SubmitHandler } from "react-hook-form";
import { useAccountPage } from "~/components/pages/AccountPage/context";
import { ROUTES } from "~/constants/routes";
import { EditAccountNameSchemaType, useEditAccountNameForm } from "~/forms/editAccountName";

export default function AppBarContent() {
  const {
    saveEditAccountName,
    setIsEditingAccountName,
    isEditingAccountName,
    account,
    program,
    openDeleteAccountDialog,
  } = useAccountPage();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useEditAccountNameForm({ name: account.name });

  const onSubmit: SubmitHandler<EditAccountNameSchemaType> = async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await saveEditAccountName(values.name);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Link
          key={`program-${program.id}`}
          href={ROUTES.ACCOUNTS(program.id)}
          style={{ textDecoration: "none", color: "unset" }}
        >
          <IconButton sx={{ alignSelf: "self-end" }}>
            <ChevronLeftIcon />
          </IconButton>
        </Link>
        {isEditingAccountName ? (
          <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              size="small"
              variant="standard"
              error={!!errors["name"]}
              helperText={errors["name"] ? errors["name"].message : ""}
              {...register("name")}
            />
            <Fragment key="isEditingProgramName">
              <IconButton type="submit">
                <CheckIcon />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => {
                  setIsEditingAccountName(false);
                }}
              >
                <CancelIcon />
              </IconButton>
            </Fragment>
          </Box>
        ) : (
          <>
            <p style={{ margin: "0 10px", fontSize: "24px" }}>{account.name}</p>
            <IconButton
              sx={{ alignSelf: "self-end" }}
              onClick={() => {
                setIsEditingAccountName(true);
              }}
            >
              <EditIcon />
            </IconButton>
          </>
        )}
      </div>
      <Button sx={{ ml: "auto" }} endIcon={<DeleteIcon />} onClick={openDeleteAccountDialog}>
        Delete account
      </Button>
    </>
  );
}
