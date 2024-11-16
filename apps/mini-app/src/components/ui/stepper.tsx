"use client";
import { cn } from "@/lib/utils";
import React, {
  Children,
  cloneElement,
  isValidElement,
  forwardRef,
  createContext,
  useContext,
  useRef,
} from "react";
import { Button } from "./button";

const StepperContext = createContext({
  currentStep: 0,
  handleNext: () => {},
  handlePrev: () => {},
  setCurrentStep: (step: number) => {},
});

const useStepperContext = () => useContext(StepperContext);

const StepperProvider = ({
  children,
  setCurrentStep,
  currentStep,
  stepperRef,
}: {
  children: React.ReactNode;
  setCurrentStep: (step: number) => void;
  currentStep: number;
  stepperRef: React.RefObject<HTMLDivElement>;
}) => {
  const handleScrollToStepper = () => {
    if (stepperRef.current) {
      stepperRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNext = () => {
    const newStep = currentStep + 1;
    setCurrentStep(newStep);
    handleScrollToStepper();
  };

  const handlePrev = () => {
    const newStep = currentStep > 0 ? currentStep - 1 : 0;
    setCurrentStep(newStep);
    handleScrollToStepper();
  };

  return (
    <StepperContext.Provider
      value={{
        currentStep,
        handleNext,
        handlePrev,
        setCurrentStep,
      }}
    >
      {children}
    </StepperContext.Provider>
  );
};

const StepLabel = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className?: string; index?: number }
>(({ children, className, index }, ref) => {
  const { currentStep } = useStepperContext();

  const active = currentStep >= (index || 0);
  return (
    <div className={cn("grid gap-4 w-full", className)} ref={ref}>
      <div
        className={cn(
          "h-1",
          active
            ? "bg-accent shadow-3xl shadow-accent/40"
            : "bg-muted-foreground"
        )}
      />
      <div
        className={cn(
          "text-sm font-medium self-stretch text-left",
          active ? "text-white" : "text-muted-foreground"
        )}
      >
        {children}
      </div>
    </div>
  );
});
StepLabel.displayName = "StepLabel";

const Step = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  ({ ...props }, ref) => {
    return <div ref={ref} {...props} />;
  }
);
Step.displayName = "Step";

const StepBody = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  ({ ...props }, ref) => {
    return <div ref={ref} {...props} />;
  }
);
StepBody.displayName = "StepBody";

const StepPrevButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children = "BACK", onClick, className, ...props }, ref) => {
  const { handlePrev, currentStep } = useStepperContext();

  return (
    <Button
      ref={ref}
      type="button"
      onClick={async (e) => {
        if (onClick) {
          await onClick(e);
        }
        handlePrev();
      }}
      disabled={currentStep === 0}
      className={cn("flex-1", className)}
      {...props}
    >
      {children}
    </Button>
  );
});
StepPrevButton.displayName = "StepPrevButton";

const StepNextButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children = "NEXT", onClick, className, ...props }, ref) => {
  const { handleNext } = useStepperContext();

  return (
    <Button
      ref={ref}
      type="button"
      onClick={async (e) => {
        if (onClick) {
          await onClick(e);
        }
        handleNext();
      }}
      className={cn("flex-1 order-first sm:order-last w-full", className)}
      {...props}
    >
      {children}
    </Button>
  );
});
StepNextButton.displayName = "StepNextButton";

const StepFooter = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className?: string }
>(({ children, className }, ref) => {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row justify-between gap-2 sm:gap-4",
        className
      )}
      ref={ref}
    >
      {children}
    </div>
  );
});
StepFooter.displayName = "StepFooter";

const StepperContent = ({ steps }: { steps: any[] }) => {
  const { currentStep } = useStepperContext();
  const body = steps[currentStep]?.props.children.find(
    (child: any) => child.type.displayName === "StepBody"
  );
  const footer = steps[currentStep]?.props.children.find(
    (child: any) => child.type.displayName === "StepFooter"
  );
  return (
    <>
      {body}
      {footer && cloneElement(footer)}
    </>
  );
};

const Stepper = ({
  children,
  className,
  currentStep,
  setCurrentStep,
}: {
  children: React.ReactNode;
  className?: string;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const steps = Children.toArray(children).filter(
    (child: any) => child.type.displayName === "Step"
  );

  if (steps.length === 0) {
    return null;
  }

  return (
    <StepperProvider
      setCurrentStep={setCurrentStep}
      currentStep={currentStep}
      stepperRef={ref}
    >
      <div className={cn("w-full flex flex-col gap-10", className)} ref={ref}>
        <div className="flex gap-2 sm:gap-4 pt-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-1">
              {isValidElement(step) &&
                cloneElement(
                  step.props.children.find(
                    (child: any) => child.type.displayName === "StepLabel"
                  ),
                  {
                    index,
                  }
                )}
            </div>
          ))}
        </div>
        <StepperContent steps={steps} />
      </div>
    </StepperProvider>
  );
};

export {
  Step,
  StepBody,
  StepFooter,
  StepLabel,
  Stepper,
  StepPrevButton,
  StepNextButton,
};
