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
import { MapPin } from "lucide-react"


type Props = {
    data: string,
    setData: (value: string) => void
}


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
                            <SelectLabel>
                                Estados do Brasil
                            </SelectLabel>
                            <SelectItem value="AC">
                                        Acre (AC)
                                    </SelectItem>
                                    <SelectItem value="AL">
                                        Alagoas (AL)
                                    </SelectItem>
                                    <SelectItem value="AP">
                                        Amapá (AP)
                                    </SelectItem>
                                    <SelectItem value="AM">
                                        Amazonas (AM)
                                    </SelectItem>
                                    <SelectItem value="BA">
                                        Bahia (BA)
                                    </SelectItem>
                                    <SelectItem value="CE">
                                        Ceará (CE)
                                    </SelectItem>
                                    <SelectItem value="DF">
                                        Distrito Federal (DF)
                                    </SelectItem>
                                    <SelectItem value="ES">
                                        Espírito Santo (ES)
                                    </SelectItem>
                                    <SelectItem value="GO">
                                        Goiás (GO)
                                    </SelectItem>
                                    <SelectItem value="MA">
                                        Maranhão (MA)
                                    </SelectItem>
                                    <SelectItem value="MT">
                                        Mato Grosso (MT)
                                    </SelectItem>
                                    <SelectItem value="MS">
                                        Mato Grosso do Sul (MS)
                                    </SelectItem>
                                    <SelectItem value="MG">
                                        Minas Gerais (MG)
                                    </SelectItem>
                                    <SelectItem value="PA">
                                        Pará (PA)
                                    </SelectItem>
                                    <SelectItem value="PB">
                                        Paraíba (PB)
                                    </SelectItem>
                                    <SelectItem value="PR">
                                        Paraná (PR)
                                    </SelectItem>
                                    <SelectItem value="PE">
                                        Pernambuco (PE)
                                    </SelectItem>
                                    <SelectItem value="PI">
                                        Piauí (PI)
                                    </SelectItem>
                                    <SelectItem value="RJ">
                                        Rio de Janeiro (RJ)
                                    </SelectItem>
                                    <SelectItem value="RN">
                                        Rio Grande do Norte (RN)
                                    </SelectItem>
                                    <SelectItem value="RS">
                                        Rio Grande do Sul (RS)
                                    </SelectItem>
                                    <SelectItem value="RO">
                                        Rondônia (RO)
                                    </SelectItem>
                                    <SelectItem value="RR">
                                        Roraima (RR)
                                    </SelectItem>
                                    <SelectItem value="SC">
                                        Santa Catarina (SC)
                                    </SelectItem>
                                    <SelectItem value="SP">
                                        São Paulo (SP)
                                    </SelectItem>
                                    <SelectItem value="SE">
                                        Sergipe (SE)
                                    </SelectItem>
                                    <SelectItem value="TO">
                                        Tocantins (TO)
                                    </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
    )
}