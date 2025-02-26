import { useState } from "react";
import "./App.css";
import Background from "./Background";
import ChattingApp from "./ChattingApp/ChattingApp";
import FileUploadForm from "./FileUploadForm";

function App() {
	const [currentScreen, setCurrentScreen] = useState("start");

	const handleStartClick = () => {
		setCurrentScreen("next");
	};

	const renderScreen = () => {
		switch (currentScreen) {
			case "start":
				return (
					<div className="start-screen">
						<div className="start-button-container">
							<button
								className="start-button"
								onClick={handleStartClick}
							>
								시작하기
							</button>
						</div>
					</div>
				);

			case "next":
				return (
					<>
						<FileUploadForm />
					</>
				);

			case "chatting":
				return (
					<div className="chatting-screen">
						<ChattingApp />
						<button
							className="back-button"
							onClick={() => setCurrentScreen("next")}
						>
							이전으로 돌아가기
						</button>
					</div>
				);

			default:
				return <div>잘못된 화면입니다</div>;
		}
	};

	return (
		<>
			<div className="background-container">
				<Background />
			</div>
			{renderScreen()}
		</>
	);
}

export default App;
