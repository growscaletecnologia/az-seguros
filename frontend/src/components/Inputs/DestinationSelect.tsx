// "use client";

// import {
// 	Select,
// 	SelectContent,
// 	SelectGroup,
// 	SelectItem,
// 	SelectLabel,
// 	SelectTrigger,
// 	SelectValue,
// } from "@/components/ui/select";
// // O array DESTINIES já está ordenado por 'display_order'
// import { DESTINIES } from "@/types/destination";

// import { MapPin } from "lucide-react";

// type Props = {
// 	data: string;
// 	setData: (value: string) => void;
// };

// export default function DestinationSelect({ data, setData }: Props) {
// 	return (
// 		<div className="flex items-center h-[52px] w-full px-3 rounded-lg bg-white/20 border border-white/30 text-white focus-within:ring-2 focus-within:ring-yellow-400">
// 			<MapPin className="h-5 w-5 mr-2 opacity-80" />
// 			<Select
// 				// Use 'data' diretamente para refletir o valor selecionado
// 				value={data || ""}
// 				onValueChange={setData}
// 			>
// 				<SelectTrigger className="w-full bg-transparent border-0 text-white placeholder:text-white focus:ring-0 focus:outline-none">
// 					<SelectValue
// 						placeholder="Destinos"
// 						className="!placeholder:text-white !text-white"
// 					/>
// 				</SelectTrigger>
// 				<SelectContent className="w-[var(--radix-select-trigger-width)]">
// 					<SelectGroup>
// 						<SelectLabel>Destinos</SelectLabel>

// 						{/* Mapeamento dos Destinos Ordenados */}
// 						{DESTINIES.map((d) => (
// 							<SelectItem
// 								key={d.id.toString()} // Use um id único como key
// 								value={d.slug as string} // Use o slug como valor
// 								title={d.name as string} // Use o nome como title
// 							>
// 								{d.name} {/* Texto que aparece no SelectItem */}
// 							</SelectItem>
// 						))}

// 						{/* Se você quiser manter um item fixo para "Incoming" que não está no array DESTINIES */}
// 						{/* <SelectItem value="incoming" title="Para quem vem visitar o Brasil">
//               Incoming
//             </SelectItem> */}
// 					</SelectGroup>
// 				</SelectContent>
// 			</Select>
// 		</div>
// 	);
// }


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
import { DESTINIES } from "@/types/destination";
// Simulação de imports e dados, pois o código deve ser self-contained
import { MapPin } from "lucide-react";

// DADOS DE DESTINO (Definidos aqui para garantir auto-suficiência)
interface Destiny { 
    id: number; 
    name: string; 
    slug: string; 
    display_order: number; 
    destiny_code: string; 
}

// const DESTINIES: Destiny[] = [
//     { id: 1, name: "Brasil", slug: "brasil", display_order: 1, destiny_code: "GPR" },
//     { id: 4, name: "América do Norte", slug: "estados-unidos-e-canada", display_order: 3, destiny_code: "USA" },
//     { id: 3, name: "Europa", slug: "europa", display_order: 6, destiny_code: "EUR" },
//     { id: 29, name: "América do Sul", slug: "america-latina-inclui-mexico", display_order: 7, destiny_code: "GPR" },
//     { id: 30, name: "México", slug: "mexico", display_order: 8, destiny_code: "GPR" },
//     { id: 9, name: "Ásia", slug: "demais-destinos-asia", display_order: 12, destiny_code: "GPR" },
//     { id: 10, name: "África", slug: "demais-destinos-africa", display_order: 13, destiny_code: "GPR" },
//     { id: 11, name: "Oceania", slug: "demais-destinos-oceania", display_order: 14, destiny_code: "GPR" },
// ];


type Props = {
    data: string;
    setData: (value: string) => void;
};

export default function DestinationSelect({ data, setData }: Props) {
    return (
        <div className="flex items-center h-[52px] w-full px-3 rounded-lg bg-white/20 border border-white/30 text-white focus-within:ring-2 focus-within:ring-yellow-400">
            <MapPin className="h-5 w-5 mr-2 opacity-80" />
            <Select
                // data deve ser a chave (o slug)
                value={data || ""}
                onValueChange={setData}
            >
                <SelectTrigger className="w-full bg-transparent border-0 text-white placeholder:text-white focus:ring-0 focus:outline-none">
                    <SelectValue
                        placeholder="Destinos"
                        className="!placeholder:text-white !text-white"
                    />
                </SelectTrigger>
                <SelectContent className="w-[var(--radix-select-trigger-width)]">
                    <SelectGroup>
                        <SelectLabel>Destinos</SelectLabel>

                        {/* Mapeamento dos Destinos Ordenados */}
                        {DESTINIES.map((d) => (
                            <SelectItem
                                key={d.id} 
                                value={d.id.toString()} 
                                title={d.name as string}
                            >
                                {d.name} {/* Texto que o usuário vê */}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}
