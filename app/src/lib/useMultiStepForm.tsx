import { useState } from "react";
import type { ReactElement } from "react";

export function useMultiStepForm(steps: ReactElement[]) {
  const [currStepIndex, setStep] = useState(0);

  function next() {
    setStep(i => {
        if (i >= steps.length) return i - 1;
        return i + 1
    })
  }
  function back() {
    setStep(i => {
        if (i <= 0) return 0;
        return i - 1
    })
  }

  return {
    currStepIndex,
    step: steps[currStepIndex],
    steps,
    next,
    back,
  }
}