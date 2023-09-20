'use client';
import { ChevronsUpDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../components/ui/button';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '../components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';
import { createRanges, isFull, stringToArray } from '../lib/part';
import { getUnits, spreadOption } from '../lib/units';
import { cn } from '../lib/utils';
import { CronState, Unit } from '../types';
import { Badge } from './ui/badge';

interface Props {
  options: Unit;
  onChange: (opt: string[]) => void;
  resetSelectedValues: boolean;
  setResetSelectedValues: (val: boolean) => void;
  state: CronState;
  setError: (val: string) => void;
}

export default function MultiSelect(props: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    options,
    onChange,
    resetSelectedValues,
    setResetSelectedValues,
    state,
    setError,
  } = props;
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

  //this handles converting the cron expression to the selected values if a user types in a string first
  //the if(!isFull){...}only updates the values in the UI if the user has changed it otherwise leaves it
  //this is to prevent the case where the base cron string is ***** and it selects everything in the drop down
  useEffect(() => {
    try {
      const arr = stringToArray(state.expression); //prints the number[][] array of all selectors
      const allUnits = getUnits(); //get all units so we can find the index of this selectors unit
      const index = allUnits.findIndex((unit) => unit.name == options.name);
      if (arr && Array.isArray(arr)) {
        if (!isFull(arr[index], options)) {
          setSelectedValues(arr[index].map(String));
        }
      }
    } catch (e: any) {
      setError(e.message);
    }
  }, [state]);

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

  //formats option with alt text
  const formatOption = (option: string) => {
    if (options?.alt) {
      if (options.name == 'month') {
        //month has a min of 1 instead of 0 so have to subtract 1 to get the index to work
        return option + '-' + options?.alt[Number(option) - 1];
      } else {
        return option + '-' + options?.alt[Number(option)];
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
            className="flex flex-wrap items-start max-w-sm h-auto text-foreground"
          >
            <div className="flex flex-row">
              <div className="flex flex-wrap items-start">
                {selectedValues.length > 0 ? (
                  createRanges(
                    selectedValues
                      ?.sort((a, b) => Number(a) - Number(b))
                      .map(Number)
                  ).map((item) => (
                    <Badge variant="secondary" key={item} className="mr-1">
                      {formatOption(item)}
                    </Badge>
                  ))
                ) : (
                  <div className="text-center font-light text-gray-300 text-sm">
                    All
                  </div>
                )}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command loop>
            <div className="max-h-[300px] overflow-auto grid grid-cols-5 p-2">
              {spreadOption(options).map((option) => {
                const isActive = selectedValues?.includes(option);
                return (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => toggleOptions(option)}
                    className={cn(
                      'flex-1',
                      isActive &&
                        'rounded-sm bg-green-200 aria-selected:bg-green-200'
                    )}
                  >
                    <div>{formatOption(option)}</div>
                  </CommandItem>
                );
              })}
            </div>
            <CommandSeparator alwaysRender />
            <CommandGroup>
              <CommandItem
                className="text-xs text-muted-foreground"
                onSelect={handleSelectAll}
              >
                {selectAll ? 'Unselect All' : 'Select All'}
              </CommandItem>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
