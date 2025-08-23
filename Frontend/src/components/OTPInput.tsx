import React, { useState, useRef, useEffect } from "react";

interface OTPInputProps {
	length: number;
	onComplete: (otp: string) => void;
	value?: string;
}

const OTPInput: React.FC<OTPInputProps> = ({
	length,
	onComplete,
	value = "",
}) => {
	const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	useEffect(() => {
		if (value) {
			const otpArray = value.split("").slice(0, length);
			while (otpArray.length < length) {
				otpArray.push("");
			}
			setOtp(otpArray);
		}
	}, [value, length]);

	const handleChange = (index: number, digit: string) => {
		if (isNaN(Number(digit))) return;

		const newOtp = [...otp];
		newOtp[index] = digit;
		setOtp(newOtp);

		// Auto-focus next input
		if (digit && index < length - 1) {
			inputRefs.current[index + 1]?.focus();
		}

		// Call onComplete when all fields are filled
		if (newOtp.every((d) => d !== "") && newOtp.join("").length === length) {
			onComplete(newOtp.join(""));
		}
	};

	const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
		if (e.key === "Backspace") {
			if (otp[index] === "" && index > 0) {
				// Move to previous input if current is empty
				inputRefs.current[index - 1]?.focus();
			} else {
				// Clear current input
				const newOtp = [...otp];
				newOtp[index] = "";
				setOtp(newOtp);
			}
		} else if (e.key === "ArrowLeft" && index > 0) {
			inputRefs.current[index - 1]?.focus();
		} else if (e.key === "ArrowRight" && index < length - 1) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");

		if (pastedData.length >= length) {
			const newOtp = pastedData.slice(0, length).split("");
			setOtp(newOtp);
			onComplete(newOtp.join(""));
			inputRefs.current[length - 1]?.focus();
		}
	};

	return (
		<div className="flex gap-3 justify-center">
			{otp.map((digit, index) => (
				<input
					key={index}
					ref={(el) => (inputRefs.current[index] = el)}
					type="text"
					inputMode="numeric"
					maxLength={1}
					value={digit}
					onChange={(e) => handleChange(index, e.target.value)}
					onKeyDown={(e) => handleKeyDown(index, e)}
					onPaste={handlePaste}
					className="otp-input"
					autoFocus={index === 0}
				/>
			))}
		</div>
	);
};

export default OTPInput;
