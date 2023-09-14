"use client";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Framework = Record<"value" | "label" | "color", string>;

const FRAMEWORKS: Framework[] = [
  {
    value: "monday",
    label: "Monday",
    color: "#ef4444",
  },
  {
    value: "tuesday",
    label: "Tuesday",
    color: "#eab308",
  },
  {
    value: "wednesday",
    label: "Wednesday",
    color: "#22c55e",
  },
  {
    value: "thursday",
    label: "Thursday",
    color: "#06b6d4",
  },
  {
    value: "friday",
    label: "Friday",
    color: "#3b82f6",
  },
  {
    value: "Saturday",
    label: "Saturday",
    color: "#8b5cf6",
  },
  {
    value: "Sunday",
    label: "Sunday",
    color: "#8b5cf6",
  },
];

const badgeStyle = (color: string) => ({
  borderColor: `${color}20`,
  backgroundColor: `${color}30`,
  color,
});

export default function MultiSelect() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [frameworks, setFrameworks] = useState<Framework[]>(FRAMEWORKS);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedValues, setSelectedValues] = useState<Framework[]>([
    FRAMEWORKS[0],
  ]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const toggleFramework = (framework: Framework) => {
    setSelectedValues((currentFrameworks) =>
      !currentFrameworks.includes(framework)
        ? [...currentFrameworks, framework]
        : currentFrameworks.filter((l) => l.value !== framework.value)
    );
    inputRef?.current?.focus();
  };

  const handleSelectAll = () => {
    if (!selectAll) {
      setSelectAll(true);
      setSelectedValues(FRAMEWORKS);
    } else {
      setSelectAll(false);
      setSelectedValues([]);
    }
  };

  return (
    <div className="flex flex-row items-center">
      <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCombobox}
            className="justify-between text-foreground items-center"
          >
            {selectedValues.map((item) => (
              <Badge variant="secondary" key={item.label} className="mr-1 ">
                {item.label}
              </Badge>
            ))}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command loop>
            <CommandInput
              ref={inputRef}
              placeholder="Search values..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandGroup className="max-h-[145px] overflow-auto">
              {frameworks.map((framework) => {
                const isActive = selectedValues.includes(framework);
                return (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={() => toggleFramework(framework)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isActive ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex-1">{framework.label}</div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator alwaysRender />
            <CommandGroup>
              <CommandItem
                value={inputValue}
                className="text-xs text-muted-foreground"
                onSelect={handleSelectAll}
              >
                {selectAll ? "Unselect All" : "Select All"}
              </CommandItem>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
