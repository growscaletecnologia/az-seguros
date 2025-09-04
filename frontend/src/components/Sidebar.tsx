"use client";

import {
	ClipboardCheck,
	Home,
	ListIcon,
	Package2,
	Pin,
	PlusIcon,
	Settings,
	ShoppingCart,
	TagIcon,
	Users2,
} from "lucide-react";

import LogoWhite from "@/assets/logo-special-branca.webp";
import LogoBlack from "@/assets/logo-special-preta.webp";

import Image from "next/image";
import Link from "next/link";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface SidebarLinkElProps {
	icon: React.ReactNode;
	link: string;
	text: string;
}

const SideBarLinkEl = ({ icon, link, text }: SidebarLinkElProps) => {
	return (
		<Link href={link}>
			<li
				className={cn(
					"relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ",
					"flex items-center gap-2",
				)}
			>
				{icon}
				{text}
			</li>
		</Link>
	);
};

const SidebarLink = ({
	href,
	icon,
	text,
}: {
	href: string;
	icon: React.ReactNode;
	text: string;
}) => {
	return (
		<TooltipProvider delayDuration={300}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Link
						href={href}
						className="flex items-center gap-2 px-2 py-1.5 rounded-sm text-sm hover:bg-accent hover:text-accent-foreground"
					>
						{icon}
						<span>{text}</span>
					</Link>
				</TooltipTrigger>
				<TooltipContent side="right">
					<p>{text}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

const SidebarLinks = () => {
	const { theme } = useTheme();

	return (
		<div>
			<Link href={"/admin/"}>
				<Image
					alt="Logo Special Paraná"
					src={theme === "dark" ? LogoWhite : LogoBlack}
					className="cursor-pointer p-3 w-full"
				/>
				<Separator />
			</Link>
			<nav className="flex flex-col gap-4 px-2 sm:py-5">
				<SidebarLink
					href={"/admin/"}
					icon={<Home className="h-5 w-5" />}
					text="Dashboard"
				/>
				<SidebarLink
					href={"/admin/users"}
					icon={<Users2 className="h-5 w-5" />}
					text="Usuários"
				/>
				<SidebarLink
					href={"/admin/profiles"}
					icon={<ClipboardCheck className="h-5 w-5" />}
					text="Perfis"
				/>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<div>
							<SidebarLink
								href="#"
								icon={<Pin className="h-5 w-5" />}
								text="Publicações"
							/>
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-[200px]" side="right" align="start">
						<SideBarLinkEl
							link="/admin/posts/"
							text="Todos os Posts"
							icon={<ListIcon className="h-4 w-4" />}
						/>
						<SideBarLinkEl
							link="/admin/posts/create"
							text="Adicionar Novo Post"
							icon={<PlusIcon className="h-4 w-4" />}
						/>
						<SideBarLinkEl
							link="/admin/categories"
							text="Categorias"
							icon={<TagIcon className="h-4 w-4" />}
						/>
						<SideBarLinkEl
							link="/admin/tags"
							text="Tags"
							icon={<TagIcon className="h-4 w-4" />}
						/>
					</DropdownMenuContent>
				</DropdownMenu>

				<SidebarLink href="#" icon={<ShoppingCart className="h-5 w-5" />} text="Reservas" />
				<SidebarLink href="#" icon={<Package2 className="h-5 w-5" />} text="Clientes" />
				<SidebarLink
					href="/admin/settings"
					icon={<Settings className="h-5 w-5" />}
					text="Configurações"
				/>
			</nav>
		</div>
	);
};

export default SidebarLinks;
