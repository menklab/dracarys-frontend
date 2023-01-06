import { useSnackbar } from "notistack";
import { ApiException } from "~/interfaces/error";
import isApiException from "~/utils/isApiException";

interface UseCustomSnackbarHookReturn {
  displayCaughtError: (exception: unknown) => void;
}

export default function useErrorHandler(): UseCustomSnackbarHookReturn {
  const { enqueueSnackbar } = useSnackbar();

  return {
    displayCaughtError: (e) => {
      if (isApiException(e))
        for (const error of (e as ApiException).errors) enqueueSnackbar(error.message, { variant: "error" });
      else enqueueSnackbar((e as Error).message, { variant: "error" });
    },
  };
}
