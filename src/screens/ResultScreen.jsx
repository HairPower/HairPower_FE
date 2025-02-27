import React from "react";
import "./ResultScreen.css";

const ResultScreen = ({
	className,
	file,
	gender,
	submissionResult,
	onBackClick,
	onChatClick,
	onSubmitSuccess,
	onSubmitError,
}) => {
	console.log(submissionResult);

	const renderServerResult = () => {
		// 데이터가 없거나 undefined인 경우 처리
		if (!submissionResult) {
			return <p>결과를 불러오는 중...</p>;
		}

		try {
			let ususume =
				'{"analysis_id": "123456","recommended_styles": [{"style_name": "단발 웨이브","image": "base64_encoded_string","description": "부드러운 인상을 줄 수 있는 스타일입니다."},{"style_name": "숏컷","image": "base64_encoded_string","description": "시크한 분위기를 연출할 수 있습니다."}]}';
			return (
				<div className="server-result">
					<h3>추천</h3>
					<pre>{JSON.stringify(ususume, null, 2)}</pre>
				</div>
			);
		} catch (error) {
			// 렌더링 중 예외 발생 시 대체 메시지
			console.error("결과 렌더링 중 오류:", error);
			return <p>결과를 표시할 수 없습니다.</p>;
		}
	};

	// submissionResult가 없는 경우 로딩 화면 표시
	if (!submissionResult) {
		return (
			<div className={`screen result-screen ${className}`}>
				<div className="result-container">
					<h2>분석 중...</h2>
					<p>잠시만 기다려주세요. 결과를 불러오고 있습니다.</p>
					<button onClick={onBackClick}>다시 업로드</button>
				</div>
			</div>
		);
	}

	// 파일 정보가 없는 경우
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

	return (
		<div className={`screen result-screen ${className}`}>
			<div className="result-container">
				<h2>분석 결과</h2>

				{/* 제출된 파일 정보 */}
				<div className="result-info">
					<p>성별: {gender ? "여성" : "남성"}</p>
					<div>
						<p>분석된 특징:</p>
						{submissionResult.userFeatures &&
						submissionResult.userFeatures.length > 0 ? (
							<ul>
								{submissionResult.userFeatures.map(
									(feature, index) => (
										<li key={index}>{feature}</li>
									)
								)}
							</ul>
						) : (
							<p>특징 정보가 없습니다.</p>
						)}
					</div>
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
