"use client";
import {
	ClipboardCheck,
	File,
	FileText,
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
import LinkWithTooltip from "../linkWithTooltip";

import LogoWhite from "@/assets/logo-special-branca.webp";
import LogoBlack from "@/assets/logo-special-preta.webp";

import Image from "next/image";
import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { useTheme } from "next-themes";
import { DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface SidebarLinkElProps {
	icon: any;
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

const SidebarLinks = () => {
	const { theme } = useTheme();

	return (
		<div>
			{/* <Pipette /> */}
			<Link href={"/admin/"}>
				<Image
					alt="Logo Special Paraná"
					src={theme === "dark" ? LogoWhite : LogoBlack}
					className="cursor-pointer p-3 w-full"
				/>
				<Separator />
			</Link>
			<nav className="flex flex-col gap-4 px-2 sm:py-5">
				<LinkWithTooltip
					href={"/admin/"}
					icon={<Home className="h-5 w-5" />}
					text="Dashboard"
				/>
				<LinkWithTooltip
					href={"/admin/users"}
					icon={<Users2 className="h-5 w-5" />}
					text="Usuários"
				/>
				<LinkWithTooltip
					href={"/admin/profiles"}
					icon={<ClipboardCheck className="h-5 w-5" />}
					text="Perfis"
				/>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<div>
							<LinkWithTooltip
								href="#"
								icon={<Pin className="h-5 w-5" />}
								text="Publicações"
							/>
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-[200px]" side="right" align="start">
						<SideBarLinkEl
							link="/admin/blog/"
							text="Todos os Posts"
							icon={<ListIcon className="h-4 w-4" />}
						/>
						<SideBarLinkEl
							link="/admin/blog/novo"
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

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<div>
							<LinkWithTooltip
								href="#"
								icon={<FileText className="h-5 w-5" />}
								text="Páginas"
							/>
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-[200px]" side="right" align="start">
						<SideBarLinkEl
							link="/admin/pages/"
							text="Todas as Páginas"
							icon={<ListIcon className="h-4 w-4" />}
						/>
						<SideBarLinkEl
							link="/admin/pages/nova"
							text="Adicionar Nova Página"
							icon={<PlusIcon className="h-4 w-4" />}
						/>
					</DropdownMenuContent>
				</DropdownMenu>

				<LinkWithTooltip
					href="#"
					icon={<ShoppingCart className="h-5 w-5" />}
					text="Reservas"
				/>
				<LinkWithTooltip
					href="#"
					icon={<Package2 className="h-5 w-5" />}
					text="Clientes"
				/>
				<LinkWithTooltip
					href="/admin/settings"
					icon={<Settings className="h-5 w-5" />}
					text="Configurações"
				/>
			</nav>
		</div>
	);
};

export default SidebarLinks;
