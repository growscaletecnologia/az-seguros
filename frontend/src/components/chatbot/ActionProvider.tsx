import { createChatBotMessage } from "react-chatbot-kit";

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleCotacao() {
    const message = this.createChatBotMessage(
      "Perfeito! Clique abaixo para iniciar sua cotação.",
      {
        widget: "cotacaoButton",
      }
    );
    this.addMessage(message);
  }

  handleDefault(userMessage) {
    const message = this.createChatBotMessage(
      `Entendi! Você disse: "${userMessage}". Quer fazer uma cotação?`,
      {
        widget: "cotacaoButton",
      }
    );
    this.addMessage(message);
  }

  addMessage(message: string | object) {
  const botMessage =
    typeof message === "string"
      ? this.createChatBotMessage(message)
      : message;

  this.setState((prev) => ({
    ...prev,
    messages: [...prev.messages, botMessage],
  }));
}

}

export default ActionProvider;
