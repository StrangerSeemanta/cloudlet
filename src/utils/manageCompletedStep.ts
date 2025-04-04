import { User } from "firebase/auth";

export function manageCompletedSteps(
  user: User | null,
  markComplete: (step: number) => void,
  unmarkComplete: (step: number) => void
) {
  if (!user) {
    // If no user is logged in, unmark all steps
    [1, 2, 3].forEach((step) => {
      try {
        unmarkComplete(step);
      } catch (error) {
        console.error(`Failed to unmark step ${step}:`, error);
      }
    });
    return;
  }

  // Define steps with their conditions
  const steps = [
    { step: 1, condition: !!user },
    { step: 2, condition: !!user.emailVerified },
    { step: 3, condition: !!user.photoURL },
  ];

  steps.forEach(({ step, condition }) => {
    try {
      if (condition) {
        markComplete(step); // Mark step as complete if condition is true
      } else {
        unmarkComplete(step); // Unmark step if condition is false
      }
    } catch (error) {
      console.error(`Failed to update step ${step}:`, error);
    }
  });
}
