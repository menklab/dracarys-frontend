import { useRouter } from "next/router";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import createAccount from "~/adapters/account/createAccount";
import generateInstructionCode from "~/adapters/code/generateInstructionCode";
import createInstruction from "~/adapters/instruction/createInstruction";
import deleteProgram from "~/adapters/program/deleteProgram";
import updateProgram from "~/adapters/program/updateProgram";
import { LAYOUT_DEFAULT_VIEW_VARIANT_IN_INSTRUCTIONS } from "~/constants/layout";
import { ROUTES } from "~/constants/routes";
import useErrorHandler from "~/hooks/useErrorHandler";
import useTriggerSSR from "~/hooks/useTriggerSSR";
import { Account } from "~/interfaces/account";
import { Instruction } from "~/interfaces/instruction";
import { Program } from "~/interfaces/program";
import { LayoutViewVariant } from "~/types/layout";

interface InstructionsPageContextDefaultValue {
  viewVariant: LayoutViewVariant;
  changeViewVariant: (variant?: LayoutViewVariant) => Promise<void>;
  forceCodeUpdate: () => Promise<void>;
  generatedCodeString: string;
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
  createNewInstruction: (name: string, description?: string) => Promise<void>;
  createNewAccount: (name: string) => Promise<void>;
  createAccountDialogIsOpened: boolean;
  createAccountDialogOpen: () => void;
  createAccountDialogClose: () => void;
  createInstructionDialogOpen: () => void;
  createInstructionDialogClose: () => void;
  createInstructionDialogIsOpened: boolean;
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
  const [viewVariant, setViewVariant] = useState<LayoutViewVariant>(LAYOUT_DEFAULT_VIEW_VARIANT_IN_INSTRUCTIONS);
  const [generatedCodeString, setGeneratedCodeString] = useState<string>("");
  const [isDeleteProgramDialogOpen, setIsDeleteProgramDialogOpen] = useState<boolean>(false);
  const [isProgramDeleting, setIsProgramDeleting] = useState<boolean>(false);
  const [isEditingProgramName, setIsEditingProgramName] = useState<boolean>(false);
  const [openAccounts, setOpenAccounts] = useState<boolean>(false);
  const [openInstructions, setOpenInstructions] = useState<boolean>(false);
  const [createAccountDialogIsOpened, setCreateAccountDialogIsOpened] = useState<boolean>(false);
  const [createInstructionDialogIsOpened, setCreateInstructionDialogIsOpened] = useState<boolean>(false);

  useEffect(() => {
    const openInstructionsJson = window.localStorage.getItem("openInstructions");
    const openAccountsJson = window.localStorage.getItem("openAccounts");
    if (openInstructionsJson !== null) setOpenInstructions(JSON.parse(openInstructionsJson));
    if (openAccountsJson !== null) setOpenAccounts(JSON.parse(openAccountsJson));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("openInstructions", JSON.stringify(openInstructions));
  }, [openInstructions]);

  useEffect(() => {
    window.localStorage.setItem("openAccounts", JSON.stringify(openAccounts));
  }, [openAccounts]);

  const updateGeneratedInstructionCode = async () => {
    const code = await generateInstructionCode(Number(program.id));
    if (!code) return;
    setGeneratedCodeString(code.join("\n"));
  };

  const changeViewVariant = async (variant?: LayoutViewVariant) => {
    if (!variant) return;
    if (variant === "code") await updateGeneratedInstructionCode();
    setViewVariant(variant);
  };

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

  const createNewInstruction = async (name: string, description?: string | null) => {
    try {
      description = description?.trim() === "" ? null : description;
      const newInstruction = await createInstruction({ name, description, programId: program.id });
      await router.push(ROUTES.INSTRUCTION(program.id, newInstruction.id));
    } catch (e) {
      displayCaughtError(e);
    }
  };

  const createNewAccount = async (name: string) => {
    try {
      const newAccount = await createAccount({ name, programId: program.id });
      await router.push(ROUTES.ACCOUNT(program.id, newAccount.id));
    } catch (e) {
      displayCaughtError(e);
    }
  };

  return (
    <InstructionsPageContext.Provider
      value={{
        viewVariant,
        changeViewVariant,
        forceCodeUpdate: updateGeneratedInstructionCode,
        generatedCodeString,
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
        createNewInstruction,
        createNewAccount,
        createAccountDialogIsOpened,
        createInstructionDialogIsOpened,
        createAccountDialogOpen: () => setCreateAccountDialogIsOpened(true),
        createAccountDialogClose: () => setCreateAccountDialogIsOpened(false),
        createInstructionDialogOpen: () => setCreateInstructionDialogIsOpened(true),
        createInstructionDialogClose: () => setCreateInstructionDialogIsOpened(false),
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
