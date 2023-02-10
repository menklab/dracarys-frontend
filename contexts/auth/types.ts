import { ReactNode } from "react";
import { PubKey } from "~/types/phantom";

export interface Provider {
  isConnected: boolean;
  connect: () => {
    publicKey: PubKey;
  };
  disconnect: () => void;
  signMessage: (
    encodedMessage: Uint8Array,
    type: string
  ) => {
    publicKey: PubKey;
    signature: number[];
  };
}

export interface AuthContextActions {
  provider: Provider | undefined;
  connectToPhantom: () => void;
  disconnectFromPhantom: () => void;
}

export interface AuthContextData {
  pubKey: PubKey | undefined;
  loginProgress: boolean;
}

export interface AuthContextDefaultValue {
  actions: AuthContextActions;
  data: AuthContextData;
}

export interface AuthProviderProps {
  children: ReactNode;
}
