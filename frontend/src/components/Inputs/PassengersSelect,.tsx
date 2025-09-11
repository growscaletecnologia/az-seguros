'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MapPin, UserSquare2 } from "lucide-react"


type Props = {
    data: string,
    setData: (value: string) => void
}


export default function PassengersSelect({ data, setData }: Props) {
    return (
       <div className="flex items-center h-[52px] w-full px-3 rounded-lg bg-white/20 border border-white/30 text-white focus-within:ring-2 focus-within:ring-yellow-400">
                <UserSquare2 className="h-5 w-5 mr-2 opacity-80" />
                <Select value={String(data)} onValueChange={(value) => setData(value)}>
                    <SelectTrigger className="w-full bg-transparent border-0 text-white placeholder:text-white focus:ring-0 focus:outline-none">
                        <SelectValue
                            placeholder="Passageiros"
                            className="!placeholder:text-white !text-white"
                        />
                    </SelectTrigger>
                    <SelectContent className="w-[var(--radix-select-trigger-width)]">
                        <SelectGroup>
                            <SelectLabel>
                               Selecione a quantidade de passageiros
                            </SelectLabel>
                            <SelectItem value="1">1 passageiro</SelectItem>
                            <SelectItem value="2">2 passageiros</SelectItem>
                            <SelectItem value="3">3 passageiros</SelectItem>
                            <SelectItem value="4">4 passageiros</SelectItem>
                            <SelectItem value="5">5 passageiros</SelectItem>
                              
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
    )
}