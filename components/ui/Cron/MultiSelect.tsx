"use client";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
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
  resetSelectedValues: boolean;
  setResetSelectedValues: (val: boolean) => void;
}

export default function MultiSelect(props: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { options, onChange, resetSelectedValues, setResetSelectedValues } =
    props;
  const [openCombobox, setOpenCombobox] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  useEffect(() => {
    if (resetSelectedValues) {
      setSelectedValues([]);
      setResetSelectedValues(false);
    }
  }, [resetSelectedValues, setResetSelectedValues]);

  const toggleOptions = (option: string) => {
    setSelectedValues((currentOption) => {
      const updatedOptions = !currentOption.includes(option)
        ? [...currentOption, option]
        : currentOption.filter((curr) => curr !== option);

      onChange(updatedOptions); // Notify parent about the change.

      return updatedOptions;
    });

    inputRef?.current?.focus();
  };

  const handleSelectAll = () => {
    if (!selectAll) {
      setSelectAll(true);
      const allOptions = spreadOption(options);
      setSelectedValues(allOptions);
      onChange(allOptions);
    } else {
      setSelectAll(false);
      setSelectedValues([]);
      onChange([]); // Notify parent about the change.
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
    <div className="flex flex-col items-center">
      <div className="text-xs text-center">{options.name}(s)</div>
      <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCombobox}
            className="flex flex-wrap max-w-sm text-foreground "
          >
            <div className="flex flex-row">
              <div className=" flex flex-wrap ">
                {selectedValues.length > 0 ? (
                  selectedValues
                    ?.sort((a, b) => Number(a) - Number(b))
                    .map((item) => (
                      <Badge variant="secondary" key={item} className="mr-1">
                        {formatOption(item)}
                      </Badge>
                    ))
                ) : (
                  <div className="items-start">{options.name}</div>
                )}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command loop>
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
