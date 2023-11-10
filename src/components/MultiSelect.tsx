'use client';
import { ChevronsUpDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createRanges, isFull, stringToArray } from '../lib/part';
import { getUnits, spreadOption } from '../lib/units';
import { cn } from '../lib/utils';
import { CronState, Unit } from '../types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface SetValueObject {
  index: number;
  values: number[];
}

interface Props {
  options: Unit;
  resetSelectedValues: boolean;
  setResetSelectedValues: (val: boolean) => void;
  cronState: CronState;
  setError: (val: string) => void;
  constructCronState: (val: SetValueObject) => void;
}

export default function MultiSelect(props: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    options,
    resetSelectedValues,
    setResetSelectedValues,
    cronState,
    constructCronState,
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

  //this handles converting the cron expression to the selected values if a user types in a string first
  //the if(!isFull){...}only updates the values in the UI if the user has changed it otherwise leaves it
  //this is to prevent the case where the base cron string is ***** and it selects everything in the drop down
  useEffect(() => {
    try {
      const arr = stringToArray(cronState.expression); //prints the number[][] of all selectors
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
  }, [cronState, options]);

  useEffect(() => {
    if (selectedValues.length > 0) {
      constructCronState({ index: ind, values: selectedValues.map(Number) });
    }
  }, [selectedValues, ind]);

  const toggleOptions = (option: string) => {
    setSelectedValues((currentOption) => {
      //checcks to see if the curent values includes what the user just selected
      // if so, then it adds it, otherwise it filters it out
      //then in the onchange, it updates the options with it
      const updatedOptions = !currentOption.includes(option)
        ? [...currentOption, option]
        : currentOption.filter((curr) => curr !== option);
      return updatedOptions;
    });

    inputRef?.current?.focus();
  };

  const handleSelectAll = () => {
    if (!selectAll) {
      setSelectAll(true);
      const allOptions = spreadOption(options);
      setSelectedValues(allOptions);
      constructCronState({ index: ind, values: allOptions.map(Number) });
    } else {
      setSelectAll(false);
      setSelectedValues([]);
      constructCronState({ index: 0, values: [] });
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
                      isActive && 'multiselect-selected-value',
                      !isActive && 'multiselect-unselected-value'
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
