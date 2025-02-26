import { useEffect, useState } from "react";
import "./StartScreen.css";

const StartScreen = ({ className, onStartClick }) => {
	const [text, setText] = useState("");
	const fullText = "Upload your file and see the magic happen";
	const [index, setIndex] = useState(0);
	const [showCursor, setShowCursor] = useState(true);

	// Typing effect
	useEffect(() => {
		if (index < fullText.length) {
			const timeout = setTimeout(() => {
				setText((prev) => prev + fullText.charAt(index));
				setIndex((prev) => prev + 1);
			}, 70); // Adjust typing speed here (lower = faster)

			return () => clearTimeout(timeout);
		}
	}, [index, fullText]);

	// Blinking cursor effect
	useEffect(() => {
		const cursorInterval = setInterval(() => {
			setShowCursor((prev) => !prev);
		}, 530); // Cursor blink rate

		return () => clearInterval(cursorInterval);
	}, []);

	return (
		<div className={className}>
			<div className="start-container">
				<div className="start-content">
					<h1>HairPower</h1>
					<p className="typing-text">
						{text}
						<span
							className={`cursor ${
								showCursor ? "visible" : "hidden"
							}`}
						>
							|
						</span>
					</p>
					<button
						className="start-button"
						onClick={onStartClick}
						// Only enable the button after typing is complete for better UX
						disabled={index < fullText.length}
					>
						Start -&gt;
					</button>
				</div>
			</div>
		</div>
	);
};

export default StartScreen;
