"use client";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cva } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeftCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LoginCard, LoginForm, LoginRegister } from "./_components";

export default function Login() {
	const [step, setStep] = useState<"initial" | "form" | "register">("initial");
	const isMobile = useIsMobile();
	const backgroundImage = `url(/${process.env.NEXT_PUBLIC_CUSTOMER}/${
		process.env.NEXT_PUBLIC_CUSTOMER
	}/background-${isMobile ? "sm" : "lg"}.webp)`;

	const handleStep = () => {
		const goToNextStep = () => {
			setStep("form");
		};
		const goToBackStep = () => {
			setStep("initial");
		};
		return { goToBackStep, goToNextStep };
	};

	const { goToBackStep, goToNextStep } = handleStep();

	const loginFormsVariant = cva(
		"bg-background items-center px-8 lg:px-12 pt-8  pb-8 lg:pb-16  gap-y-4 lg:gap-y-6 flex flex-col absolute bottom-0 left-0 w-full rounded-t-2xl lg:translate-y-1/2 lg:bottom-1/2 lg:left-1/2 lg:max-w-lg lg:rounded-xl lg:shadow-2xl",
	);

	return (
		<div>
			<div className="min-h-svh w-full relative overflow-hidden bg-gradient-to-br from-sky-600 via-blue-300 to-purple-400">
				<Button
					variant="secondary"
					className="flex hover:bg-default hover:text-default relative left-6 top-6 shadow-sm w-14 h-14 items-center justify-center rounded-full  z-10"
					asChild
				>
					<Link href={"/"}>
						<ChevronLeftCircle className="!w-8 !h-8 z-11" />
					</Link>
				</Button>

				<div>
					<AnimatePresence mode="wait">
						{step === "initial" && (
							<motion.div
								key="initial"
								className="absolute inset-0"
								initial={{ opacity: 0, y: 25 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 25 }}
								transition={{ duration: 0.1 }}
							>
								<LoginCard
									goToNextStep={goToNextStep}
									className={`${loginFormsVariant()}`}
								/>
							</motion.div>
						)}
						{step === "form" && (
							<motion.div
								key="form"
								className="absolute inset-0"
								initial={{ opacity: 0, y: 25 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 25 }}
								transition={{ duration: 0.1 }}
							>
								<LoginForm
									goToBackStep={goToBackStep}
									className={`${loginFormsVariant()}`}
								/>
							</motion.div>
						)}
						{step === "register" && (
							<motion.div
								key="initial"
								className="absolute inset-0"
								initial={{ opacity: 0, y: 25 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 25 }}
								transition={{ duration: 0.1 }}
							>
								<LoginRegister
									goToBackStep={goToBackStep}
									className={`${loginFormsVariant()}`}
								/>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}
