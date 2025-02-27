import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import SamplePhoto from "./SamplePhoto";
import "./StoryViewer.css";

const StoryViewer = ({ stories, onComplete }) => {
	const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [progress, setProgress] = useState(0);
	const progressInterval = useRef(null);
	const startTimeRef = useRef(null);
	const storyDuration = 8000; // 8초

	// 다음 스토리로 이동하는 안전한 함수
	const goToNextStory = useCallback(() => {
		if (isTransitioning) return;

		setIsTransitioning(true);

		if (currentStoryIndex < stories.length - 1) {
			setCurrentStoryIndex((prev) => prev + 1);
			setProgress(0); // 진행도 초기화
			startTimeRef.current = null; // 타이머 초기화
		} else {
			// 모든 스토리를 봤을 때 onComplete 콜백 실행
			if (onComplete) onComplete();
		}

		setTimeout(() => {
			setIsTransitioning(false);
		}, 300);
	}, [currentStoryIndex, isTransitioning, stories.length, onComplete]);

	// 이전 스토리로 이동
	const goToPrevStory = useCallback(() => {
		if (isTransitioning) return;

		setIsTransitioning(true);

		if (currentStoryIndex > 0) {
			setCurrentStoryIndex((prev) => prev - 1);
			setProgress(0); // 진행도 초기화
			startTimeRef.current = null; // 타이머 초기화
		}

		setTimeout(() => {
			setIsTransitioning(false);
		}, 300);
	}, [currentStoryIndex, isTransitioning]);

	// 스토리 진행 처리
	useEffect(() => {
		// 기존 인터벌 정리
		if (progressInterval.current) {
			clearInterval(progressInterval.current);
		}

		// 일시정지 상태가 아닐 때만 진행
		if (!isPaused) {
			// 첫 시작 시간 기록
			if (!startTimeRef.current) {
				startTimeRef.current = Date.now();
			}

			progressInterval.current = setInterval(() => {
				const elapsedTime = Date.now() - startTimeRef.current;
				const newProgress = Math.min(
					(elapsedTime / storyDuration) * 100,
					100
				);

				setProgress(newProgress);

				// 8초가 지나면 다음 스토리로 이동
				if (elapsedTime >= storyDuration) {
					goToNextStory();
				}
			}, 50);
		}

		// 컴포넌트 언마운트 시 정리
		return () => {
			if (progressInterval.current) {
				clearInterval(progressInterval.current);
			}
		};
	}, [currentStoryIndex, isPaused, goToNextStory]);

	// 터치/클릭 이벤트 핸들러
	const handleTouchStart = () => setIsPaused(true);
	const handleTouchEnd = (e) => {
		setIsPaused(false);

		const screenWidth = window.innerWidth;
		const touchX = e.changedTouches
			? e.changedTouches[0].clientX
			: e.clientX;

		if (touchX < screenWidth / 3) {
			goToPrevStory();
		} else if (touchX > (screenWidth * 2) / 3) {
			goToNextStory();
		}
	};

	// 현재 스토리
	const currentStory = stories[currentStoryIndex];

	return (
		<div
			className="story-viewer"
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
			onMouseDown={handleTouchStart}
			onMouseUp={handleTouchEnd}
		>
			{/* 진행 표시줄 */}
			<div className="progress-container">
				{stories.map((_, index) => (
					<div key={index} className="progress-bar-wrapper">
						<div
							className={`progress-bar ${
								index < currentStoryIndex ? "completed" : ""
							}`}
							style={{
								width:
									index === currentStoryIndex
										? `${progress}%`
										: index < currentStoryIndex
										? "100%"
										: "0%",
							}}
						/>
					</div>
				))}
			</div>

			{/* 스토리 콘텐츠 */}
			<div className="story-content">
				<ReactMarkdown>{currentStory.content}</ReactMarkdown>
				<SamplePhoto
					imgUrl={
						currentStory.imgUrl != null ? currentStory.imgUrl : null
					}
				/>
			</div>
		</div>
	);
};

export default StoryViewer;
