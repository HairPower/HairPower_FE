import "./background.css"; // 스타일을 별도 CSS 파일로 분리

function Background() {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 414 900">
			<defs>
				<linearGradient
					id="mainGradient"
					x1="0%"
					y1="0%"
					x2="100%"
					y2="100%"
				>
					<stop offset="0%" stopColor="#F5E8DF" />
					<stop offset="50%" stopColor="#EDD6C0" />
					<stop offset="100%" stopColor="#E6C9AC" />
				</linearGradient>

				<radialGradient
					id="radialGradient1"
					cx="30%"
					cy="25%"
					r="45%"
					fx="30%"
					fy="25%"
				>
					<stop offset="0%" stopColor="#F2D9C8" stopOpacity="0.6" />
					<stop offset="100%" stopColor="#F2D9C8" stopOpacity="0" />
				</radialGradient>

				<radialGradient
					id="radialGradient2"
					cx="70%"
					cy="60%"
					r="50%"
					fx="70%"
					fy="60%"
				>
					<stop offset="0%" stopColor="#DACBBE" stopOpacity="0.5" />
					<stop offset="100%" stopColor="#DACBBE" stopOpacity="0" />
				</radialGradient>

				<radialGradient
					id="radialGradient3"
					cx="40%"
					cy="80%"
					r="40%"
					fx="40%"
					fy="80%"
				>
					<stop offset="0%" stopColor="#F8E7D5" stopOpacity="0.4" />
					<stop offset="100%" stopColor="#F8E7D5" stopOpacity="0" />
				</radialGradient>

				<filter
					id="softBlur"
					x="-50%"
					y="-50%"
					width="200%"
					height="200%"
				>
					<feGaussianBlur in="SourceGraphic" stdDeviation="15" />
				</filter>

				<animate
					xlinkHref="#bubble1"
					attributeName="cy"
					from="200"
					to="220"
					dur="8s"
					repeatCount="indefinite"
					values="200; 220; 200"
					keyTimes="0; 0.5; 1"
				/>

				<animate
					xlinkHref="#bubble2"
					attributeName="cy"
					from="450"
					to="420"
					dur="10s"
					repeatCount="indefinite"
					values="450; 420; 450"
					keyTimes="0; 0.5; 1"
				/>

				<animate
					xlinkHref="#bubble3"
					attributeName="cy"
					from="700"
					to="740"
					dur="12s"
					repeatCount="indefinite"
					values="700; 740; 700"
					keyTimes="0; 0.5; 1"
				/>

				<animate
					xlinkHref="#bubble4"
					attributeName="cx"
					from="150"
					to="180"
					dur="15s"
					repeatCount="indefinite"
					values="150; 180; 150"
					keyTimes="0; 0.5; 1"
				/>

				<animate
					xlinkHref="#bubble5"
					attributeName="cx"
					from="450"
					to="420"
					dur="9s"
					repeatCount="indefinite"
					values="450; 420; 450"
					keyTimes="0; 0.5; 1"
				/>

				<animate
					xlinkHref="#bubble6"
					attributeName="cx"
					from="250"
					to="270"
					dur="14s"
					repeatCount="indefinite"
					values="250; 270; 250"
					keyTimes="0; 0.5; 1"
				/>
			</defs>

			<rect width="414" height="900" fill="url(#mainGradient)" />

			<ellipse
				cx="200"
				cy="250"
				rx="250"
				ry="180"
				fill="url(#radialGradient1)"
				filter="url(#softBlur)"
			/>
			<ellipse
				cx="400"
				cy="650"
				rx="280"
				ry="180"
				fill="url(#radialGradient2)"
				filter="url(#softBlur)"
			/>
			<ellipse
				cx="300"
				cy="400"
				rx="220"
				ry="150"
				fill="url(#radialGradient3)"
				filter="url(#softBlur)"
			/>

			<circle
				id="bubble1"
				cx="100"
				cy="200"
				r="30"
				fill="#F8E2CF"
				opacity="0.6"
				filter="url(#softBlur)"
			>
				<animate
					attributeName="cy"
					from="200"
					to="220"
					dur="8s"
					repeatCount="indefinite"
					values="200; 220; 200"
					keyTimes="0; 0.5; 1"
				/>
			</circle>

			<circle
				id="bubble2"
				cx="500"
				cy="450"
				r="40"
				fill="#E4D4C8"
				opacity="0.5"
				filter="url(#softBlur)"
			>
				<animate
					attributeName="cy"
					from="450"
					to="420"
					dur="10s"
					repeatCount="indefinite"
					values="450; 420; 450"
					keyTimes="0; 0.5; 1"
				/>
			</circle>

			<circle
				id="bubble3"
				cx="350"
				cy="700"
				r="35"
				fill="#F9E6D2"
				opacity="0.7"
				filter="url(#softBlur)"
			>
				<animate
					attributeName="cy"
					from="700"
					to="740"
					dur="12s"
					repeatCount="indefinite"
					values="700; 740; 700"
					keyTimes="0; 0.5; 1"
				/>
			</circle>

			<circle
				id="bubble4"
				cx="150"
				cy="600"
				r="25"
				fill="#E8D8C3"
				opacity="0.6"
				filter="url(#softBlur)"
			>
				<animate
					attributeName="cx"
					from="150"
					to="180"
					dur="15s"
					repeatCount="indefinite"
					values="150; 180; 150"
					keyTimes="0; 0.5; 1"
				/>
			</circle>

			<circle
				id="bubble5"
				cx="450"
				cy="150"
				r="35"
				fill="#F2E2D2"
				opacity="0.5"
				filter="url(#softBlur)"
			>
				<animate
					attributeName="cx"
					from="450"
					to="420"
					dur="9s"
					repeatCount="indefinite"
					values="450; 420; 450"
					keyTimes="0; 0.5; 1"
				/>
			</circle>

			<circle
				id="bubble6"
				cx="250"
				cy="800"
				r="30"
				fill="#F5DBC8"
				opacity="0.6"
				filter="url(#softBlur)"
			>
				<animate
					attributeName="cx"
					from="250"
					to="270"
					dur="14s"
					repeatCount="indefinite"
					values="250; 270; 250"
					keyTimes="0; 0.5; 1"
				/>
			</circle>
		</svg>
	);
}

export default Background;
