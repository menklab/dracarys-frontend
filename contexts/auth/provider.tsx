import cookie from "js-cookie";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import getMsg from "~/adapters/auth/getMsg";
import logout from "~/adapters/auth/logout";
import validateMsg from "~/adapters/auth/validateMsg";
import { ROUTES } from "~/constants/routes";
import { AuthContext } from "~/contexts/auth/context";
import { AuthProviderProps, Provider } from "~/contexts/auth/types";
import useErrorHandler from "~/hooks/useErrorHandler";
import { PubKey } from "~/types/phantom";

declare global {
  interface Window {
    solana: any;
    phantom: any;
  }
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [provider, setProvider] = useState<Provider | undefined>();
  const [pubKey, setPubKey] = useState<PubKey>();
  const [loginProgress, setLoginProgress] = useState<boolean>(false);
  const { displayCaughtError } = useErrorHandler();
  const { enqueueSnackbar } = useSnackbar();

  const connectToBE = async () => {
    if (!pubKey) return;
    const { message } = await getMsg();
    const encodedMessage = new TextEncoder().encode(message);
    try {
      const signedMessage = await provider?.signMessage(encodedMessage, "utf8");
      const signature = signedMessage?.signature;
      const signatureString = btoa(String.fromCharCode.apply(null, signature as number[]));
      const pubKeyString = pubKey.toBase58();

      const response = await validateMsg({
        pubKey: pubKeyString,
        message: message,
        signature: signatureString,
      });

      if (response) {
        return await router.push(ROUTES.HOME());
      }
    } catch (e) {
      await logoutFN();
      cookie.remove("connect.sid");
      displayCaughtError(e);
    }
  };

  const connectToPhantom = async () => {
    setLoginProgress(true);
    try {
      const resp = await provider?.connect();
      const pubKey = resp?.publicKey;
      setPubKey(pubKey);
    } catch (e) {
      displayCaughtError(e);
    }
    setLoginProgress(false);
  };

  const disconnectFromPhantom = async () => {
    await provider?.disconnect();
    cookie.remove("connect.sid");
    return await router.push(ROUTES.LOGIN());
  };

  const logoutFN = async () => {
    try {
      await logout();
    } catch (e) {
      displayCaughtError(e);
    }
  };

  useEffect(() => {
    if (cookie.get("connect.sid")) return; // check if already has session id
    if (!provider) return; // check if is available
    if (!provider?.isConnected) return;
    connectToBE();
  }, [pubKey]);

  useEffect(() => {
    if (!provider) return;
    if (pubKey) return;
    if (provider.isConnected) return;
    if (!cookie.get("connect.sid")) return;
    connectToPhantom();
  }, [provider]);

  const checkProvider = () => {
    if (window?.solana?.isPhantom && provider === undefined) {
      setProvider(window.phantom.solana);
    }
  };

  useEffect(() => {
    checkProvider();
    setTimeout(checkProvider, 1000);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        actions: { provider, connectToPhantom, disconnectFromPhantom },
        data: { pubKey, loginProgress },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
