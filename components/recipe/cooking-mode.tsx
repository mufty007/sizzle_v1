"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Timer, X, ChefHat, Trophy, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CookingModeProps {
  instructions: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CookingMode({ instructions, open, onOpenChange }: CookingModeProps) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    if (currentStep === 0) {
      setIsTimerRunning(true);
    }
    if (currentStep === instructions.length - 1) {
      setIsTimerRunning(false);
    }
  }, [currentStep, instructions.length]);

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleNextStep = () => {
    if (currentStep === -1) {
      setCurrentStep(0);
      return;
    }
    setCurrentStep((prev) => Math.min(instructions.length - 1, prev + 1));
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setTimer(0);
    setIsTimerRunning(false);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const handleClose = () => {
    onOpenChange(false);
    setCurrentStep(-1);
    setTimer(0);
    setIsTimerRunning(false);
  };

  const renderWelcomeScreen = () => (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="space-y-6 max-w-md mx-auto">
        <div className="flex justify-center">
          <div className="p-4 bg-primary/10 rounded-full">
            <ChefHat className="h-12 w-12 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Ready to Start Cooking? 👩‍🍳</h2>
          <p className="text-muted-foreground">
            Let&apos;s cook this recipe together! We&apos;ll guide you through each step.
            The timer will start automatically when you begin. 🕒
          </p>
        </div>
        <Button
          size="lg"
          onClick={handleNextStep}
          className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
        >
          Let&apos;s Begin!
        </Button>
      </div>
    </div>
  );

  const renderCompletionScreen = () => (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="space-y-8 max-w-md mx-auto">
        <div className="flex justify-center">
          <div className="p-4 bg-primary/10 rounded-full">
            <Trophy className="h-12 w-12 text-primary" />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Congratulations! 🎉</h2>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <Clock className="h-6 w-6 text-primary" />
              Total Cooking Time
            </div>
            <div className="text-4xl font-mono font-bold text-primary">
              {formatTime(timer)}
            </div>
          </div>
          <p className="text-muted-foreground">
            You&apos;ve completed all the steps! Your dish should be ready to enjoy.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => {
              setCurrentStep(0);
              setTimer(0);
            }}
            className="w-full sm:w-auto"
          >
            Start Over
          </Button>
          <Button
            onClick={handleClose}
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
          >
            Finish
          </Button>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 border-b">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <span className="text-sm font-medium text-muted-foreground">
            Step {currentStep + 1} of {instructions.length}
          </span>
          <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
            <Timer className="h-4 w-4" />
            <span className="font-mono">{formatTime(timer)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTimer}
            className="flex-1 sm:flex-none"
          >
            {isTimerRunning ? "Pause" : "Start"} Timer
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetTimer}
            className="flex-1 sm:flex-none"
          >
            Reset Timer
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="sm:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-between p-4 sm:p-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevStep}
          disabled={currentStep === 0}
          className={cn(
            "h-10 w-10 sm:h-12 sm:w-12 rounded-full shrink-0",
            currentStep === 0 && "opacity-50 cursor-not-allowed"
          )}
        >
          <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
        </Button>

        <div className="flex-1 mx-4 sm:mx-8 text-center">
          <p className="text-lg sm:text-xl leading-relaxed">
            {instructions[currentStep]}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextStep}
          className="h-10 w-10 sm:h-12 sm:w-12 rounded-full shrink-0"
        >
          <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
        </Button>
      </div>

      <div className="p-4 sm:p-6 border-t">
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / instructions.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );

  const getDialogTitle = () => {
    if (currentStep === -1) {
      return "Welcome to Cooking Mode";
    }
    if (currentStep === instructions.length - 1) {
      return "Recipe Complete";
    }
    return `Step ${currentStep + 1} of ${instructions.length}`;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl h-[90vh] sm:h-[80vh] flex flex-col p-0">
        <DialogHeader>
          <DialogTitle className="p-4 sm:p-6 border-b bg-muted/50">
            {getDialogTitle()}
          </DialogTitle>
        </DialogHeader>
        {currentStep === -1 
          ? renderWelcomeScreen()
          : currentStep === instructions.length - 1 
            ? renderCompletionScreen()
            : renderStepContent()
        }
      </DialogContent>
    </Dialog>
  );
}