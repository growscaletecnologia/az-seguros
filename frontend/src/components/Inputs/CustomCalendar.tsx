"use client";

import { differenceInCalendarDays, format, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Info } from "lucide-react";
import * as React from "react";
import { DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Props = {
  range?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  minDate?: Date;
  months?: number;
};

export function DateRangePicker({
  range,
  onChange,
  minDate = new Date(),
  months = 2,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [isSelectingStart, setIsSelectingStart] = React.useState(true);

  const handleSelect = (newRange: DateRange | undefined) => {
    onChange?.(newRange);

    if (newRange?.from && !newRange?.to) {
      // Selecionou a primeira data → ainda escolhendo a final
      setIsSelectingStart(false);
    }

    if (newRange?.from  && !isSelectingStart) {
      // Selecionou a data final → fecha
      setOpen(false);
      setIsSelectingStart(true); // reset para próxima vez
    }
  };

  const nights =
    range?.from && range?.to
      ? Math.max(1, differenceInCalendarDays(range.to, range.from))
      : 0;

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex flex-row gap-3">
            <div
              className={cn(
                "flex flex-auto w-full px-4 py-3 h-[52px] rounded-lg bg-white/20 border border-white/30 text-white text-sm text-left font-normal focus:outline-none focus:ring-2 focus:ring-yellow-400",
                !range && "text-white/70",
              )}
            >
              <CalendarIcon className="flex relative right-1.5 h-5 w-5" />
              {range?.from ? (
                <div className="text-[16px]">
                  {format(range.from, "dd/MM/yyyy", { locale: ptBR })}
                </div>
              ) : (
                <span className="text-white/90 text-[16px] font-semibold">
                  Embarque no Brasil
                </span>
              )}
            </div>
            <div
              className={cn(
                "flex flex-auto w-full px-4 py-3 h-[52px] rounded-lg bg-white/20 border border-white/30 text-white text-sm text-left font-normal focus:outline-none focus:ring-2 focus:ring-yellow-400",
                !range && "text-white/70",
              )}
            >
              <CalendarIcon className="flex relative right-1.5 h-5 w-5" />
              {range?.to ? (
                <div className="text-[16px]">
                  {format(range.to, "dd/MM/yyyy", { locale: ptBR })}
                </div>
              ) : (
                <span className="text-white/90 text-[16px] font-semibold">
                  Desembarque no Brasil
                </span>
              )}
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <div className="p-4 flex flex-auto gap-3 mt-2 items-center justify-center">
            <Info className="h-6 w-6 animate-bounce text-blue-400" />
            <span className="text-blue-400">Embarque e Desembarque no Brasil</span>
          </div>
          <Calendar
            locale={ptBR}
            mode="range"
            selected={range}
            onSelect={handleSelect}
            numberOfMonths={months}
            defaultMonth={range?.from}
            disabled={(date) => isBefore(date, minDate)}
            classNames={{
              day_selected:
                "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 rounded-full",
              day_range_start:
                "bg-blue-600 text-white hover:bg-blue-700 rounded-l-full",
              day_range_end:
                "bg-blue-600 text-white hover:bg-blue-700 rounded-r-full",
              day_range_middle:
                "bg-blue-100 text-blue-900 hover:bg-blue-200",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
