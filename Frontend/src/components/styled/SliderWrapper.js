import styled, { keyframes } from "styled-components";

const Slide = (leftStart, leftEnd) => keyframes`
	from {
		transform: translateX(${leftStart}vw);
	} to {
		transform: translateX(${leftEnd}vw);
	}

`;

export const SliderWrapper = styled.div`
	position: absolute;
	width: 90%;
	height: 100%;
	display: flex;
	overflow-y: hidden;
	overflow-x: hidden;

	animation-duration: 0.4s;
	animation-timing-function: ease-out;
	animation-name: ${({ leftStart, leftEnd }) => Slide(leftStart, leftEnd)};
	animation-fill-mode: both;

	@media screen and (max-width: 500px) {
		width: 100%;
		overflow-y: scroll;
		animation-name: ${({ leftStart, leftEnd }) => Slide(leftStart, leftEnd - 5)};
`;
