import React from "react";
import "./ResultPage.css";

function ResultPage({ currentScreen, file, onBackToUpload, onGoToChat }) {
	// 현재 화면에 따른 클래스 계산
	const getResultContainerClass = () => {
		if (currentScreen === "result") return "slide-in";
		return "";
	};

	return (
		<div className={`result-container ${getResultContainerClass()}`}>
			<div className="result-content">
				<h2 className="result-title">분석 결과</h2>

				<div className="result-card">
					<div className="result-icon">✅</div>
					<div className="result-info">
						<h3>{file ? file.name : "파일"} 분석 완료</h3>
						<p>분석이 성공적으로 완료되었습니다.</p>

						<div className="result-details">
							<div className="result-detail-item">
								<span className="detail-label">신뢰도:</span>
								<span className="detail-value">98%</span>
							</div>
							<div className="result-detail-item">
								<span className="detail-label">처리 시간:</span>
								<span className="detail-value">3초</span>
							</div>
							<div className="result-detail-item">
								<span className="detail-label">특징:</span>
								<span className="detail-value">
									자연스러운 텍스처, 균일한 패턴
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="result-actions">
					<button className="back-button" onClick={onBackToUpload}>
						처음으로 돌아가기
					</button>
					<button className="chat-button" onClick={onGoToChat}>
						채팅으로 이동하기
					</button>
				</div>
			</div>
		</div>
	);
}

export default ResultPage;
