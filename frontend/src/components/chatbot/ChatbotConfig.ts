import { createChatBotMessage } from "react-chatbot-kit";

const ChatbotConfig = {
	botName: "Assistente AZ",
	initialMessages: [
		createChatBotMessage(
			"Olá! 👋 Eu sou a assistente da AZ Seguros. Quer iniciar uma cotação?",
		),
	],
	customStyles: {
		botMessageBox: { backgroundColor: "#007bff" },
		chatButton: { backgroundColor: "#007bff" },
	},
};

export default ChatbotConfig;
