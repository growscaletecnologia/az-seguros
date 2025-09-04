"use client";

import { differenceInCalendarDays, format, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Props = {
	value?: DateRange;
	onChange?: (range: DateRange | undefined) => void;
	minDate?: Date;
	months?: number;
};

export function DateRangePicker({ value, onChange, minDate = new Date(), months = 2 }: Props) {
	const [range, setRange] = React.useState<DateRange | undefined>(value);

	React.useEffect(() => {
		onChange?.(range);
	}, [range, onChange]);

	const nights =
		range?.from && range?.to ? Math.max(1, differenceInCalendarDays(range.to, range.from)) : 0;

	return (
		<div className="flex flex-col gap-2 ">
			<Popover>
				<PopoverTrigger asChild>
					<div
						className={cn(
							" flex flex-auto w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white text-sm text-left font-normal focus:outline-none focus:ring-2 focus:ring-yellow-400",
							!range && "text-white/70",
						)}
					>
						<CalendarIcon className="flex relative right-1.5 h-5 w-5" />
						{range?.from ? (
							range.to ? (
								<>
									{format(range.from, "dd/MM/yyyy", { locale: ptBR })} —{" "}
									{format(range.to, "dd/MM/yyyy", { locale: ptBR })}
								</>
							) : (
								format(range.from, "dd/MM/yyyy", { locale: ptBR })
							)
						) : (
							<span>
								Selecione as datas de ida e volta (Embarque e Desembarque no Brasil)
							</span>
						)}
					</div>
				</PopoverTrigger>

				<PopoverContent className="w-auto p-0">
					<Calendar
						locale={ptBR}
						mode="range"
						selected={range}
						onSelect={setRange}
						numberOfMonths={2}
						defaultMonth={range?.from}
						disabled={(date) => isBefore(date, new Date())}
						classNames={{
							// dia selecionado único (quando o usuário só clicou uma vez e não escolheu a volta ainda)
							day_selected:
								"bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 rounded-full",

							// início do range
							day_range_start:
								"bg-blue-600 text-white hover:bg-blue-700 rounded-l-full",

							// fim do range
							day_range_end:
								"bg-blue-600 text-white hover:bg-blue-700 rounded-r-full",

							// meio do range + também cobre hover preview
							day_range_middle: "bg-blue-100 text-blue-900 hover:bg-blue-200",
						}}
					/>

					<div className="flex items-center justify-between border-t p-3 text-sm">
						<button className="underline" onClick={() => setRange(undefined)}>
							Limpar
						</button>
						<div>
							{nights > 0
								? `${nights} ${nights === 1 ? "noite" : "noites"}`
								: "\u00A0"}
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
