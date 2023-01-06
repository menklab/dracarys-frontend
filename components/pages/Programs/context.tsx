import { createContext, ReactNode, useContext, useState } from "react";
import createProgram from "~/adapters/program/createProgram";
import useErrorHandler from "~/hooks/useErrorHandler";
import useTriggerSSR from "~/hooks/useTriggerSSR";
import { Program } from "~/interfaces/program";

interface ProgramsPageContextDefaultValue {
  programs: Program[];
  createProgramDialogIsOpened: boolean;
  createProgramDialogOpen: () => void;
  createProgramDialogClose: () => void;
  createNewProgram: (name: string) => Promise<void>;
}

const ProgramsPageContext = createContext<ProgramsPageContextDefaultValue | undefined>(undefined);

interface ProgramsPageProviderProps {
  programs: Program[];
  children: ReactNode;
}

export const ProgramsPageProvider = ({ programs, children }: ProgramsPageProviderProps) => {
  const [createProgramDialogIsOpened, setCreateProgramDialogIsOpened] = useState<boolean>(programs.length === 0);
  const { displayCaughtError } = useErrorHandler();
  const { triggerSSR } = useTriggerSSR();

  const createNewProgram = async (name: string) => {
    try {
      await createProgram({ name });
      await triggerSSR();
    } catch (e) {
      displayCaughtError(e);
    }
  };

  return (
    <ProgramsPageContext.Provider
      value={{
        programs,
        createProgramDialogIsOpened,
        createProgramDialogOpen: () => setCreateProgramDialogIsOpened(true),
        createProgramDialogClose: () => setCreateProgramDialogIsOpened(false),
        createNewProgram,
      }}
    >
      {children}
    </ProgramsPageContext.Provider>
  );
};

export const useProgramsPage = () => {
  const programsPage = useContext(ProgramsPageContext);
  if (programsPage === undefined) throw new Error("Cannot use programsPage context");
  return programsPage;
};
