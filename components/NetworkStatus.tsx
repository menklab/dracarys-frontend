import { SnackbarKey, useSnackbar } from "notistack";
import { useEffect, useState } from "react";

export default function NetworkStatus() {
  const [snackbarId, setSnackbarId] = useState<SnackbarKey | undefined>();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    window.addEventListener("offline", () => {
      if (snackbarId) return;
      const id = enqueueSnackbar("You are offline!", { variant: "warning", persist: true });
      setSnackbarId(id);
    });

    window.addEventListener("online", () => {
      closeSnackbar(snackbarId);
      setSnackbarId(undefined);
    });
  }, []);

  return <></>;
}
