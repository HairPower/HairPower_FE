import React, { useRef, useState } from "react";
import "./UploadScreen.css";

const UploadScreen = ({
	className,
	file,
	onFileChange,
	toggleValue,
	onToggleChange,
	onSubmit,
	onBackClick,
	isTransitioning,
}) => {
	const [hasSelected, setHasSelected] = useState(false);
	const fileInputRef = useRef(null);
	const handleFileChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			const selectedFile = e.target.files[0];

			// 부모 컴포넌트에 파일 변경 알림
			if (onFileChange) {
				onFileChange(selectedFile);
			}
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
			const selectedFile = e.dataTransfer.files[0];

			// 부모 컴포넌트에 파일 변경 알림
			if (onFileChange) {
				onFileChange(selectedFile);
			}
		}
	};

	const handleToggleChange = () => {
		const newValue = !toggleValue;
		setHasSelected(true);

		// 부모 컴포넌트에 토글 변경 알림
		if (onToggleChange) {
			onToggleChange(newValue);
		}
	};

	// 제출 버튼 클릭 핸들러 - 이제 모든 처리는 부모 컴포넌트에서 수행
	const handleSubmit = () => {
		if (file && hasSelected && onSubmit) {
			onSubmit();
		}
	};

	return (
		<div className={`screen upload-screen ${className}`}>
			<div className="upload-container">
				{onBackClick && (
					<div className="back-button-container">
						<button className="back-button" onClick={onBackClick}>
							← 뒤로
						</button>
					</div>
				)}

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
							accept="image/*"
						/>
						{file && <p className="file-name">{file.name}</p>}
					</div>
				</div>

				<div className="toggle-container">
					<div className="toggle-text">
						{hasSelected || toggleValue !== false
							? toggleValue
								? "Female"
								: "Male"
							: "Choose your gender"}
					</div>
					<div
						className={`toggle-switch ${
							toggleValue ? "active" : ""
						}`}
						onClick={handleToggleChange}
						style={{
							backgroundColor:
								hasSelected || toggleValue !== false
									? toggleValue
										? "#ffcdc5"
										: "#7cb9e8" // Pink for female, blue for male
									: "#ccc", // Gray for initial state
						}}
					>
						<div className="toggle-thumb"></div>
					</div>
				</div>

				<div className="buttons-container">
					<button
						className="submit-button"
						onClick={handleSubmit}
						disabled={!file || !hasSelected}
						style={{
							backgroundColor:
								!file || !hasSelected
									? "#ccc"
									: toggleValue
									? "#ffcdc5"
									: "#7cb9e8",
						}}
					>
						{isTransitioning ? "처리 중..." : "제출하기"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default UploadScreen;
