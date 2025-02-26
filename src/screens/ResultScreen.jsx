import React from "react";
import "./ResultScreen.css";

const ResultScreen = ({
	className,
	file,
	gender,
	submissionResult,
	onBackClick,
	onChatClick,
}) => {
	console.log("ResultScreen 렌더링:", {
		file,
		gender,
		submissionResult,
		className,
	});

	const renderServerResult = () => {
		// 데이터가 없거나 undefined인 경우 처리
		if (!submissionResult) {
			return <p>결과를 불러오는 중...</p>;
		}

		try {
			return (
				<div className="server-result">
					<h3>분석 결과 상세</h3>
					{/* 응답 데이터 타입에 따라 다르게 렌더링 */}
					{typeof submissionResult === "object" ? (
						<pre>{JSON.stringify(submissionResult, null, 2)}</pre>
					) : (
						<p>{String(submissionResult)}</p>
					)}
				</div>
			);
		} catch (error) {
			// 렌더링 중 예외 발생 시 대체 메시지
			console.error("결과 렌더링 중 오류:", error);
			return <p>결과를 표시할 수 없습니다.</p>;
		}
	};

	// 로딩 중인 상태 표시 (submissionResult가 없는 경우)
	const renderLoadingOrEmpty = () => {
		if (!file) {
			return (
				<div className={`screen result-screen ${className}`}>
					<div className="result-container">
						<p>파일 정보가 없습니다. 다시 업로드해주세요.</p>
						<button onClick={onBackClick}>다시 업로드</button>
					</div>
				</div>
			);
		}
	};

	return (
		<div className={`screen result-screen ${className}`}>
			<div className="result-container">
				<h2>분석 결과</h2>

				{/* 제출된 파일 정보 */}
				<div className="result-info">
					<p>파일명: {file ? file.name : "정보 없음"}</p>
					<p>성별: {gender ? "여성" : "남성"}</p>
				</div>

				{/* 안전한 결과 렌더링 */}
				{renderServerResult()}

				<div className="result-actions">
					<button onClick={onBackClick}>다시 업로드</button>
					<button onClick={onChatClick}>분석 채팅</button>
				</div>
			</div>
		</div>
	);
};

export default ResultScreen;
