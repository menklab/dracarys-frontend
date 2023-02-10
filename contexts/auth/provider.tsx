import cookie from "js-cookie";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import getMsg from "~/adapters/auth/getMsg";
import validateMsg from "~/adapters/auth/validateMsg";
import { ROUTES } from "~/constants/routes";
import useErrorHandler from "~/hooks/useErrorHandler";
import { PubKey } from "~/types/phantom";
import { AuthContext } from "./context";
import { AuthProviderProps, Provider } from "./types";

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
    console.log("connectToBE", pubKey);
    if (!pubKey) return;
    const { message } = await getMsg();
    const encodedMessage = new TextEncoder().encode(message);
    try {
      console.log("encodedMessage", encodedMessage);
      const signedMessage = await provider?.signMessage(encodedMessage, "utf8");
      console.log("signedMessage", signedMessage);
      const signature = signedMessage?.signature;
      const signatureString = btoa(String.fromCharCode.apply(null, signature as number[]));
      const pubKeyString = pubKey.toBase58();
      console.log("pubKeyString", pubKeyString);

      const response = await validateMsg({
        pubKey: pubKeyString,
        message: message,
        signature: signatureString,
      });

      console.log("connectToBE", response);

      if (response) {
        return await router.push(ROUTES.HOME());
      }
    } catch (e) {
      console.log("cookie.remove");
      cookie.remove("connect.sid");
      displayCaughtError(e);
    }
  };

  const connectToPhantom = async () => {
    setLoginProgress(true);
    try {
      console.log("connectToPhantom", provider);
      const resp = await provider?.connect();
      console.log(resp);
      const pubKey = resp?.publicKey;
      setPubKey(pubKey);
    } catch (e) {
      displayCaughtError(e);
    }
    setLoginProgress(false);
  };

  const disconnectFromPhantom = async () => {
    console.log("disconnectFromPhantom", provider);
    await provider?.disconnect();
    cookie.remove("connect.sid");
    return await router.push(ROUTES.LOGIN());
  };

  useEffect(() => {
    console.log("useEffect1", provider);
    if (cookie.get("connect.sid")) return; // check if already has session id
    if (!provider) return; // check if is available
    if (!provider?.isConnected) return;
    console.log("useEffect1.0", provider);
    connectToBE();
  }, [pubKey]);

  useEffect(() => {
    console.log("useEffect2", provider);
    if (!provider) return;
    if (pubKey) return;
    if (provider.isConnected) return;
    if (!cookie.get("connect.sid")) return;
    console.log("useEffect2.0", provider, pubKey);
    connectToPhantom();
  }, [provider]);

  useEffect(() => {
    if (window?.solana?.isPhantom) {
      setProvider(window.phantom.solana);
    } else {
      enqueueSnackbar("Phantom wallet is required!\nPlease install phantom wallet browser extension", {
        style: { whiteSpace: "pre-line" },
        variant: "warning",
        persist: true,
      });
    }
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
