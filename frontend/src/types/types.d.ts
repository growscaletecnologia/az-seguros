import { DateRange } from "react-day-picker";

export interface PreRegisterForm{
    name: string;
    email: string;
    phone: string;
    range: DateRange | undefined;
    passengers: string;
    destination: string;
    step?: number;
    coupon?: string;
    term?:boolean;
}