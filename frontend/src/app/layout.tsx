import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

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
			<body className={inter.className}>
				<Header />
				<main className="min-h-screen pt-16">{children}</main>
				<Footer />
			</body>
		</html>
	);
}
