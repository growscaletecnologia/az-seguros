import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface LoginRegisterProps extends React.ComponentProps<"div"> {
	goToBackStep: () => void;
}

export function LoginRegister({
	className,
	goToBackStep,
	...props
}: LoginRegisterProps) {
	return (
		<div className={className} {...props}>
			{/* <h1 className="text-4xl text-center my-3 font-medium">
				Fique por dentro da cultura de sua cidade!
			</h1> */}
			{/* <h2 className="text-2xl mb-2">Como deseja continuar?</h2> */}
			<div className="w-full">
				<div className="flex flex-col gap-4 w-full">
					<Input className="w-full" />
					<Input className="w-full" />
				</div>
				{/* <Button asChild effect={"hoverUnderline"} variant={"link"}>
					<Link href={"/"} className="w-fit">
						Esqueci minha senha
					</Link>
				</Button> */}
			</div>
			<div className="flex gap-4 w-full items-center flex-col">
				<Button className="w-full">Entrar</Button>
				<Button className="w-full" onClick={goToBackStep}>
					Voltar
				</Button>
			</div>
		</div>
	);
}
