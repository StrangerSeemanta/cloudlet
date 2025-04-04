import { useCallback, useContext, useEffect, useState } from "react";
import { StepContext } from "./useStep";
import { getUserData, updateUserData } from "@/firebase/FirebaseUserData";
import { AuthContext } from "./authContext";

export const StepProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useContext(AuthContext);
  const getCompletedSteps = useCallback(async () => {
    if (!user) return [0];
    const documentData = await getUserData(user);
    if (
      documentData &&
      documentData.completedSteps &&
      documentData.completedSteps.length > 1
    ) {
      return documentData.completedSteps;
    } else {
      return [0];
    }
  }, [user]);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentStepURL, setCurrentStepURL] = useState("/account/create");
  const updateCurrentStepURL = (stepName: string) =>
    setCurrentStepURL(stepName);
  const [completedSteps, setCompletedSteps] = useState<number[]>([0]);
  useEffect(() => {
    async function fetchCompletedSteps() {
      if (user) {
        const cs = await getCompletedSteps();
        setCompletedSteps(cs);
      }
    }

    fetchCompletedSteps();
  }, [user, getCompletedSteps]);
  const storeCompletedSteps = useCallback(
    async (newCompletedArray: number[]) => {
      if (!user) return;
      await updateUserData(user.uid, "completedSteps", newCompletedArray);
    },
    [user]
  );

  const nextStep = (no: number) => setCurrentStep(no);
  const prevStep = () => setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  const markComplete = useCallback(
    (stepNo: number) => {
      setCompletedSteps((prevSteps) => {
        if (!prevSteps.includes(stepNo)) {
          const updatedSteps = [...prevSteps, stepNo];
          setCompletedSteps(updatedSteps);
          storeCompletedSteps(updatedSteps);
          return updatedSteps;
        }
        return prevSteps;
      });
    },
    [storeCompletedSteps]
  );
  const unmarkComplete = useCallback(
    (stepNo: number) => {
      setCompletedSteps((prevSteps) => {
        const updatedSteps = prevSteps.filter((step) => step !== stepNo);
        storeCompletedSteps(updatedSteps);
        return updatedSteps;
      });
    },
    [storeCompletedSteps]
  );
  return (
    <StepContext.Provider
      value={{
        currentStep: currentStep,
        currentStepURL: currentStepURL,
        updateCurrentStepURL: updateCurrentStepURL,
        nextStep: nextStep,
        prevStep: prevStep,
        completedSteps: completedSteps,
        markComplete: markComplete,
        unmarkComplete: unmarkComplete,
      }}
    >
      {children}
    </StepContext.Provider>
  );
};
