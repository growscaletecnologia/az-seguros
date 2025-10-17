// 'use client'

// import { MessageCircleMore } from "lucide-react";
// import React, { useState } from "react";
// import {
//   MessageBox,
//   Input,
//   Button
// } from "react-chat-elements";
// import "react-chat-elements/dist/main.css";

// type TextMessage = {
//   position: "left" | "right";
//   type: "text";
//   text: string | Element;
//   date: Date;
// };

// export default function ChatWidget() {
//   const [open, setOpen] = useState(false);
//   const [mode, setMode] = useState<"default" | "cotacao" | "destino">("default");
//   const [messages, setMessages] = useState<TextMessage[]>([
//     {
//       position: "left",
//       type: "text",
//       text: "Olá! 👋 Como posso te ajudar hoje?",
//       date: new Date(),
//     },
//   ]);
//   const [text, setText] = useState("");

//   const addMessage = (msg: TextMessage) =>
//     setMessages((prev) => [...prev, msg]);

//   const sendMessage = () => {
//     const cleanText = text.trim();
//     if (!cleanText) return;

//     const userMsg: TextMessage = {
//       position: "right",
//       type: "text",
//       text: cleanText,
//       date: new Date(),
//     };

//     addMessage(userMsg);
//     setText("");

//     // 👇 Fluxo inteligente simples
//     if (/cot[aç]?[aã]o|seguro|pre[çc]o/i.test(cleanText)) {
//       setMode("cotacao");
//       setTimeout(() => {
//         addMessage({
//           position: "left",
//           type: "text",
//           text: (
//             <div>
//               <p>Perfeito! 🚀 Deseja iniciar uma cotação agora?</p>
//               <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
//                 <button
//                   onClick={() => handleCotacaoYes()}
//                   style={btnStyle}
//                 >
//                   Sim
//                 </button>
//                 <button
//                   onClick={() => handleCotacaoNo()}
//                   style={{ ...btnStyle, backgroundColor: "#6c757d" }}
//                 >
//                   Não
//                 </button>
//               </div>
//             </div>
//           ),
//           date: new Date(),
//         });
//       }, 600);
//     } else {
//       setTimeout(() => {
//         addMessage({
//           position: "left",
//           type: "text",
//           text: "Entendi! Posso te ajudar a fazer uma cotação, se quiser. 😉",
//           date: new Date(),
//         });
//       }, 600);
//     }
//   };

//   const handleCotacaoYes = () => {
//     setMode("destino");
//     addMessage({
//       position: "left",
//       type: "text",
//       text: "Ótimo! ✈️ Qual é o destino da viagem?",
//       date: new Date(),
//     });
//   };

//   const handleCotacaoNo = () => {
//     setMode("default");
//     addMessage({
//       position: "left",
//       type: "text",
//       text: "Tudo bem! Se mudar de ideia, é só digitar *cotação*. 😄",
//       date: new Date(),
//     });
//   };

//   // 👇 Etapa 2 – resposta para destino
//   const handleDestino = (cleanText: string) => {
//     addMessage({
//       position: "right",
//       type: "text",
//       text: cleanText,
//       date: new Date(),
//     });
//     setTimeout(() => {
//       addMessage({
//         position: "left",
//         type: "text",
//         text: `Excelente! 🌍 Viagem para ${cleanText}. Quer que eu calcule agora?`,
//         date: new Date(),
//       });
//     }, 600);
//     setMode("default");
//   };

//   return (
//     <>
//       {/* Botão flutuante */}
//       <div
//         onClick={() => setOpen(!open)}
//         style={{
//           position: "fixed",
//           bottom: "20px",
//           right: "20px",
//           width: "60px",
//           height: "60px",
//           borderRadius: "50%",
//           backgroundColor: "#007bff",
//           color: "white",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           cursor: "pointer",
//           boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
//           zIndex: 9999,
//           fontSize: "28px",
//         }}
//       >
//         <MessageCircleMore className="size-8" />
//       </div>

//       {/* Janela de chat */}
//       {open && (
//         <div
//           style={{
//             position: "fixed",
//             bottom: "90px",
//             right: "20px",
//             width: "350px",
//             height: "450px",
//             backgroundColor: "white",
//             borderRadius: "12px",
//             boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
//             overflow: "hidden",
//             zIndex: 9998,
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: "#007bff",
//               color: "white",
//               padding: "10px",
//               textAlign: "center",
//               fontWeight: "bold",
//             }}
//           >
//             Suporte AZ Seguros
//           </div>

//           <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
//             {messages.map((msg, index) => (
//               <MessageBox
//                 key={index}
//                 position={msg.position}
//                 type="text"
//                 text={msg.text}
//                 date={msg.date}
//               />
//             ))}
//           </div>

//           <div style={{ display: "flex", padding: "10px" }}>
//             <Input
//               placeholder="Digite sua mensagem..."
//               multiline={false}
//               maxHeight={60}
//               value={text}
//               onChange={(e: any) => setText(e.target.value)}
//               rightButtons={
//                 <Button
//                   color="white"
//                   backgroundColor="#007bff"
//                   text="Enviar"
//                   onClick={() => {
//                     if (mode === "destino") {
//                       handleDestino(text.trim());
//                       setText("");
//                     } else {
//                       sendMessage();
//                     }
//                   }}
//                 />
//               }
//             />
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// const btnStyle: React.CSSProperties = {
//   backgroundColor: "#007bff",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   padding: "6px 12px",
//   cursor: "pointer",
// };

"use client";

import { MessageCircleMore } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button, Input, MessageBox } from "react-chat-elements";
import "react-chat-elements/dist/main.css";

type TextMessage = {
	position: "left" | "right";
	type: "text";
	text: string | JSX.Element;
	date: Date;
};

export default function ChatWidget() {
	const [open, setOpen] = useState(false);
	const [mode, setMode] = useState<"default" | "cotacao" | "destino">(
		"default",
	);
	const [messages, setMessages] = useState<TextMessage[]>([
		{
			position: "left",
			type: "text",
			text: "Olá! 👋 Como posso te ajudar hoje?",
			date: new Date(),
		},
	]);
	const [text, setText] = useState("");

	const addMessage = (msg: TextMessage) =>
		setMessages((prev) => [...prev, msg]);

	const showTyping = (callback: () => void, delay = 1200) => {
		const typingMsg: TextMessage = {
			position: "left",
			type: "text",
			text: <TypingIndicator />,
			date: new Date(),
		};
		addMessage(typingMsg);

		setTimeout(() => {
			setMessages((prev) => prev.filter((m) => m.text !== typingMsg.text));
			callback();
		}, delay);
	};

	const sendMessage = () => {
		const cleanText = text.trim();
		if (!cleanText) return;

		const userMsg: TextMessage = {
			position: "right",
			type: "text",
			text: cleanText,
			date: new Date(),
		};

		addMessage(userMsg);
		setText("");

		if (/cot[aç]?[aã]o|seguro|pre[çc]o/i.test(cleanText)) {
			setMode("cotacao");
			showTyping(() => {
				addMessage({
					position: "left",
					type: "text",
					text: (
						<div>
							<p>Perfeito! 🚀 Deseja iniciar uma cotação agora?</p>
							<div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
								<button onClick={() => handleCotacaoYes()} style={btnStyle}>
									Sim
								</button>
								<button
									onClick={() => handleCotacaoNo()}
									style={{ ...btnStyle, backgroundColor: "#6c757d" }}
								>
									Não
								</button>
							</div>
						</div>
					),
					date: new Date(),
				});
			});
		} else {
			showTyping(() => {
				addMessage({
					position: "left",
					type: "text",
					text: "Entendi! Posso te ajudar a fazer uma cotação, se quiser. 😉",
					date: new Date(),
				});
			});
		}
	};

	const handleCotacaoYes = () => {
		setMode("destino");
		showTyping(() => {
			addMessage({
				position: "left",
				type: "text",
				text: "Ótimo! ✈️ Qual é o destino da viagem?",
				date: new Date(),
			});
		});
	};

	const handleCotacaoNo = () => {
		setMode("default");
		showTyping(() => {
			addMessage({
				position: "left",
				type: "text",
				text: "Tudo bem! Se mudar de ideia, é só digitar *cotação*. 😄",
				date: new Date(),
			});
		});
	};

	const handleDestino = (cleanText: string) => {
		addMessage({
			position: "right",
			type: "text",
			text: cleanText,
			date: new Date(),
		});
		showTyping(() => {
			addMessage({
				position: "left",
				type: "text",
				text: `Excelente! 🌍 Viagem para ${cleanText}. Quer que eu calcule agora?`,
				date: new Date(),
			});
		});
		setMode("default");
	};

	return (
		<>
			{/* Botão flutuante */}
			<div
				onClick={() => setOpen(!open)}
				style={{
					position: "fixed",
					bottom: "20px",
					right: "20px",
					width: "60px",
					height: "60px",
					borderRadius: "50%",
					backgroundColor: "#007bff",
					color: "white",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					cursor: "pointer",
					boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
					zIndex: 9999,
					fontSize: "28px",
				}}
			>
				<MessageCircleMore className="size-8" />
			</div>

			{/* Janela de chat */}
			{open && (
				<div
					style={{
						position: "fixed",
						bottom: "90px",
						right: "20px",
						width: "350px",
						height: "450px",
						backgroundColor: "white",
						borderRadius: "12px",
						boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
						overflow: "hidden",
						zIndex: 9998,
						display: "flex",
						flexDirection: "column",
					}}
				>
					<div
						style={{
							backgroundColor: "#007bff",
							color: "white",
							padding: "10px",
							textAlign: "center",
							fontWeight: "bold",
						}}
					>
						Suporte AZ Seguros
					</div>

					<div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
						{messages.map((msg, index) => (
							<MessageBox
								key={index}
								position={msg.position}
								type="text"
								text={msg.text}
								date={msg.date}
							/>
						))}
					</div>

					<div style={{ display: "flex", padding: "10px" }}>
						<Input
							placeholder="Digite sua mensagem..."
							multiline={false}
							maxHeight={60}
							value={text}
							onChange={(e: any) => setText(e.target.value)}
							onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault(); // evita quebra de linha
									if (mode === "destino") {
										handleDestino(text.trim());
										setText("");
									} else {
										sendMessage();
									}
								}
							}}
							rightButtons={
								<Button
									color="white"
									backgroundColor="#007bff"
									text="Enviar"
									onClick={() => {
										if (mode === "destino") {
											handleDestino(text.trim());
											setText("");
										} else {
											sendMessage();
										}
									}}
								/>
							}
						/>
					</div>
				</div>
			)}
		</>
	);
}

const btnStyle: React.CSSProperties = {
	backgroundColor: "#007bff",
	color: "white",
	border: "none",
	borderRadius: "6px",
	padding: "6px 12px",
	cursor: "pointer",
};

const TypingIndicator = () => (
	<div
		style={{
			display: "flex",
			alignItems: "center",
			gap: "4px",
			padding: "4px 0",
		}}
	>
		<div className="dot" style={dotStyle}></div>
		<div className="dot" style={dotStyle}></div>
		<div className="dot" style={dotStyle}></div>
		<style jsx>{`
      @keyframes blink {
        0% { opacity: 0.2; }
        20% { opacity: 1; }
        100% { opacity: 0.2; }
      }
      .dot {
        animation: blink 1.4s infinite both;
      }
      .dot:nth-child(2) {
        animation-delay: 0.2s;
      }
      .dot:nth-child(3) {
        animation-delay: 0.4s;
      }
    `}</style>
	</div>
);

const dotStyle: React.CSSProperties = {
	width: "6px",
	height: "6px",
	backgroundColor: "#999",
	borderRadius: "50%",
};
