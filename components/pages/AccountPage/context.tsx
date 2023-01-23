import { useRouter } from "next/router";
import { createContext, ReactNode, useContext, useState } from "react";
import createAccountElement from "~/adapters/account/createAccountElement";
import deleteAccount from "~/adapters/account/deleteAccount";
import deleteAccountElement from "~/adapters/account/deleteAccountElement";
import updateAccount from "~/adapters/account/updateAccount";
import updateAccountElement from "~/adapters/account/updateAccountElement";
import updateProgram from "~/adapters/program/updateProgram";
import { ROUTES } from "~/constants/routes";
import { ElementType } from "~/enums/elementType";
import useErrorHandler from "~/hooks/useErrorHandler";
import useTriggerSSR from "~/hooks/useTriggerSSR";
import { Account } from "~/interfaces/account";
import { AccountElement } from "~/interfaces/accountElement";
import { Program } from "~/interfaces/program";

interface AccountPageContextDefaultValue {
  program: Program;
  accounts: Account[];
  account: Account;
  isDeleteAccountDialogOpen: boolean;
  isAccountDeleting: boolean;
  accountElements: AccountElement[];
  changeProgramName: (name: string) => Promise<void>;
  saveEditAccountName: (name: string) => Promise<void>;
  saveEditProgramName: (name: string) => Promise<void>;
  saveCreateAccountElement: (name: string, type: ElementType) => Promise<void>;
  saveEditAccountElement: (id: number, name: string, type: ElementType) => Promise<void>;
  removeAccountElement: (id: number) => Promise<void>;
  removeAccount: () => Promise<void>;
  cancelEditProgramName: () => void;
  createAccountDialogOpen: () => void;
  openDeleteAccountDialog: () => void;
  closeDeleteAccountDialog: () => void;
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
  accounts: Account[];
  accountElements: AccountElement[];
  children: ReactNode;
}

export const AccountPageProvider = ({
  program,
  account,
  accounts,
  accountElements,
  children,
}: AccountPageProviderProps) => {
  const router = useRouter();
  const { displayCaughtError } = useErrorHandler();
  const { triggerSSR } = useTriggerSSR();
  const [openAccounts, setOpenAccounts] = useState<boolean>(false);
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] = useState<boolean>(false);
  const [isAccountDeleting, setIsAccountDeleting] = useState<boolean>(false);
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

  const removeAccount = async () => {
    setIsAccountDeleting(true);
    try {
      await deleteAccount(account.id);
      await router.push(ROUTES.ACCOUNTS(program.id));
    } catch (e) {
      displayCaughtError(e);
    }
    setIsAccountDeleting(false);
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
        accounts,
        accountElements,
        account,
        isEditingAccountName,
        handleOpenAccounts,
        setIsEditingAccountName,
        openAccounts,
        isEditingProgramName,
        isDeleteAccountDialogOpen,
        isAccountDeleting,
        changeProgramName,
        createAccountDialogIsOpened,
        editProgramName: () => setIsEditingProgramName(true),
        saveEditProgramName: changeProgramName,
        cancelEditProgramName: () => setIsEditingProgramName(false),
        createAccountDialogOpen: () => setCreateAccountDialogIsOpened(true),
        saveEditAccountName,
        saveCreateAccountElement,
        saveEditAccountElement,
        openDeleteAccountDialog: () => setIsDeleteAccountDialogOpen(true),
        closeDeleteAccountDialog: () => setIsDeleteAccountDialogOpen(false),
        removeAccountElement,
        removeAccount,
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
