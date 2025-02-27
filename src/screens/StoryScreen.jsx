import React, { useMemo } from "react";
import StoryViewer from "../StoryViewer/StoryViewer";
import ss from "../response.json";
import "./StoryScreen.css";

// Helper function to safely decode markdown text
const decodeMarkdown = (encodedText) => {
	if (!encodedText) return "";

	try {
		// Try using JSON.parse for properly formatted JSON strings
		return JSON.parse(`"${encodedText}"`);
	} catch (error) {
		console.error("디코딩 중 오류:", error);

		// Fallback to manual replacement
		return String(encodedText)
			.replace(/\\n/g, "\n")
			.replace(/\\"/g, '"')
			.replace(/\\\\/g, "\\")
			.replace(/^"/, "")
			.replace(/"$/, "");
	}
};

const getSafe = (obj, path, defaultValue = null) => {
	// 기본 조건 체크
	if (obj === null || obj === undefined) {
		return defaultValue;
	}

	// 경로 처리
	const keys = Array.isArray(path) ? path : path.split(".");

	// 현재 참조를 추적
	let current = obj;

	// 경로를 따라 탐색
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];

		// 현재 값이 null이나 undefined이거나 객체가 아닌 경우
		if (
			current === null ||
			current === undefined ||
			(typeof current !== "object" && !Array.isArray(current))
		) {
			return defaultValue;
		}

		// 다음 레벨로 이동
		current = current[key];

		// 마지막이 아닌데 현재 값이 undefined인 경우
		if (current === undefined) {
			return defaultValue;
		}
	}

	// 마지막 값이 정확히 undefined인 경우만 defaultValue 반환
	// 0, '', false 같은 falsy 값은 유효한 결과로 반환
	return current === undefined ? defaultValue : current;
};

// Helper function to safely extract data from analysis
const extractDataField = (data, fieldName, defaultValue = "데이터 없음") => {
	if (!data) return defaultValue;

	// If the data is already a string, return it
	if (typeof data === "string") return data;

	// Try to access the field if data is an object using getSafe
	return getSafe(data, fieldName, defaultValue);
};

const StoryScreen = ({ className, onBackClick, onComplete, analysisData }) => {
	// Generate stories dynamically based on analysis data
	const stories = useMemo(() => {
		// Ensure analysisData is not null or undefined
		const data = analysisData || {};
		console.log("Raw analysis data:", data);

		// Define a default markdown for the first story
		const rawMarkdown =
			"# 분석 보고서\n\n이 보고서는 제공된 데이터를 기반으로 생성되었습니다.";

		// Try to decode any markdown content if it exists
		const decodedData =
			typeof data === "string" ? decodeMarkdown(data) : data;
		console.log("Decoded data:", decodedData);

		// Extract specific fields with fallbacks using getSafe
		const basicInfo = getSafe(
			decodedData,
			"basicInfo",
			"기본 정보가 제공되지 않았습니다."
		);
		const detailedAnalysis = getSafe(
			decodedData,
			"detailedAnalysis",
			"상세 분석 데이터가 없습니다."
		);
		const reliability = getSafe(
			decodedData,
			"reliability",
			"신뢰도 정보가 없습니다."
		);
		const recommendations = getSafe(
			decodedData,
			"recommendations",
			"추천 사항이 없습니다."
		);
		return [
			{
				id: 1,
				content: ss.content.text,
			},
			{
				id: 2,
				content: `## 기본 정보\n\n${basicInfo}`,
			},
			{
				id: 3,
				content: `## 상세 분석\n\n${detailedAnalysis}\n\n**신뢰도**: ${reliability}`,
			},
			{
				id: 4,
				content: `## 추천 사항\n\n${recommendations}`,
			},
			{
				id: 5,
				content: `# 분석 완료\n\n스토리 보기를 완료했습니다.\n결과 페이지로 돌아갑니다.`,
			},
		];
	}, [analysisData]);

	return (
		<div className={className || "story-screen"}>
			<div className="story-screen-container">
				<StoryViewer
					stories={stories}
					onBackClick={onBackClick}
					onComplete={onComplete}
				/>
			</div>
		</div>
	);
};

export default StoryScreen;
