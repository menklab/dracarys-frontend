import cookie from "js-cookie";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import getMsg from "~/adapters/auth/getMsg";
import validateMsg from "~/adapters/auth/validateMsg";
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
  const [sid, setSid] = useState<string | undefined>();
  const [provider, setProvider] = useState<Provider | undefined>();
  const [pubKey, setPubKey] = useState<PubKey>();
  const { enqueueSnackbar } = useSnackbar();

  const connectToBE = async () => {
    if (!pubKey) return;
    const { message } = await getMsg("http://localhost:8080");
    const encodedMessage = new TextEncoder().encode(message);
    try {
      const signedMessage = await provider?.signMessage(encodedMessage, "utf8");
      const signature = signedMessage?.signature;
      const signatureString = btoa(String.fromCharCode.apply(null, signature as number[]));
      const pubKeyString = pubKey.toBase58();

      const response = await validateMsg("http://localhost:8080", {
        pubKey: pubKeyString,
        message: message,
        signature: signatureString,
      });

      if (response) {
        router.push("/");
      }
    } catch (e) {
      cookie.remove("connect.sid");
      enqueueSnackbar((e as Error).message, { variant: "error" });
    }
  };

  const connectToPhantom = async () => {
    try {
      const resp = await provider?.connect();
      const pubKey = resp?.publicKey;
      setPubKey(pubKey);
    } catch (e) {
      enqueueSnackbar((e as Error).message, { variant: "error" });
    }
  };

  const disconnectFromPhantom = async () => {
    await provider?.disconnect();
    cookie.remove("connect.sid");
    setSid(undefined);
    router.push("/login");
  };

  useEffect(() => {
    if (sid) return; // check if already has session id
    if (!provider) return; // check if is available
    if (!provider?.isConnected) return;
    connectToBE();
  }, [pubKey]);

  useEffect(() => {
    if (!provider) return;
    if (pubKey) return;
    if (provider.isConnected) return;
    if (!sid) return;
    connectToPhantom();
  }, [provider]);

  useEffect(() => {
    setSid(cookie.get("connect.sid"));
    if (window.solana.isPhantom) {
      setProvider(window.phantom.solana);
    } else {
      enqueueSnackbar("Phantom wallet is required!!", { variant: "error" });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        actions: { provider, connectToPhantom, disconnectFromPhantom },
        data: { pubKey },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
