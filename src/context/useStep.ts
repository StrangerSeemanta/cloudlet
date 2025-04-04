import { createContext, useContext } from "react";
export interface StepContextType {
  currentStep: number;
  currentStepURL: string;
  updateCurrentStepURL: (stepName: string) => void;
  nextStep: (no: number) => void;
  prevStep: () => void;
  completedSteps: number[];
  markComplete: (stepNo: number) => void;
  unmarkComplete: (stepNo: number) => void;
}

export const StepContext = createContext<StepContextType | undefined>(
  undefined
);

export const useStep = () => {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error("useStep must be used within a StepProvider");
  }
  return context;
};
