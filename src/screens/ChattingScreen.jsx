import { ArrowLeft, Send, StopCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import "./ChattingScreen.css";

// AI 서비스 인터페이스
const AIService = {
	async generateResponse(messages) {
		// 실제 API 호출 대신 가상의 응답을 생성하는 함수
		return new Promise((resolve) => {
			// 1~3초 사이의 랜덤한 시간 후에 응답 반환 (실제 API 호출 시뮬레이션)
			setTimeout(() => {
				resolve({
					role: "assistant",
					content:
						"안녕하세요! 분석 결과에 대해 어떤 도움이 필요하신가요? 자세한 설명이나 추가 질문이 있으시면 말씀해주세요.",
				});
			}, 1000 + Math.random() * 2000);
		});
	},
};

// 채팅 입력 컴포넌트
const ChatInput = ({ onSendMessage, isProcessing, onStopGeneration }) => {
	const [inputText, setInputText] = useState("");

	const handleSendMessage = () => {
		if (inputText.trim() && !isProcessing) {
			onSendMessage(inputText);
			setInputText("");
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	return (
		<div className="chat-input-container">
			<div className="input-wrapper">
				<input
					type="text"
					value={inputText}
					onChange={(e) => setInputText(e.target.value)}
					onKeyPress={handleKeyPress}
					placeholder="메시지를 입력하세요..."
					disabled={isProcessing}
				/>
			</div>
			<div className="input-actions">
				{isProcessing ? (
					<button
						onClick={onStopGeneration}
						className="stop-generation-button"
					>
						<StopCircle size={18} />
						<span>중지</span>
					</button>
				) : (
					<button
						onClick={handleSendMessage}
						disabled={!inputText.trim()}
						className="send-message-button"
					>
						<Send size={18} />
					</button>
				)}
			</div>
		</div>
	);
};

// 채팅 메시지 컴포넌트
const ChatMessage = ({ message }) => {
	const isUser = message.role === "user";

	return (
		<div
			className={`chat-message ${
				isUser ? "user-message" : "assistant-message"
			}`}
		>
			<div className="message-content">{message.content}</div>
		</div>
	);
};

// 메인 ChattingScreen 컴포넌트
const ChattingScreen = ({ className, onBackClick }) => {
	const [messages, setMessages] = useState([
		{
			role: "assistant",
			content:
				"안녕하세요! 분석 결과에 대해 질문이 있으시면 도와드리겠습니다.",
		},
	]);
	const [isProcessing, setIsProcessing] = useState(false);
	const messagesEndRef = useRef(null);
	const abortControllerRef = useRef(null);

	// 스크롤 함수 수정 - 조건부 실행을 위해 className을 의존성 배열에 추가
	const scrollToBottom = useCallback(() => {
		// 실제로 현재 컴포넌트가 화면에 표시될 때만 스크롤 실행
		if (
			messagesEndRef.current &&
			className &&
			className.includes("screen-active")
		) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [className]);

	// 메시지가 변경되거나 활성화 상태가 변경될 때만 스크롤 수행
	useEffect(() => {
		// 컴포넌트가 활성화된 상태일 때만 스크롤 수행
		if (className && className.includes("screen-active")) {
			console.log("채팅 화면이 활성화되어 스크롤 실행");
			scrollToBottom();
		} else {
			console.log("채팅 화면이 비활성화 상태이므로 스크롤 건너뜀");
		}
	}, [messages, scrollToBottom, className]);

	// 컴포넌트 마운트/언마운트 시 로깅 추가 (디버깅용)
	useEffect(() => {
		console.log("ChattingScreen 마운트됨, className:", className);

		return () => {
			console.log("ChattingScreen 언마운트됨");
		};
	}, [className]);

	const handleSendMessage = async (userText) => {
		// 사용자 메시지 추가
		const userMessage = {
			role: "user",
			content: userText,
		};

		const updatedMessages = [...messages, userMessage];
		setMessages(updatedMessages);
		setIsProcessing(true);

		// AI 응답 생성을 위한 AbortController 설정
		abortControllerRef.current = new AbortController();

		try {
			const aiResponse = await AIService.generateResponse(
				updatedMessages
			);

			setMessages((prev) => [...prev, aiResponse]);
		} catch (error) {
			console.error("AI 응답 생성 중 오류:", error);
		} finally {
			setIsProcessing(false);
		}
	};

	const handleStopGeneration = () => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
			setIsProcessing(false);
		}
	};

	const handleReset = () => {
		setMessages([
			{
				role: "assistant",
				content:
					"안녕하세요! 분석 결과에 대해 질문이 있으시면 도와드리겠습니다.",
			},
		]);
	};

	return (
		<div className={`screen chatting-screen ${className}`}>
			<div className="chat-container">
				<div className="chat-header">
					<button onClick={onBackClick} className="back-button">
						<ArrowLeft size={18} />
						<span>결과로 돌아가기</span>
					</button>
				</div>

				<div className="messages-container">
					{messages.map((message, index) => (
						<ChatMessage key={index} message={message} />
					))}
					{/* messagesEndRef는 유지하되, 화면이 활성화되었을 때만 scrollIntoView가 실행되도록 수정됨 */}
					<div ref={messagesEndRef} />
				</div>

				<ChatInput
					onSendMessage={handleSendMessage}
					isProcessing={isProcessing}
					onStopGeneration={handleStopGeneration}
				/>
			</div>
		</div>
	);
};

export default ChattingScreen;
