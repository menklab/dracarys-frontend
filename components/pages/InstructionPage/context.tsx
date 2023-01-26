import { useRouter } from "next/router";
import { createContext, ReactNode, useContext, useState } from "react";
import updateAccountElement from "~/adapters/account/updateAccountElement";
import deleteInstruction from "~/adapters/instruction/deleteInstruction";
import updateInstruction from "~/adapters/instruction/updateInstruction";
import updateProgram from "~/adapters/program/updateProgram";
import { ROUTES } from "~/constants/routes";
import { ElementType } from "~/enums/elementType";
import useErrorHandler from "~/hooks/useErrorHandler";
import useTriggerSSR from "~/hooks/useTriggerSSR";
import { Account } from "~/interfaces/account";
import { Instruction } from "~/interfaces/instruction";
import { Program } from "~/interfaces/program";

interface InstructionPageContextDefaultValue {
  program: Program;
  accounts: Account[];
  instructions: Instruction[];
  instruction: Instruction;
  handleOpenInstructions: () => void;
  openInstructions: boolean;
  editInstructionDialogIsOpened: boolean;
  isDeleteInstructionDialogOpen: boolean;
  isInstructionDeleting: boolean;
  changeProgramName: (name: string) => Promise<void>;
  saveEditInstructionName: (name: string) => Promise<void>;
  saveEditProgramName: (name: string) => Promise<void>;
  editInstruction: (name: string, description: string) => Promise<void>;
  saveCreateAccountElement: (name: string, type: ElementType) => Promise<void>;
  saveEditAccountElement: (id: number, name: string, type: ElementType) => Promise<void>;
  // removeAccountElement: (id: number) => Promise<void>;
  removeInstruction: () => Promise<void>;
  cancelEditProgramName: () => void;
  createInstructionDialogOpen: () => void;
  createInstructionDialogClose: () => void;
  editInstructionDialogOpen: () => void;
  editInstructionDialogClose: () => void;
  createAccountDialogOpen: () => void;
  openDeleteInstructionDialog: () => void;
  closeDeleteInstructionDialog: () => void;
  handleOpenAccounts: () => void;
  editProgramName: () => void;
  setIsEditingAccountName: (state: boolean) => void;
  isEditingAccountName: boolean;
  createAccountDialogIsOpened: boolean;
  openAccounts: boolean;
  isEditingProgramName: boolean;
  goBackToProgramsList: () => Promise<boolean>;
}

const InstructionPageContext = createContext<InstructionPageContextDefaultValue | undefined>(undefined);

interface InstructionPageProviderProps {
  program: Program;
  instruction: Instruction;
  instructions: Instruction[];
  accounts: Account[];
  children: ReactNode;
}

export const InstructionPageProvider = ({
  program,
  instruction,
  instructions,
  accounts,
  children,
}: InstructionPageProviderProps) => {
  const router = useRouter();
  const { displayCaughtError } = useErrorHandler();
  const { triggerSSR } = useTriggerSSR();
  const [openAccounts, setOpenAccounts] = useState<boolean>(false);
  const [isDeleteInstructionDialogOpen, setIsDeleteInstructionDialogOpen] = useState<boolean>(false);
  const [isInstructionDeleting, setIsInstructionDeleting] = useState<boolean>(false);
  const [createAccountDialogIsOpened, setCreateAccountDialogIsOpened] = useState<boolean>(false);
  const [createInstructionDialogIsOpened, setCreateInstructionDialogIsOpened] = useState<boolean>(false);
  const [editInstructionDialogIsOpened, setEditInstructionDialogIsOpened] = useState<boolean>(false);
  const [isEditingAccountName, setIsEditingAccountName] = useState<boolean>(false);
  const [isEditingProgramName, setIsEditingProgramName] = useState<boolean>(false);
  const [openInstructions, setOpenInstructions] = useState<boolean>(false);

  const handleOpenAccounts = () => {
    setOpenAccounts(!openAccounts);
  };

  const saveEditInstructionName = async (name: string) => {
    // try {
    //   await updateAccount(account.id, { name });
    //   await triggerSSR();
    //   setIsEditingAccountName(false);
    // } catch (e) {
    //   displayCaughtError(e);
    // }
  };

  const handleOpenInstructions = () => {
    setOpenInstructions(!openInstructions);
  };

  const removeInstruction = async () => {
    setIsInstructionDeleting(true);
    try {
      await deleteInstruction(instruction.id);
      await router.push(ROUTES.INSTRUCTIONS(program.id));
    } catch (e) {
      displayCaughtError(e);
    }
    setIsInstructionDeleting(false);
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
    // try {
    //   await createAccountElement({ accountId: account.id, name, type });
    //   await triggerSSR();
    // } catch (e) {
    //   displayCaughtError(e);
    // }
  };

  const editInstruction = async (name: string, description: string) => {
    try {
      await updateInstruction(instruction.id, { name, description });
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
    <InstructionPageContext.Provider
      value={{
        program,
        instructions,
        instruction,
        accounts,
        openInstructions,
        isEditingAccountName,
        handleOpenAccounts,
        setIsEditingAccountName,
        openAccounts,
        isEditingProgramName,
        isDeleteInstructionDialogOpen,
        isInstructionDeleting,
        changeProgramName,
        createAccountDialogIsOpened,
        editProgramName: () => setIsEditingProgramName(true),
        saveEditProgramName: changeProgramName,
        cancelEditProgramName: () => setIsEditingProgramName(false),
        createAccountDialogOpen: () => setCreateAccountDialogIsOpened(true),
        saveEditInstructionName,
        saveCreateAccountElement,
        saveEditAccountElement,
        editInstruction,
        handleOpenInstructions,
        editInstructionDialogIsOpened,
        openDeleteInstructionDialog: () => setIsDeleteInstructionDialogOpen(true),
        closeDeleteInstructionDialog: () => setIsDeleteInstructionDialogOpen(false),
        createInstructionDialogOpen: () => setCreateInstructionDialogIsOpened(true),
        createInstructionDialogClose: () => setCreateInstructionDialogIsOpened(false),
        editInstructionDialogOpen: () => setEditInstructionDialogIsOpened(true),
        editInstructionDialogClose: () => setEditInstructionDialogIsOpened(false),
        removeInstruction,
        goBackToProgramsList: () => router.push(ROUTES.PROGRAMS()),
      }}
    >
      {children}
    </InstructionPageContext.Provider>
  );
};

export const useInstructionPage = () => {
  const instructionPage = useContext(InstructionPageContext);
  if (instructionPage === undefined) throw new Error("Cannot use instructionPage context");
  return instructionPage;
};
