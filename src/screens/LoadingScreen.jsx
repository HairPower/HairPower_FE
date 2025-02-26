import ParticleSwarm from "../ParticleSwarm";
import "./LoadingScreen.css";

function LoadingScreen({ className }) {
	return (
		<div className={`screen loading-screen ${className}`}>
			{/* 파티클 배경 효과 */}
			<div className="particles-container">
				<ParticleSwarm />
			</div>

			{/* 로딩 텍스트 (이미지에서 "결과 생성 중..."으로 표시됨) */}
			<div className="loading-text">결과 생성 중...</div>
		</div>
	);
}

export default LoadingScreen;
