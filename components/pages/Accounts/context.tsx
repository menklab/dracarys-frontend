import { useRouter } from "next/router";
import { createContext, ReactNode, useContext, useState } from "react";
import createAccount from "~/adapters/account/createAccount";
import deleteProgram from "~/adapters/program/deleteProgram";
import updateProgram from "~/adapters/program/updateProgram";
import { LAYOUT_DEFAULT_VIEW_VARIANT } from "~/constants/layout";
import { ROUTES } from "~/constants/routes";
import useErrorHandler from "~/hooks/useErrorHandler";
import useTriggerSSR from "~/hooks/useTriggerSSR";
import { Program } from "~/interfaces/program";
import { LayoutViewVariant } from "~/types/layout";

interface AccountsPageContextDefaultValue {
  program: Program;
  viewVariant: LayoutViewVariant;
  changeViewVariant: (variant?: LayoutViewVariant) => void;
  isDeleteProgramDialogOpen: boolean;
  openDeleteProgramDialog: () => void;
  closeDeleteProgramDialog: () => void;
  createAccountDialogOpen: () => void;
  createAccountDialogClose: () => void;
  isProgramDeleting: boolean;
  createAccountDialogIsOpened: boolean;
  deleteProgram: () => Promise<void>;
  changeProgramName: (name: string) => Promise<void>;
  isEditingProgramName: boolean;
  editProgramName: () => void;
  saveEditProgramName: (name: string) => Promise<void>;
  createNewAccount: (name: string) => Promise<void>;
  cancelEditProgramName: () => void;
  goBackToProgramsList: () => Promise<boolean>;
}

const AccountsPageContext = createContext<AccountsPageContextDefaultValue | undefined>(undefined);

interface AccountsPageProviderProps {
  program: Program;
  children: ReactNode;
}

export const AccountsPageProvider = ({ program, children }: AccountsPageProviderProps) => {
  const router = useRouter();
  const { displayCaughtError } = useErrorHandler();
  const { triggerSSR } = useTriggerSSR();
  const [viewVariant, setViewVariant] = useState<LayoutViewVariant>(LAYOUT_DEFAULT_VIEW_VARIANT);
  const [isDeleteProgramDialogOpen, setIsDeleteProgramDialogOpen] = useState<boolean>(false);
  const [isProgramDeleting, setIsProgramDeleting] = useState<boolean>(false);
  const [isEditingProgramName, setIsEditingProgramName] = useState<boolean>(false);
  const [createAccountDialogIsOpened, setCreateAccountDialogIsOpened] = useState<boolean>(false);

  const changeViewVariant = (variant?: LayoutViewVariant) => {
    if (variant) setViewVariant(variant);
  };

  const createNewAccount = async (name: string) => {
    try {
      await createAccount({ name, programId: program.id });
      await triggerSSR();
    } catch (e) {
      displayCaughtError(e);
    }
  };

  const _deleteProgram = async () => {
    setIsProgramDeleting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await deleteProgram(program.id);
      setIsDeleteProgramDialogOpen(false);
      await router.push(ROUTES.PROGRAMS());
    } catch (e) {
      displayCaughtError(e);
    }
    setIsProgramDeleting(false);
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
    <AccountsPageContext.Provider
      value={{
        program,
        viewVariant,
        changeViewVariant,
        isDeleteProgramDialogOpen,
        openDeleteProgramDialog: () => setIsDeleteProgramDialogOpen(true),
        closeDeleteProgramDialog: () => setIsDeleteProgramDialogOpen(false),
        isProgramDeleting,
        deleteProgram: _deleteProgram,
        changeProgramName,
        createAccountDialogIsOpened,
        createAccountDialogOpen: () => setCreateAccountDialogIsOpened(true),
        createAccountDialogClose: () => setCreateAccountDialogIsOpened(false),
        isEditingProgramName,
        editProgramName: () => setIsEditingProgramName(true),
        saveEditProgramName: changeProgramName,
        cancelEditProgramName: () => setIsEditingProgramName(false),
        goBackToProgramsList: () => router.push(ROUTES.PROGRAMS()),
        createNewAccount,
      }}
    >
      {children}
    </AccountsPageContext.Provider>
  );
};

export const useAccountsPage = () => {
  const accountsPage = useContext(AccountsPageContext);
  if (accountsPage === undefined) throw new Error("Cannot use accountsPage context");
  return accountsPage;
};
