import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronLeftCircle, DollarSign } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface LoginCardProps extends React.ComponentProps<"div"> {
  goToNextStep: () => void;
}

export function LoginCard({
  className,
  goToNextStep,
  ...props
}: LoginCardProps) {
  return (
    <div className={className} {...props}>
      {/* <h1 className="hidden md:block text-4xl text-center my-3 font-medium">
        Fique por dentro da cultura de sua cidade!
      </h1> */}
      <h2 className="text-2xl mb-2">Como deseja continuar?</h2>
      <div className="flex flex-col gap-4 w-full">
        <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-400" onClick={goToNextStep}>
          Já tenho uma conta
        </Button>
        <Button variant="secondary" className="w-full">
          Criar nova conta
        </Button>
      </div>
      {/* <div className="flex flex-col gap-4 items-center">
        <p className="pt-4">Ou acesse com:</p>
        <Button
          variant="default"
          className="w-10 h-10 p-0 flex items-center justify-center rounded-full"
        >
          <Image
            src="/icons/google.svg"
            width={24}
            height={24}
            alt="logar com google"
          />
        </Button>
      </div> */}
    </div>
  );
}
