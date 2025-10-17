export default function CotacaoButton() {
	return (
		<div style={{ marginTop: "10px" }}>
			<button
				onClick={() => (window.location.href = "/cotacao")}
				style={{
					backgroundColor: "#007bff",
					color: "white",
					border: "none",
					borderRadius: "8px",
					padding: "8px 16px",
					cursor: "pointer",
				}}
			>
				Iniciar Cotação 🚀
			</button>
		</div>
	);
}
