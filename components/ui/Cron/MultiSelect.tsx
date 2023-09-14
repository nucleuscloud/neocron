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
import { Unit } from "@/types";
import { spreadOption } from "@/lib/units";

interface Props {
  options: Unit;
}

export default function MultiSelect(props: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { options } = props;
  const [openCombobox, setOpenCombobox] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const toggleOptions = (option: string) => {
    setSelectedValues((currentOption) =>
      !currentOption.includes(option)
        ? [...currentOption, option]
        : currentOption.filter((l) => l !== option)
    );
    inputRef?.current?.focus();
  };

  const handleSelectAll = () => {
    if (!selectAll) {
      setSelectAll(true);
      setSelectedValues(spreadOption(options));
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
            {selectedValues?.sort().map((item) => (
              <Badge variant="secondary" key={item} className="mr-1 ">
                {item}
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
              {spreadOption(options).map((option) => {
                const isActive = selectedValues?.includes(option);
                return (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => toggleOptions(option)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isActive ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex-1">{option}</div>
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
