import { useRouter } from "next/router";
import { createContext, ReactNode, useContext, useState } from "react";
import deleteProgram from "~/adapters/program/deleteProgram";
import updateProgram from "~/adapters/program/updateProgram";
import { ROUTES } from "~/constants/routes";
import useErrorHandler from "~/hooks/useErrorHandler";
import useTriggerSSR from "~/hooks/useTriggerSSR";
import { Account } from "~/interfaces/account";
import { Instruction } from "~/interfaces/instruction";
import { Program } from "~/interfaces/program";

interface InstructionsPageContextDefaultValue {
  program: Program;
  instructions: Instruction[];
  accounts: Account[];
  handleOpenAccounts: () => void;
  openAccounts: boolean;
  handleOpenInstructions: () => void;
  openInstructions: boolean;
  isDeleteProgramDialogOpen: boolean;
  openDeleteProgramDialog: () => void;
  closeDeleteProgramDialog: () => void;
  isProgramDeleting: boolean;
  deleteProgram: () => Promise<void>;
  isEditingProgramName: boolean;
  editProgramName: () => void;
  saveEditProgramName: (name: string) => Promise<void>;
  cancelEditProgramName: () => void;
  goBackToProgramsList: () => Promise<boolean>;
}

const InstructionsPageContext = createContext<InstructionsPageContextDefaultValue | undefined>(undefined);

interface InstructionsPageProviderProps {
  program: Program;
  instructions: Instruction[];
  accounts: Account[];
  children: ReactNode;
}

export const InstructionsPageProvider = ({
  program,
  instructions,
  accounts,
  children,
}: InstructionsPageProviderProps) => {
  const { triggerSSR } = useTriggerSSR();
  const router = useRouter();
  const { displayCaughtError } = useErrorHandler();
  const [isDeleteProgramDialogOpen, setIsDeleteProgramDialogOpen] = useState<boolean>(false);
  const [isProgramDeleting, setIsProgramDeleting] = useState<boolean>(false);
  const [isEditingProgramName, setIsEditingProgramName] = useState<boolean>(false);
  const [openAccounts, setOpenAccounts] = useState<boolean>(false);
  const [openInstructions, setOpenInstructions] = useState<boolean>(false);

  const handleOpenAccounts = () => {
    setOpenAccounts(!openAccounts);
  };

  const handleOpenInstructions = () => {
    setOpenInstructions(!openInstructions);
  };

  const _deleteProgram = async () => {
    setIsProgramDeleting(true);
    try {
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
    <InstructionsPageContext.Provider
      value={{
        program,
        isDeleteProgramDialogOpen,
        openAccounts,
        openInstructions,
        instructions,
        accounts,
        openDeleteProgramDialog: () => setIsDeleteProgramDialogOpen(true),
        closeDeleteProgramDialog: () => setIsDeleteProgramDialogOpen(false),
        isProgramDeleting,
        deleteProgram: _deleteProgram,
        isEditingProgramName,
        editProgramName: () => setIsEditingProgramName(true),
        saveEditProgramName: changeProgramName,
        cancelEditProgramName: () => setIsEditingProgramName(false),
        goBackToProgramsList: () => router.push(ROUTES.PROGRAMS()),
        handleOpenAccounts,
        handleOpenInstructions,
      }}
    >
      {children}
    </InstructionsPageContext.Provider>
  );
};

export const useInstructionsPage = () => {
  const instructionsPage = useContext(InstructionsPageContext);
  if (instructionsPage === undefined) throw new Error("Cannot use instructionsPage context");
  return instructionsPage;
};