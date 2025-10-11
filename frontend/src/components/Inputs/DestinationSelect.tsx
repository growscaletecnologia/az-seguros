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
// O array DESTINIES já está ordenado por 'display_order'
import { DESTINIES } from "@/types/destination"; 

import { MapPin } from "lucide-react";

type Props = {
  data: string;
  setData: (value: string) => void;
};

export default function DestinationSelect({ data, setData }: Props) {
  return (
    <div className="flex items-center h-[52px] w-full px-3 rounded-lg bg-white/20 border border-white/30 text-white focus-within:ring-2 focus-within:ring-yellow-400">
      <MapPin className="h-5 w-5 mr-2 opacity-80" />
      <Select 
        // Use 'data' diretamente para refletir o valor selecionado
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
                  key={d.id.toString()} // Use um id único como key
                  value={d.slug as string} // Use o slug como valor
                  title={d.name as string} // Use o nome como title
               >
                 {d.name} {/* Texto que aparece no SelectItem */}
               </SelectItem>
           ))}
           
            {/* Se você quiser manter um item fixo para "Incoming" que não está no array DESTINIES */}
            {/* <SelectItem value="incoming" title="Para quem vem visitar o Brasil">
              Incoming
            </SelectItem> */}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}