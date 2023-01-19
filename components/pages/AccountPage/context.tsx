import { useRouter } from "next/router";
import { createContext, ReactNode, useContext, useState } from "react";
import createAccountElement from "~/adapters/account/createAccountElement";
import deleteAccountElement from "~/adapters/account/deleteAccountElement";
import updateAccount from "~/adapters/account/updateAccount";
import updateAccountElement from "~/adapters/account/updateAccountElement";
import updateProgram from "~/adapters/program/updateProgram";
import { ROUTES } from "~/constants/routes";
import useErrorHandler from "~/hooks/useErrorHandler";
import useTriggerSSR from "~/hooks/useTriggerSSR";
import { Account } from "~/interfaces/account";
import { ElementType } from "~/interfaces/accountElement";
import { Program } from "~/interfaces/program";

interface AccountPageContextDefaultValue {
  program: Program;
  changeProgramName: (name: string) => Promise<void>;
  saveEditAccountName: (name: string) => Promise<void>;
  saveEditProgramName: (name: string) => Promise<void>;
  saveCreateAccountElement: (name: string, type: ElementType) => Promise<void>;
  saveEditAccountElement: (id: number, name: string, type: ElementType) => Promise<void>;
  removeAccountElement: (id: number) => Promise<void>;
  cancelEditProgramName: () => void;
  createAccountDialogOpen: () => void;
  handleOpenAccounts: () => void;
  editProgramName: () => void;
  setIsEditingAccountName: (state: boolean) => void;
  isEditingAccountName: boolean;
  createAccountDialogIsOpened: boolean;
  openAccounts: boolean;
  isEditingProgramName: boolean;
  goBackToProgramsList: () => Promise<boolean>;
}

const AccountPageContext = createContext<AccountPageContextDefaultValue | undefined>(undefined);

interface AccountPageProviderProps {
  program: Program;
  account: Account;
  children: ReactNode;
}

export const AccountPageProvider = ({ program, account, children }: AccountPageProviderProps) => {
  const router = useRouter();
  const { displayCaughtError } = useErrorHandler();
  const { triggerSSR } = useTriggerSSR();
  const [openAccounts, setOpenAccounts] = useState<boolean>(false);
  const [createAccountDialogIsOpened, setCreateAccountDialogIsOpened] = useState<boolean>(false);
  const [isEditingAccountName, setIsEditingAccountName] = useState<boolean>(false);
  const [isEditingProgramName, setIsEditingProgramName] = useState<boolean>(false);

  const handleOpenAccounts = () => {
    setOpenAccounts(!openAccounts);
  };

  const saveEditAccountName = async (name: string) => {
    try {
      await updateAccount(account.id, { name });
      await triggerSSR();
      setIsEditingAccountName(false);
    } catch (e) {
      displayCaughtError(e);
    }
  };

  const removeAccountElement = async (id: number) => {
    try {
      await deleteAccountElement(id);
      await triggerSSR();
    } catch (e) {
      displayCaughtError(e);
    }
  };

  const saveEditAccountElement = async (id: number, name: string, type: ElementType) => {
    try {
      await updateAccountElement(id, { name, type });
      await triggerSSR();
    } catch (e) {
      displayCaughtError(e);
    }
  };

  const saveCreateAccountElement = async (name: string, type: ElementType) => {
    try {
      await createAccountElement({ accountId: account.id, name, type });
      await triggerSSR();
    } catch (e) {
      displayCaughtError(e);
    }
  };

  const changeProgramName = async (name: string) => {
    try {
      await updateProgram(program.id, { name });
      await triggerSSR();
      setIsEditingProgramName(false);
    } catch (e) {
      displayCaughtError(e);
    }
  };

  return (
    <AccountPageContext.Provider
      value={{
        program,
        isEditingAccountName,
        handleOpenAccounts,
        setIsEditingAccountName,
        openAccounts,
        isEditingProgramName,
        changeProgramName,
        createAccountDialogIsOpened,
        editProgramName: () => setIsEditingProgramName(true),
        saveEditProgramName: changeProgramName,
        cancelEditProgramName: () => setIsEditingProgramName(false),
        createAccountDialogOpen: () => setCreateAccountDialogIsOpened(true),
        saveEditAccountName,
        saveCreateAccountElement,
        saveEditAccountElement,
        removeAccountElement,
        goBackToProgramsList: () => router.push(ROUTES.PROGRAMS()),
      }}
    >
      {children}
    </AccountPageContext.Provider>
  );
};

export const useAccountPage = () => {
  const accountPage = useContext(AccountPageContext);
  if (accountPage === undefined) throw new Error("Cannot use accountPage context");
  return accountPage;
};
