import { useRef, useState } from "react";
import "./FileUploadForm.css";
import ParticleSwarm from "./ParticleSwarm";
import ResultPage from "./ResultPage"; // ResultPage 컴포넌트 import

const FileUploadForm = () => {
	const [toggleValue, setToggleValue] = useState(false);
	const [file, setFile] = useState(null);
	const [currentScreen, setCurrentScreen] = useState("upload"); // 'upload', 'loading', 'result'
	const fileInputRef = useRef(null);

	const handleToggleChange = () => {
		setToggleValue(!toggleValue);
	};

	const handleFileChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
		}
	};

	const handleClick = () => {
		fileInputRef.current.click();
	};

	const handleDragOver = (e) => {
		e.preventDefault();
	};

	const handleDrop = (e) => {
		e.preventDefault();
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			setFile(e.dataTransfer.files[0]);
			handleSubmit();
		}
	};

	const handleSubmit = () => {
		console.log("파일 제출:", file);
		setCurrentScreen("loading");

		// 3초 후 결과 페이지로 이동
		setTimeout(() => {
			setCurrentScreen("result");
		}, 3000);
	};

	// 결과 페이지에서 업로드 페이지로 돌아가기
	const handleBackToUpload = () => {
		setCurrentScreen("upload");
		setFile(null);
	};

	// 현재 화면에 따른 클래스 및 트랜지션 처리
	const getUploadContainerClass = () => {
		if (currentScreen === "upload") return "";
		return "slide-out";
	};

	const getLoadingWrapperClass = () => {
		if (currentScreen === "loading") return "slide-in";
		return "";
	};

	return (
		<div className="page-container">
			{/* 업로드 화면 */}
			<div className={`upload-container ${getUploadContainerClass()}`}>
				<div className="upload-area-container">
					<div
						className="upload-area"
						onClick={handleClick}
						onDragOver={handleDragOver}
						onDrop={handleDrop}
					>
						<div className="upload-icon">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
								<polyline points="17 8 12 3 7 8"></polyline>
								<line x1="12" y1="3" x2="12" y2="15"></line>
							</svg>
						</div>
						<p className="upload-text">
							<span className="upload-highlight">Click here</span>{" "}
							to upload or drop media here
						</p>
						<input
							type="file"
							ref={fileInputRef}
							onChange={handleFileChange}
							style={{ display: "none" }}
						/>
					</div>
				</div>

				<div className="toggle-container">
					<div className="toggle-text">Choose Your Gender</div>
					<div
						className={`toggle-switch ${
							toggleValue ? "active" : ""
						}`}
						onClick={handleToggleChange}
					>
						<div className="toggle-thumb"></div>
					</div>
				</div>

				<div className="submit-button-container">
					<button className="submit-button" onClick={handleSubmit}>
						제출하기
					</button>
				</div>
			</div>

			{/* 파티클 스웜 로딩 화면 */}
			<div className={`loading-wrapper ${getLoadingWrapperClass()}`}>
				<ParticleSwarm />
			</div>

			{/* 결과 화면 컴포넌트 */}
			<ResultPage
				currentScreen={currentScreen}
				file={file}
				onBackToUpload={handleBackToUpload}
			/>
		</div>
	);
};

export default FileUploadForm;
