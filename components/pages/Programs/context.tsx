import { useSnackbar } from "notistack";
import { createContext, ReactNode, useContext, useState } from "react";
import createProgram from "~/adapters/program/createProgram";
import useTriggerSSR from "~/hooks/useTriggerSSR";
import { ApiException } from "~/interfaces/error";
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
  const { enqueueSnackbar } = useSnackbar();
  const { triggerSSR } = useTriggerSSR();

  const createNewProgram = async (name: string) => {
    try {
      await createProgram({ name });
      await triggerSSR();
    } catch (e) {
      for (const error of (e as ApiException).errors) enqueueSnackbar(error.message, { variant: "error" });
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
