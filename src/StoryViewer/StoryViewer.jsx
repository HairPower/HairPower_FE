import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./StoryViewer.css";

const StoryViewer = ({ stories, onComplete }) => {
	// 항상 0번 인덱스(첫 번째 스토리)부터 시작
	const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
	const [isTransitioning, setIsTransitioning] = useState(false);
	// 일시정지 상태
	const [isPaused, setIsPaused] = useState(false);
	// 진행 상태 (0~100)
	const [progress, setProgress] = useState(0);
	// 진행 인터벌 참조
	const progressInterval = useRef(null);
	const storyDuration = 8000;

	// 현재 스토리 가져오기
	const currentStory = stories[currentStoryIndex];

	// 스토리 인덱스가 변경될 때마다 실행
	useEffect(() => {
		// 컴포넌트가 마운트될 때 항상 0번 인덱스로 설정
		setCurrentStoryIndex(0);
	}, []); // 빈 의존성 배열로 컴포넌트 마운트 시에만 실행

	// 스토리 진행 처리
	useEffect(() => {
		// 스토리가 변경되면 진행률 초기화
		setProgress(0);

		// 기존 인터벌 제거
		if (progressInterval.current) {
			clearInterval(progressInterval.current);
		}

		// 새 인터벌 설정 (일시정지 상태가 아닐 때만)
		if (!isPaused) {
			const intervalTime = 100; // 0.1초마다 업데이트
			const step = (intervalTime / storyDuration) * 100;

			progressInterval.current = setInterval(() => {
				setProgress((prevProgress) => {
					const newProgress = prevProgress + step;

					// 진행률이 100%에 도달하면 다음 스토리로 이동
					if (newProgress >= 100) {
						goToNextStory();
						return 0;
					}
					return newProgress;
				});
			}, intervalTime);
		}

		// 컴포넌트 언마운트 또는 의존성 변경 시 인터벌 정리
		return () => {
			if (progressInterval.current) {
				clearInterval(progressInterval.current);
			}
		};
	}, [currentStoryIndex, isPaused]);

	// 다음 스토리로 이동
	const goToNextStory = () => {
		if (isTransitioning) return; // 전환 중이면 무시

		setIsTransitioning(true);
		if (currentStoryIndex < stories.length - 1) {
			setCurrentStoryIndex(currentStoryIndex + 1);
		} else {
			// 모든 스토리를 봤을 때 onComplete 콜백 실행
			if (onComplete) onComplete();
		}

		// 300ms 후 전환 상태 해제
		setTimeout(() => {
			setIsTransitioning(false);
		}, 300);
	};

	// 이전 스토리로 이동
	const goToPrevStory = () => {
		if (currentStoryIndex > 0) {
			setCurrentStoryIndex(currentStoryIndex - 1);
		}
	};

	// 터치/클릭 영역 처리
	const handleTouchStart = () => {
		// 터치 시작 시 타이머 일시정지
		setIsPaused(true);
	};

	const handleTouchEnd = (e) => {
		// 터치 종료 시 타이머 재개
		setIsPaused(false);

		// 화면 너비의 1/3을 기준으로 좌/우 판단
		const screenWidth = window.innerWidth;
		const touchX = e.changedTouches
			? e.changedTouches[0].clientX
			: e.clientX;

		if (touchX < screenWidth / 3) {
			// 화면 왼쪽 1/3 터치 시 이전 스토리
			goToPrevStory();
		} else if (touchX > (screenWidth * 2) / 3) {
			// 화면 오른쪽 1/3 터치 시 다음 스토리
			goToNextStory();
		}
	};

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
			</div>
		</div>
	);
};

export default StoryViewer;
