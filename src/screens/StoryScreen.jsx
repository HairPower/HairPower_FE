import React, { useMemo } from "react";
import Background from "../Background";
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
const imageFileNames = [
	"숏얼",
	"롱얼",
	"숏코",
	"롱코",
	"숏이",
	"롱이",
	"숏턱",
	"롱턱",
	"숏미",
	"롱미",
	"세형",
	"네형",
];
const images = import.meta.glob("../../img/Memoticon/*.{png,jpg,jpeg,svg}");
const photoResult = (subtext) => {
	switch (subtext) {
		case "짧은 얼굴":
			return 0;
		case "긴 얼굴":
			return 1;
		case "짧은 코":
			return 2;
		case "긴 코":
			return 3;
		case "짧은 이마":
			return 4;
		case "긴 이마":
			return 5;
		case "짧은 턱":
			return 6;
		case "긴 턱":
			return 7;
		case "짧은 미간":
			return 8;
		case "긴 미간":
			return 9;
		case "세모형":
			return 10;
		case "네모형":
			return 11;
	}
};

const StoryScreen = ({
	className,
	onBackClick,
	onComplete,
	analysisData,
	userFeatures,
}) => {
	// Generate stories dynamically based on analysis data
	const stories = useMemo(() => {
		// Ensure analysisData is not null or undefined
		const data = analysisData || {};
		console.log("Raw analysis data:", data);
		const totalPages = userFeatures ? userFeatures.length + 2 : 1;
		// Define a default markdown for the first story
		// Try to decode any markdown content if it exists
		const decodedData =
			typeof data === "string" ? decodeMarkdown(data) : data;
		console.log("Decoded data:", decodedData);
		const end = [
			{
				id: 1,
				content: ss.content.text,
			},
		];
		for (let i = 1; i < totalPages - 1; i++) {
			end.push({
				id: i + 1,
				content: `##### 당신의 유형은? : \n ${userFeatures[i - 1]}`,
				imgUrl: `../../img/memoticon/${
					imageFileNames[photoResult(userFeatures[i - 1])]
				}.png`,
			});
		}
		end.push({
			id: 5,
			content: `# 분석 완료\n\n스토리 보기를 완료했습니다.\n결과 페이지로 돌아갑니다.`,
		});
		return end;
	});

	return (
		<div className={className || "story-screen"}>
			<div className="story-screen-container">
				<Background />
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
