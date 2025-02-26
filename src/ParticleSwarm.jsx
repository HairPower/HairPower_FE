import { useEffect, useRef } from "react";
import "./ParticleSwarm.css";

const ParticleSwarm = () => {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		let animationFrameId;

		// 캔버스 크기 설정
		const resizeCanvas = () => {
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
		};

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		// 파티클 클래스 정의
		class Particle {
			constructor() {
				this.x = Math.random() * canvas.width;
				this.y = Math.random() * canvas.height;
				this.size = Math.random() * 3 + 1;
				this.speedX = Math.random() * 2 - 1;
				this.speedY = Math.random() * 2 - 1;
				this.color = "#8B5A2B"; // 갈색 계열
			}

			// 파티클 위치 업데이트
			update() {
				// 파티클이 마우스 위치를 향해 움직이도록 조정
				this.x += this.speedX;
				this.y += this.speedY;

				// 화면 경계 처리
				if (this.x < 0 || this.x > canvas.width) {
					this.speedX = -this.speedX;
				}
				if (this.y < 0 || this.y > canvas.height) {
					this.speedY = -this.speedY;
				}
			}

			// 파티클 그리기
			draw() {
				ctx.fillStyle = this.color;
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
				ctx.closePath();
				ctx.fill();
			}
		}

		// 파티클 배열 생성 및 초기화
		const particlesArray = [];
		const numberOfParticles = 80;

		for (let i = 0; i < numberOfParticles; i++) {
			particlesArray.push(new Particle());
		}

		// 모든 파티클 사이에 선 그리기
		function connectParticles() {
			for (let a = 0; a < particlesArray.length; a++) {
				for (let b = a; b < particlesArray.length; b++) {
					const dx = particlesArray[a].x - particlesArray[b].x;
					const dy = particlesArray[a].y - particlesArray[b].y;
					const distance = Math.sqrt(dx * dx + dy * dy);

					if (distance < 100) {
						ctx.strokeStyle = `rgba(139, 90, 43, ${
							1 - distance / 100
						})`;
						ctx.lineWidth = 0.5;
						ctx.beginPath();
						ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
						ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
						ctx.stroke();
					}
				}
			}
		}

		// 애니메이션 루프
		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// 모든 파티클 업데이트 및 그리기
			particlesArray.forEach((particle) => {
				particle.update();
				particle.draw();
			});

			// 파티클 연결하기
			connectParticles();

			// 애니메이션 프레임 요청
			animationFrameId = requestAnimationFrame(animate);
		};

		animate();

		// 클린업 함수
		return () => {
			window.removeEventListener("resize", resizeCanvas);
			cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return (
		<div className="particle-swarm-container">
			<canvas ref={canvasRef} className="particle-canvas"></canvas>
			<div className="loading-text">결과 생성 중...</div>
		</div>
	);
};

export default ParticleSwarm;
