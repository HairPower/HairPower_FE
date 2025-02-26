import { useEffect, useState } from "react";
import "./App.css";
import Background from "./Background";
import ChattingScreen from "./screens/ChattingScreen";
import LoadingScreen from "./screens/LoadingScreen";
import ResultScreen from "./screens/ResultScreen";
import StartScreen from "./screens/StartScreen";
import StoryScreen from "./screens/StoryScreen"; // 스토리 스크린 컴포넌트
import UploadScreen from "./screens/UploadScreen";

function App() {
	// Screen state management
	const [currentScreen, setCurrentScreen] = useState("start");
	const [transitionDirection, setTransitionDirection] = useState("forward");
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [submissionResult, setSubmissionResult] = useState(null);

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

	// Special case for loading screen with auto-advance
	const goToLoading = () => {
		navigateTo("loading");
		setTimeout(() => {
			// 결과 데이터 설정
			setSubmissionResult({
				status: "성공",
				type: "음성 분석",
				fileName: file ? file.name : "알 수 없음",
				gender: toggleValue ? "여성" : "남성",
				결과: "분석이 완료되었습니다.",
				세부사항: {
					신뢰도: "83%",
					추천사항: "후속 분석 권장",
				},
			});

			// 전환 중이 아닌 경우에만 스토리 화면으로 전환
			if (!isTransitioning) {
				navigateTo("result"); // 결과 화면으로 이동
				// 결과 화면 로드 후 스토리 자동 표시
				setTimeout(() => {
					openStory();
				}, 700); // 화면 전환 애니메이션 이후에 표시
			}
		}, 5000);
	};

	// File handlers
	const handleFileChange = (newFile) => {
		setFile(newFile);
	};

	// 토글 상태 변경 핸들러
	const handleToggleChange = (newToggleValue) => {
		setToggleValue(newToggleValue);
	};

	const handleSubmit = () => {
		if (file && !isTransitioning) {
			goToLoading();
		} else {
			console.warn("제출 조건 미충족", {
				fileExists: !!file,
				isNotTransitioning: !isTransitioning,
			});
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
					isTransitioning={isTransitioning}
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
				/>
			)}
		</div>
	);
}

export default App;
