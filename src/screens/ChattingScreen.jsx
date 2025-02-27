import { ArrowLeft, Send, StopCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import "./ChattingScreen.css";

// API 기본 설정
const API_BASE_URL = "http://54.180.120.177:8080"; // 실제 백엔드 API URL로 변경해주세요

// AI 서비스 인터페이스
const AIService = {
	async generateResponse(messages, signal) {
		try {
			// 실제 API 호출
			const response = await fetch(`${API_BASE_URL}/chat/ask-ai`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: {
					user_id: 26,
					message: "DD",
				},
			});

			if (!response.ok) {
				throw new Error(`API 요청 실패: ${response.status}`);
			}

			const data = await response.json();
			return {
				role: "assistant",
				content:
					data.response ||
					"죄송합니다, 응답을 생성하는 중에 오류가 발생했습니다.",
			};
		} catch (error) {
			// AbortError는 사용자가 의도적으로 중단한 것이므로 별도 처리
			if (error.name === "AbortError") {
				console.log("사용자에 의해 응답 생성이 중단되었습니다.");
				return {
					role: "assistant",
					content: "응답 생성이 중단되었습니다.",
				};
			}

			console.error("API 요청 중 오류 발생:", error);
			throw error;
		}
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

	// 메시지가 변경되면 스크롤 실행
	useEffect(() => {
		scrollToBottom();
	}, [messages, scrollToBottom]);

	// 컴포넌트 마운트/언마운트 시 로깅 추가 (디버깅용)
	useEffect(() => {
		console.log("ChattingScreen 마운트됨, className:", className);

		return () => {
			console.log("ChattingScreen 언마운트됨");
			// 컴포넌트 언마운트 시 진행 중인 요청 취소
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, [className]);

	const handleSendMessage = async (userText) => {
		// 사용자 메시지 생성
		const userMessage = {
			role: "user",
			content: userText,
		};

		// 사용자 메시지를 채팅 목록에 추가
		const updatedMessages = [...messages, userMessage];
		setMessages(updatedMessages);
		setIsProcessing(true);

		try {
			// 사용자 메시지를 서버에 별도로 전송 (로깅 및 분석 목적)
			await AIService.sendUserMessage(userMessage);

			// AI 응답 생성을 위한 AbortController 설정
			abortControllerRef.current = new AbortController();

			// AI 응답 요청
			const aiResponse = await AIService.generateResponse(
				updatedMessages,
				abortControllerRef.current.signal
			);

			// AI 응답을 채팅 목록에 추가
			setMessages((prev) => [...prev, aiResponse]);

			// 스크롤 자동으로 맨 아래로 이동
			setTimeout(scrollToBottom, 100);
		} catch (error) {
			console.error("AI 응답 생성 중 오류:", error);
			// 오류 발생 시 사용자에게 알림
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content:
						"죄송합니다. 응답을 생성하는 중에 문제가 발생했습니다. 다시 시도해주세요.",
				},
			]);
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
