import { useEffect, useState } from "react";
import "./App.css";
import Background from "./Background";
import ChattingScreen from "./screens/ChattingScreen";
import LoadingScreen from "./screens/LoadingScreen";
import ResultScreen from "./screens/ResultScreen";
import StartScreen from "./screens/StartScreen";
import UploadScreen from "./screens/UploadScreen";

function App() {
	// Screen state management with a single current screen
	const [currentScreen, setCurrentScreen] = useState("start");
	const [transitionDirection, setTransitionDirection] = useState("forward");
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [submissionResult, setSubmissionResult] = useState(null);

	// User input states
	const [file, setFile] = useState(null);
	const [toggleValue, setToggleValue] = useState(false); // 토글 상태 추가

	// Screen order definition
	const screenOrder = ["start", "upload", "loading", "result", "chatting"];

	// Navigate to a specific screen
	const navigateTo = (screen) => {
		// Prevent navigation if already on target screen or during transition
		if (currentScreen === screen || isTransitioning) return;

		// Determine direction (forward or backward) based on screen order
		const currentIndex = screenOrder.indexOf(currentScreen);
		const targetIndex = screenOrder.indexOf(screen);
		const direction = targetIndex > currentIndex ? "forward" : "backward";

		// Start transition
		setIsTransitioning(true);
		setTransitionDirection(direction);

		// Change screen after a small delay (for browser rendering)
		setTimeout(() => {
			setCurrentScreen(screen);

			// End transition after animation completes
			setTimeout(() => {
				setIsTransitioning(false);
			}, 600); // Match CSS transition duration
		}, 50);
	};

	// 앱이 마운트된 후 초기 화면 설정
	useEffect(() => {
		// DOM이 완전히 렌더링된 후 화면 상태 설정
		const timer = setTimeout(() => {
			// 강제 리플로우로 브라우저 렌더링 동기화
			document.body.offsetHeight;

			// 모든 화면이 정확한 초기 위치에 있도록 확인
			setCurrentScreen("start");
		}, 100);

		return () => clearTimeout(timer);
	}, []);

	// Convenience navigation functions
	const goToStart = () => navigateTo("start");
	const goToUpload = () => navigateTo("upload");
	const goToResult = () => navigateTo("result");
	const goToChat = () => navigateTo("chatting");

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

			// 전환 중이 아닌 경우에만 결과 화면으로 전환
			if (!isTransitioning) {
				navigateTo("result");
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
			// 이전에 정의되지 않은 onSubmit() 대신 goToLoading() 호출
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

	// Determine screen position class
	const getScreenClass = (screenName) => {
		// Current screen is always active and centered
		if (screenName === currentScreen) {
			return "screen screen-active";
		}

		const currentIndex = screenOrder.indexOf(currentScreen);
		const screenIndex = screenOrder.indexOf(screenName);

		// Position based on screen order
		if (transitionDirection === "forward") {
			// In forward motion: screens before current go left, after go right
			return screenIndex < currentIndex
				? "screen screen-left"
				: "screen screen-right";
		} else {
			// In backward motion: screens before current go left, after go right
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
				{/* All screens are always rendered, but positioned with CSS */}
				<StartScreen
					className={getScreenClass("start")}
					onStartClick={goToUpload}
				/>

				<UploadScreen
					className={getScreenClass("upload")}
					file={file}
					onFileChange={handleFileChange}
					toggleValue={toggleValue} // 토글 상태 전달
					onToggleChange={handleToggleChange} // 토글 변경 핸들러 전달
					onSubmit={handleSubmit}
					onBackClick={goToStart}
					isTransitioning={isTransitioning}
				/>

				<LoadingScreen className={getScreenClass("loading")} />

				<ResultScreen
					className={getScreenClass("result")}
					file={file}
					gender={toggleValue}
					submissionResult={submissionResult} // 결과 데이터 전달
					onBackClick={resetUpload}
					onChatClick={goToChat}
				/>

				<ChattingScreen
					className={getScreenClass("chatting")}
					onBackClick={goToResult}
				/>
			</div>
		</div>
	);
}

export default App;
