import { useRouter } from "next/router";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import createInstructionElement, {
  CreateInstructionElementJsonResponse,
} from "~/adapters/instruction/createInstructionElement";
import deleteInstruction from "~/adapters/instruction/deleteInstruction";
import deleteInstructionElement from "~/adapters/instruction/deleteInstructionElement";
import updateInstruction from "~/adapters/instruction/updateInstruction";
import updateInstructionElement, {
  UpdateInstructionElementResponse,
} from "~/adapters/instruction/updateInstructionElement";
import updateProgram from "~/adapters/program/updateProgram";
import { ROUTES } from "~/constants/routes";
import { AccountType } from "~/enums/instructionElementTypes";
import useErrorHandler from "~/hooks/useErrorHandler";
import useTriggerSSR from "~/hooks/useTriggerSSR";
import { Account } from "~/interfaces/account";
import { GenericCustomSubType, GenericSubType, GenericType } from "~/interfaces/genericType";
import { Instruction } from "~/interfaces/instruction";
import { InstructionElement } from "~/interfaces/instructionElement";
import { Program } from "~/interfaces/program";

interface InstructionPageContextDefaultValue {
  program: Program;
  accounts: Account[];
  instructions: Instruction[];
  instruction: Instruction;
  instructionElements: InstructionElement[];
  handleOpenInstructions: () => void;
  openInstructions: boolean;
  editInstructionDialogIsOpened: boolean;
  isDeleteInstructionDialogOpen: boolean;
  isInstructionDeleting: boolean;
  changeProgramName: (name: string) => Promise<void>;
  saveEditInstructionElement: (
    elementId: number,
    name: string,
    order: number,
    description: string,
    mut: boolean,
    accountType: AccountType,
    genericType: GenericSubType | GenericCustomSubType
  ) => Promise<UpdateInstructionElementResponse | undefined>;
  saveEditProgramName: (name: string) => Promise<void>;
  editInstruction: (name: string, description: string) => Promise<void>;
  saveCreateInstructionElement: (
    name: string,
    order: number,
    description: string,
    mut: boolean,
    accountType: AccountType,
    genericType: GenericSubType | GenericCustomSubType
  ) => Promise<CreateInstructionElementJsonResponse | undefined>;
  removeInstruction: () => Promise<void>;
  removeInstructionElement: (id: number) => Promise<void>;
  cancelEditProgramName: () => void;
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
  genericTypes: GenericType;
}

const InstructionPageContext = createContext<InstructionPageContextDefaultValue | undefined>(undefined);

interface InstructionPageProviderProps {
  program: Program;
  instruction: Instruction;
  instructionElements: InstructionElement[];
  instructions: Instruction[];
  accounts: Account[];
  children: ReactNode;
  genericTypes: GenericType;
}

export const InstructionPageProvider = ({
  program,
  instruction,
  instructionElements,
  instructions,
  genericTypes,
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
  const [editInstructionDialogIsOpened, setEditInstructionDialogIsOpened] = useState<boolean>(false);
  const [isEditingAccountName, setIsEditingAccountName] = useState<boolean>(false);
  const [isEditingProgramName, setIsEditingProgramName] = useState<boolean>(false);
  const [openInstructions, setOpenInstructions] = useState<boolean>(false);

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

  const handleOpenAccounts = () => {
    setOpenAccounts(!openAccounts);
  };

  const saveEditInstructionElement = async (
    elementId: number,
    name: string,
    order: number,
    description: string | null,
    mut: boolean,
    accountType: AccountType,
    genericType: GenericSubType | GenericCustomSubType
  ) => {
    let response = undefined;
    try {
      description = description?.trim() === "" ? null : description;

      response = await updateInstructionElement(elementId, {
        instructionId: instruction.id,
        name,
        order,
        description,
        mut,
        accountType,
        genericType,
      });
    } catch (e) {
      displayCaughtError(e);
    }
    return response;
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

  const removeInstructionElement = async (id: number) => {
    try {
      await deleteInstructionElement(id);
      await triggerSSR();
    } catch (e) {
      displayCaughtError(e);
    }
  };

  const saveCreateInstructionElement = async (
    name: string,
    order: number,
    description: string | null,
    mut: boolean,
    accountType: AccountType,
    genericType: GenericSubType | GenericCustomSubType
  ) => {
    try {
      description = description?.trim() === "" ? null : description;

      const res = await createInstructionElement({
        instructionId: instruction.id,
        name,
        order,
        description,
        mut,
        accountType,
        genericType,
      });
      await triggerSSR();
      return res;
    } catch (e) {
      displayCaughtError(e);
    }
  };

  const editInstruction = async (name: string, description: string | null) => {
    try {
      description = description?.trim() === "" ? null : description;
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
        instructionElements: instructionElements.sort((a, b) => a.order - b.order),
        accounts,
        openInstructions,
        handleOpenInstructions,
        isEditingAccountName,
        setIsEditingAccountName,
        openAccounts,
        handleOpenAccounts,
        isEditingProgramName,
        isDeleteInstructionDialogOpen,
        isInstructionDeleting,
        changeProgramName,
        createAccountDialogIsOpened,
        editProgramName: () => setIsEditingProgramName(true),
        saveEditProgramName: changeProgramName,
        cancelEditProgramName: () => setIsEditingProgramName(false),
        createAccountDialogOpen: () => setCreateAccountDialogIsOpened(true),
        saveEditInstructionElement,
        saveCreateInstructionElement,
        editInstruction,
        genericTypes,
        editInstructionDialogIsOpened,
        openDeleteInstructionDialog: () => setIsDeleteInstructionDialogOpen(true),
        closeDeleteInstructionDialog: () => setIsDeleteInstructionDialogOpen(false),
        editInstructionDialogOpen: () => setEditInstructionDialogIsOpened(true),
        editInstructionDialogClose: () => setEditInstructionDialogIsOpened(false),
        removeInstruction,
        removeInstructionElement,
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
