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
		if (!file || isTransitioning) {
			// 제출 조건 확인 (파일 존재 및 전환 중이 아님)
			console.warn("제출 조건 미충족", {
				fileExists: !!file,
				isNotTransitioning: !isTransitioning,
			});
			return;
		}
		goToLoading();
		setError(null);
		setIsTransitioning(true);

		try {
			const formData = new FormData();
			formData.append("photo", file);
			formData.append("gender", toggleValue ? "female" : "male");

			console.log("API 요청 시작");
			// const response = await fetch("/api/user/upload-photo", {
			// 	method: "POST",
			// 	body: formData,
			// });

			// //const responseText = await response.text();

			// const isSuccessStatus =
			// 	response.status >= 200 && response.status < 300;

			// if (!isSuccessStatus) {
			// 	throw new Error(
			// 		data?.message || `오류 코드: ${response.status}`
			// 	);
			// }
			// 응답이 비어있지 않은 경우에만 JSON으로 파싱

			let responseText =
				'{"userId": 37,"gender": "male", "imageUrl": "https://hairpower12.s3.ap-northeast-2.amazonaws.com/1740615464044_%E1%84%83%E1%85%A1%E1%84%8B%E1%85%AE%E1%86%AB%E1%84%85%E1%85%A9%E1%84%83%E1%85%B3.jpeg","userFeatures": ["세모형","짧은 코","긴 턱","짧은 얼굴"]}';

			if (responseText) {
				try {
					data = JSON.parse(responseText);
				} catch (parseError) {
					console.error("JSON 파싱 오류:", parseError);
					console.log("서버 응답 내용:", responseText);
					throw new Error(
						"서버에서 유효하지 않은 응답 형식을 반환했습니다."
					);
				}
			} else {
				throw new Error("서버에서 빈 응답을 반환했습니다.");
			}

			setSubmissionResult(data);
			setUserFeatures(data.userFeatures);

			setIsTransitioning(false);
			getScreenClass("result");
			transitionToResult();

			setTimeout(() => {
				openStory();
			}, 1700);
		} catch (err) {
			// 오류 처리
			console.error("업로드 오류:", err);
			setError(err.message || "서버와 통신 중 오류가 발생했습니다.");

			// 전환 상태 해제
			setIsTransitioning(false);
			// 업로드 화면으로 돌아가기
			setTimeout(() => {
				resetUpload();
			}, 100);
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
