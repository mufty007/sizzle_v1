"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

interface ServingSizeProps {
  servings: number;
  onServingsChange: (servings: number) => void;
}

export function ServingSize({ servings, onServingsChange }: ServingSizeProps) {
  const handleIncrement = () => {
    onServingsChange(Math.min(servings + 1, 99));
  };

  const handleDecrement = () => {
    onServingsChange(Math.max(servings - 1, 1));
  };

  const handleInputChange = (value: string) => {
    const newServings = parseInt(value);
    if (!isNaN(newServings) && newServings >= 1 && newServings <= 99) {
      onServingsChange(newServings);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Servings:</span>
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-r-none"
          onClick={handleDecrement}
          disabled={servings <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={servings}
          onChange={(e) => handleInputChange(e.target.value)}
          className="h-8 w-16 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          min={1}
          max={99}
        />
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-l-none"
          onClick={handleIncrement}
          disabled={servings >= 99}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}