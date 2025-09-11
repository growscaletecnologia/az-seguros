"use client";

import { Phone } from "lucide-react";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

type Props = {
    phone: string,
    setPhone: (value: string) => void
}
export default function PhoneField({ phone, setPhone }: Props) {

  return (
    <div className="flex items-center h-[52px] w-full px-3 rounded-lg bg-white/20 border border-white/30 text-white focus-within:ring-2 focus-within:ring-yellow-400">
      <Phone className="h-5 w-5 mr-2 opacity-80" />
      <PhoneInput
        country={"br"} 
        value={phone}
        onChange={setPhone}
        inputClass="!bg-transparent !border-0 !text-white placeholder-white/70 !w-full"
        buttonClass="!bg-transparent !border-0"
        dropdownClass="!text-black"
        placeholder="Telefone"
        masks={{ br: "(..) .....-...." }} // mascara custom BR
      />
    </div>
  );
}
