import React, { useRef, useState } from "react";
import "./UploadScreen.css";

const UploadScreen = ({ className, onBackClick }) => {
	const [file, setFile] = useState(null);
	const [toggleValue, setToggleValue] = useState(false); // false는 남성, true는 여성
	const [hasSelected, setHasSelected] = useState(false);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [result, setResult] = useState(null);
	const [error, setError] = useState(null);
	const fileInputRef = useRef(null);

	const handleFileChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
			setResult(null);
			setError(null);
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
			setResult(null);
			setError(null);
		}
	};

	const handleToggleChange = () => {
		setToggleValue(!toggleValue);
		setHasSelected(true);
	};

	// API 호출을 처리하는 함수 =====================================
	// API 호출을 처리하는 함수
	const handleSubmit = async () => {
		if (!file || isTransitioning) return;

		setIsTransitioning(true);
		setError(null);

		// FormData 객체 생성 및 데이터 추가
		const formData = new FormData();
		formData.append("photo", file);
		formData.append("gender", toggleValue ? "female" : "male");

		try {
			const response = await fetch("/api/user/upload-photo", {
				method: "POST",
				body: formData,
			});

			// 응답 본문 텍스트를 먼저 확인
			const responseText = await response.text();

			// 응답이 비어있지 않은 경우에만 JSON으로 파싱
			let data;
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

			if (!response.ok) {
				throw new Error(
					data?.message || "업로드 중 오류가 발생했습니다."
				);
			}

			// 성공적인 응답 처리
			setResult(data);
		} catch (err) {
			setError(err.message || "서버와 통신 중 오류가 발생했습니다.");
			console.error("업로드 오류:", err);
		} finally {
			setIsTransitioning(false);
		}
	};

	// 결과 또는 오류 메시지 표시 컴포넌트
	const renderResultOrError = () => {
		if (error) {
			return <div className="error-message">{error}</div>;
		}

		if (result) {
			return (
				<div className="result-container">
					<h3>분석 결과</h3>
					<pre>{JSON.stringify(result, null, 2)}</pre>
				</div>
			);
		}

		return null;
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
						/>
						{file && <p className="file-name">{file.name}</p>}
					</div>
				</div>

				<div className="toggle-container">
					<div className="toggle-text">
						{hasSelected
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
							backgroundColor: hasSelected
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
						disabled={!file || isTransitioning}
						style={{
							backgroundColor:
								!file || isTransitioning
									? "#ccc"
									: toggleValue
									? "#ffcdc5"
									: "#7cb9e8",
						}}
					>
						{isTransitioning ? "처리 중..." : "제출하기"}
					</button>
				</div>

				{/* 결과 또는 오류 메시지 표시 */}
				{renderResultOrError()}
			</div>
		</div>
	);
};

export default UploadScreen;
