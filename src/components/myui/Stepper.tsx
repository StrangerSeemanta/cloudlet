import { useStep } from "@/context/useStep";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const steps = [
  { stepName: "Create Account", stepURL: "/account/create" },
  { stepName: "Confirm Email", stepURL: "/account/create/verify_email" },
  { stepName: "Upload Profile", stepURL: "/account/create/upload_pp" },
];

export default function StepperComponent() {
  const { currentStep, nextStep, completedSteps } = useStep();
  const [isStepLoading, setIsStepLoading] = useState(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    for (const x in steps) {
      if (steps[x].stepURL === pathname) {
        nextStep(Number(x) + 1);
      }
    }
  }, [pathname, nextStep]);
  useEffect(() => {
    if (completedSteps) {
      setIsStepLoading(false);
    }
  }, [completedSteps]);
  return (
    <div className="bg-white md:bg-black p-8">
      <div className="flex md:flex-col items-center gap-5">
        {isStepLoading ? (
          <div className="flex flex-col justify-center items-center gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5, background: "gray" }}
              animate={{
                scale: 1.2,
                opacity: 1,
                background: "blue",
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 10,
                repeat: Infinity,
                duration: 0.2,
              }}
              className={`flex cursor-pointer justify-center items-center w-20 h-20 rounded-full `}
            ></motion.div>
          </div>
        ) : (
          steps.map((step, index) => (
            <div
              className="flex flex-col justify-center items-center gap-4"
              key={index}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: index + 1 === currentStep ? 1.3 : 1,
                  opacity: index + 1 <= currentStep ? 1 : 0.5,
                }}
                whileHover={{ opacity: 1, scale: 1.5 }}
                whileTap={{ scale: 0.8 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className={`flex cursor-pointer justify-center items-center w-8 h-8 rounded-full ${
                  completedSteps.includes(index + 1)
                    ? "bg-green-600 text-white"
                    : index + 1 === currentStep
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300"
                }`}
                onClick={() => {
                  nextStep(index + 1);
                  navigate(step.stepURL);
                }}
              >
                {index + 1}
              </motion.div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: index + 1 === currentStep ? 1.3 : 1,
                  opacity: index + 1 <= currentStep ? 1 : 0.5,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className={`hidden md:flex justify-center w-fit text-sm items-center rounded-full ${
                  completedSteps.includes(index + 1)
                    ? "text-green-600 "
                    : index + 1 === currentStep
                    ? "text-blue-500"
                    : "text-gray-300"
                }`}
              >
                {step.stepName}
              </motion.div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
