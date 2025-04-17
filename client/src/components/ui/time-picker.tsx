import { useState } from "react";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  timeSlots: string[];
  className?: string;
  disabled?: string[];
}

export default function TimePicker({
  value,
  onChange,
  timeSlots,
  className,
  disabled = [],
}: TimePickerProps) {
  const handleSelect = (timeSlot: string) => {
    if (disabled.includes(timeSlot)) return;
    onChange(timeSlot);
  };

  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {timeSlots.map((slot) => {
        const isSelected = slot === value;
        const isDisabled = disabled.includes(slot);

        return (
          <div
            key={slot}
            onClick={() => handleSelect(slot)}
            className={cn(
              "p-2 text-center rounded-lg border cursor-pointer transition-all",
              isSelected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border",
              isDisabled
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "hover:bg-muted"
            )}
          >
            <span>{slot}</span>
          </div>
        );
      })}
    </div>
  );
}
