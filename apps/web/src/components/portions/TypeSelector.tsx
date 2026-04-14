import { type ComponentType, type SVGProps } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { CreatePortionBody } from "@cube-prep/api-client";

export type TypeConfig = {
  label: string;
  iconBadgeClass: string;
  iconColorClass: string;
  selectedBorderClass: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export type TypeSelectorProps = {
  value: string;
  onValueChange: (value: string) => void;
  types: Array<CreatePortionBody["type"]>;
  typeConfig: Record<CreatePortionBody["type"], TypeConfig>;
};

export function TypeSelector({ value, onValueChange, types, typeConfig }: TypeSelectorProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      className="grid grid-cols-4 gap-2 md:grid-cols-4"
    >
      {types.map((type) => {
        const config = typeConfig[type];
        const Icon = config.icon;
        const isSelected = value === type;

        return (
          <label key={type} className="cursor-pointer" htmlFor={`type-selector-${type}`}>
            <div
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 rounded-lg border bg-white px-1 py-2.5 transition-all dark:bg-surface-container-low",
                isSelected ? config.selectedBorderClass : "border-foreground/10",
              )}
            >
              <Icon className={cn("size-5", config.iconColorClass)} strokeWidth={1.5} />
              <div className="w-full text-center text-[0.6rem] font-semibold leading-none tracking-wide text-foreground/85">
                {config.label}
              </div>
              <RadioGroupItem id={`type-selector-${type}`} value={type} className="hidden" />
            </div>
          </label>
        );
      })}
    </RadioGroup>
  );
}
