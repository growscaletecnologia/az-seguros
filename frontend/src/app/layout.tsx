import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientGtmScripts from "@/components/ClientGtmScripts";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ChatWidget from "@/components/chatbot/Chat";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "SeguroViagem - Compare e Contrate o Melhor Seguro de Viagem",
	description:
		"Plataforma completa para comparar preços e contratar seguros de viagem. Melhor preço garantido, suporte 24h e compra 100% segura.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="pt-BR">
			<head>
				<ClientGtmScripts />
			</head>
			<body className={inter.className}>
				<Header />
				<main className="min-h-screen pt-16">{children}</main>
				<ChatWidget />
				<Footer />
				<Toaster position="top-right" richColors />
			</body>
		</html>
	);
}
