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
  onChange: (ind: number, opt: string[]) => void;
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

  const allUnits = getUnits();
  const ind = allUnits.findIndex((unit) => unit.name == options.name);

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
      onChange(ind, updatedOptions); // Notify parent about the change.

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
      onChange(ind, allOptions);
    } else {
      setSelectAll(false);
      setSelectedValues([]);
      onChange(0, []); // Notify parent about the change.
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

  //renders badges in the combobox and aggregates ranges for days, hours and minutes
  //while leaving months and weekdays alone since those have text in them
  const renderBadges = () => {
    if (options?.alt) {
      return selectedValues.length > 0 ? (
        selectedValues
          ?.sort((a, b) => Number(a) - Number(b))
          .map((item) => (
            <Badge variant="secondary" key={item} className="mr-1">
              {formatOption(item)}
            </Badge>
          ))
      ) : (
        <div className="all-badges">All</div>
      );
    } else {
      return selectedValues.length > 0 ? (
        createRanges(
          selectedValues?.sort((a, b) => Number(a) - Number(b)).map(Number)
        ).map((item) => (
          <Badge variant="secondary" key={item} className="mr-1">
            {formatOption(item)}
          </Badge>
        ))
      ) : (
        <div className="all-badges">All</div>
      );
    }
  };

  return (
    <div className="multiselect-container">
      <div className="multiselect-header-text">{options.name}(s)</div>
      <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCombobox}
            className="multi-select-button"
          >
            <div className="flex-container-row">
              <div className="multiselect-badges">{renderBadges()}</div>
              <ChevronsUpDown className="multiselect-chervon" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="popover-content-container">
          <Command loop>
            <div className="multiselect-dropdown">
              {spreadOption(options).map((option) => {
                const isActive = selectedValues?.includes(option);
                return (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => toggleOptions(option)}
                    className={cn(
                      'flex-1',
                      isActive && 'multiselect-selected-value'
                    )}
                  >
                    <div>{formatOption(option)}</div>
                  </CommandItem>
                );
              })}
            </div>
            <CommandSeparator alwaysRender />
            <CommandGroup>
              <CommandItem className="commanditem" onSelect={handleSelectAll}>
                {selectAll ? 'Unselect All' : 'Select All'}
              </CommandItem>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
