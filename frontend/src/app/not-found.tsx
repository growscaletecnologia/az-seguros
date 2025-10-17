import UnavailableContent from "@/components/UnavailableContent";

/**
 * Página padrão para rotas não encontradas (404)
 * Utiliza o componente UnavailableContent para exibir uma mensagem amigável
 */
export default function NotFound() {
	return (
		<UnavailableContent
			title="Página não encontrada"
			message="A página que você está procurando não existe ou foi removida."
			showHomeButton={true}
			showBackButton={true}
		/>
	);
}
