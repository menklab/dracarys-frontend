import { useEffect, useState } from "react";
import getMsg from "~/adapters/auth/getMsg";
import validateMsg from "~/adapters/auth/validateMsg";

export default function useAuth() {
  let [provider, setProvider] = useState<any>();
  let [pubKey, setPubKey] = useState<any>();

  const connectToPhantom = async () => {
    const resp = await provider.connect();
    const address = resp.publicKey.toString();
    const pubKey = resp.publicKey;
    localStorage.setItem("pubKey", address);
    console.log("connectToPhantom", pubKey);
    setPubKey(pubKey);
    const { message } = await getMsg("http://localhost:8080");
    console.log("msgBody", message);
    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = await provider.signMessage(encodedMessage, "utf8");
    const signature = signedMessage.signature;
    const signatureString = btoa(String.fromCharCode.apply(null, signature));
    // const pubKeyString = pubKey.toBase58();
    // const respNacl = nacl.sign.detached.verify(encodedMessage, signature, pubKey);
    // console.log("response", response);

    const response = await validateMsg("http://localhost:8080", {
      pubKey: pubKey.toBase58(),
      message: message,
      signature: signatureString,
    });
    console.log("response", response, {
      pubKey: pubKey.toBase58(),
      message: message,
      signature: signatureString,
    });
  };

  const disconnectFromPhantom = async () => {
    await provider.disconnect();
    localStorage.removeItem("pubKey");
    console.log("disconnectFromPhantom", localStorage.getItem("pubKey"));
    setPubKey("");
  };

  useEffect(() => {
    if (!provider) return;
    const isOnline = localStorage.getItem("pubKey");
    if (!isOnline) return;
    connectToPhantom();
  }, [provider]);

  useEffect(() => {
    if (window.solana.isPhantom) {
      setProvider(window.phantom.solana);
    } else {
      throw new Error("Phantom wallet is required!!");
    }
  }, []);

  return { data: { pubKey }, actions: { provider, connectToPhantom, disconnectFromPhantom } };
}
