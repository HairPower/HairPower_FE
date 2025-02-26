import React from "react";
import StoryViewer from "../StoryViewer/StoryViewer";
import "./StoryScreen.css";

const StoryScreen = ({ className, onBackClick, onComplete, analysisData }) => {
	// 분석 데이터를 기반으로 스토리 구성
	const stories = [
		{
			id: 1,
			content: `# 분석 결과\n\n${
				analysisData?.type || "AI 분석"
			} 결과를 보여드립니다.`,
		},
		{
			id: 2,
			content: `## 기본 정보\n\n- **파일명**: ${
				analysisData?.fileName || "알 수 없음"
			}\n- **성별**: ${
				analysisData?.gender || "선택되지 않음"
			}\n- **분석 상태**: ${analysisData?.status || "진행 중"}`,
		},
		{
			id: 3,
			content: `## 상세 분석\n\n${
				analysisData?.결과 || "분석 내용이 없습니다."
			}\n\n**신뢰도**: ${analysisData?.세부사항?.신뢰도 || "알 수 없음"}`,
		},
		{
			id: 4,
			content: `## 추천 사항\n\n${
				analysisData?.세부사항?.추천사항 || "추천 사항이 없습니다."
			}`,
		},
		{
			id: 5,
			content: `# 분석 완료\n\n스토리 보기를 완료했습니다.\n결과 페이지로 돌아갑니다.`,
		},
	];

	return (
		<div className={`story-screen ${className}`}>
			<div className="story-container">
				<StoryViewer stories={stories} onComplete={onComplete} />
			</div>
			<button className="close-button" onClick={onBackClick}>
				&times;
			</button>
		</div>
	);
};

export default StoryScreen;
