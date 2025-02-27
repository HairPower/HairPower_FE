import { useEffect, useState } from "react";
import "./App.css";
import Background from "./Background";
import ChattingScreen from "./screens/ChattingScreen";
import LoadingScreen from "./screens/LoadingScreen";
import ResultScreen from "./screens/ResultScreen";
import StartScreen from "./screens/StartScreen";
import StoryScreen from "./screens/StoryScreen";
import UploadScreen from "./screens/UploadScreen";

function App() {
	let data;
	// Screen state management
	const [currentScreen, setCurrentScreen] = useState("start");
	const [transitionDirection, setTransitionDirection] = useState("forward");
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [submissionResult, setSubmissionResult] = useState(null);
	const [userFeatures, setUserFeatures] = useState(null);
	const [error, setError] = useState(null);

	// 스토리 화면 표시 여부
	const [showStory, setShowStory] = useState(false);

	// User input states
	const [file, setFile] = useState(null);
	const [toggleValue, setToggleValue] = useState(false);

	// Screen order definition - Result와 Story 두 화면 모두 유지
	const screenOrder = ["start", "upload", "loading", "result", "chatting"];

	// Navigate to a specific screen
	const navigateTo = (screen) => {
		// Prevent navigation if already on target screen or during transition
		if (currentScreen === screen || isTransitioning) return;

		// Determine direction
		const currentIndex = screenOrder.indexOf(currentScreen);
		const targetIndex = screenOrder.indexOf(screen);
		const direction = targetIndex > currentIndex ? "forward" : "backward";

		// Start transition
		setIsTransitioning(true);
		setTransitionDirection(direction);

		// Change screen after a small delay
		setTimeout(() => {
			setCurrentScreen(screen);

			// End transition after animation completes
			setTimeout(() => {
				setIsTransitioning(false);
			}, 600);
		}, 50);
	};

	// 앱이 마운트된 후 초기 화면 설정
	useEffect(() => {
		const timer = setTimeout(() => {
			document.body.offsetHeight;
			setCurrentScreen("start");
		}, 100);

		return () => clearTimeout(timer);
	}, []);

	// Navigation functions
	const goToStart = () => navigateTo("start");
	const goToUpload = () => navigateTo("upload");
	const goToResult = () => {
		navigateTo("result");
		setShowStory(false); // 결과 화면으로 이동 시 스토리 닫기
	};
	const goToChat = () => navigateTo("chatting");

	// 스토리 표시/숨김 함수
	const openStory = () => setShowStory(true);
	const closeStory = () => setShowStory(false);

	// API 호출 및 로딩 처리를 포함한 함수
	const goToLoading = () => navigateTo("loading");

	// File handlers
	const handleFileChange = (newFile) => {
		setFile(newFile);
	};

	// 토글 상태 변경 핸들러
	const handleToggleChange = (newToggleValue) => {
		setToggleValue(newToggleValue);
	};

	const transitionToResult = () => {
		// Initial delay to build anticipation
		setTimeout(() => {
			// Transition to result screen
			navigateTo("result");

			// Optional: Add a subtle animation or loading effect
			const resultContainer = document.querySelector(".result-container");
			if (resultContainer) {
				resultContainer.classList.add("fade-in");
			}
		}, 1000); // 1-second delay as requested
	};
	const handleSubmit = async () => {
		if (!file || isTransitioning) return;

		goToLoading();
		setError(null);
		setIsTransitioning(true);

		try {
			const formData = new FormData();
			formData.append("gender", toggleValue ? "female" : "male");
			formData.append("image", file); // ✅ 'photo' → 'image'로 변경

			console.log("전송할 데이터:", {
				file: file.name,
				gender: toggleValue ? "female" : "male",
			});

			const response = await fetch(
				"http://54.180.120.177:8080/user/upload-photo",
				{
					method: "POST",
					body: formData,
					mode: "cors",
					credentials: "same-origin",
				}
			);

			console.log("서버 응답 상태:", response.status);

			if (!response.ok) {
				const errorText = await response.text();
				console.error("서버 에러 응답:", errorText);
				throw new Error(
					`HTTP error! status: ${response.status}, message: ${errorText}`
				);
			}

			const data = await response.json();
			console.log("서버 응답 데이터:", data);

			setSubmissionResult(data);
			setUserFeatures(data.userFeatures);

			setIsTransitioning(false);
			transitionToResult();

			setTimeout(() => {
				openStory();
			}, 1700);
		} catch (err) {
			console.error("전체 업로드 오류:", err);
			console.error("오류 타입:", err.name);
			console.error("오류 메시지:", err.message);

			setError(err.message || "서버와 통신 중 오류가 발생했습니다.");

			setIsTransitioning(false);
			setTimeout(resetUpload, 100);
		}
	};

	const resetUpload = () => {
		setFile(null);
		goToUpload();
	};

	// 스토리에서 결과 화면으로 돌아가는 함수
	const handleStoryComplete = () => {
		closeStory(); // 스토리 닫기만 하고 결과 화면은 이미 표시되어 있음
	};

	// Determine screen position class
	const getScreenClass = (screenName) => {
		if (screenName === currentScreen) {
			return "screen screen-active";
		}

		const currentIndex = screenOrder.indexOf(currentScreen);
		const screenIndex = screenOrder.indexOf(screenName);

		if (transitionDirection === "forward") {
			return screenIndex < currentIndex
				? "screen screen-left"
				: "screen screen-right";
		} else {
			return screenIndex < currentIndex
				? "screen screen-left"
				: "screen screen-right";
		}
	};

	return (
		<div className="app-container">
			{/* Background */}
			<div className="background-container">
				<Background />
			</div>

			{/* Screen container */}
			<div className="screens-container">
				{/* All screens */}
				<StartScreen
					className={getScreenClass("start")}
					onStartClick={goToUpload}
				/>

				<UploadScreen
					className={getScreenClass("upload")}
					file={file}
					onFileChange={handleFileChange}
					toggleValue={toggleValue}
					onToggleChange={handleToggleChange}
					onSubmit={handleSubmit}
					onBackClick={goToStart}
				/>

				<LoadingScreen className={getScreenClass("loading")} />

				<ResultScreen
					className={getScreenClass("result")}
					file={file}
					gender={toggleValue}
					submissionResult={submissionResult}
					onBackClick={resetUpload}
					onChatClick={goToChat}
					onStoryClick={openStory} // 스토리 다시 보기 기능
				/>

				<ChattingScreen
					className={getScreenClass("chatting")}
					onBackClick={goToResult}
				/>
			</div>

			{/* Story Screen (overlay) */}
			{showStory && (
				<StoryScreen
					className="story-overlay"
					onBackClick={closeStory}
					onComplete={handleStoryComplete}
					analysisData={submissionResult}
					userFeatures={userFeatures}
				/>
			)}
		</div>
	);
}

export default App;
