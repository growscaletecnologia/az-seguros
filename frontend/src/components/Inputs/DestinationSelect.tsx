"use client";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";

type Props = {
	data: string;
	setData: (value: string) => void;
};

export default function DestinationSelect({ data, setData }: Props) {
	return (
		<div className="flex items-center h-[52px] w-full px-3 rounded-lg bg-white/20 border border-white/30 text-white focus-within:ring-2 focus-within:ring-yellow-400">
			<MapPin className="h-5 w-5 mr-2 opacity-80" />
			<Select value={data} onValueChange={setData}>
				<SelectTrigger className="w-full bg-transparent border-0 text-white placeholder:text-white focus:ring-0 focus:outline-none">
					<SelectValue
						placeholder="Destinos"
						className="!placeholder:text-white !text-white"
					/>
				</SelectTrigger>
				<SelectContent className="w-[var(--radix-select-trigger-width)]">
					<SelectGroup>
						<SelectLabel>Destinos</SelectLabel>
						<SelectItem value="europa">Europa</SelectItem>
						<SelectItem value="america-norte">América do Norte</SelectItem>
						<SelectItem value="america-sul">América do Sul</SelectItem>
						<SelectItem value="argentina">Argentina</SelectItem>
						<SelectItem value="asia">Ásia</SelectItem>
						<SelectItem value="oceania">Oceania</SelectItem>
						<SelectItem value="oriente-medio">Oriente Médio</SelectItem>
						<SelectItem value="africa">África</SelectItem>
						<SelectItem value="internacional">Internacional</SelectItem>
						<SelectItem value="america-central">América Central</SelectItem>
						<SelectItem value="brasil">
							Brasil
							<span className="block text-xs text-gray-500">
								Para viagens dentro do Brasil
							</span>
						</SelectItem>
						<SelectItem value="incoming">
							Incoming
							<span className="block text-xs text-gray-500">
								Para quem vem visitar o Brasil
							</span>
						</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
}
