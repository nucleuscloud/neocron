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
  onChange: (opt: string[]) => void;
}

export default function MultiSelect(props: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { options } = props;
  const [openCombobox, setOpenCombobox] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const toggleOptions = (option: string) => {
    setSelectedValues((currentOption) => {
      const updatedOptions = !currentOption.includes(option)
        ? [...currentOption, option]
        : currentOption.filter((l) => l !== option);

      props.onChange(updatedOptions); // Notify parent about the change.

      return updatedOptions;
    });
    inputRef?.current?.focus();
  };

  const handleSelectAll = () => {
    if (!selectAll) {
      setSelectAll(true);
      const allOptions = spreadOption(options);
      setSelectedValues(allOptions);
      props.onChange(allOptions);
    } else {
      setSelectAll(false);
      setSelectedValues([]);
      props.onChange([]); // Notify parent about the change.
    }
  };

  //formats option with alt text to include that
  const formatOption = (option: string) => {
    if (options?.alt) {
      if (options.name == "month") {
        //month has a min of 1 instead of 0 so have to subtract 1 to get the index to work
        return option + " - " + options?.alt[Number(option) - 1];
      } else {
        return option + " - " + options?.alt[Number(option)];
      }
    } else {
      return option;
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
                {formatOption(item)}
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
                    <div className="flex-1">{formatOption(option)}</div>
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
