import styled from "styled-components";

export const BaseFlexWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const BaseFlexColWrapper = styled(BaseFlexWrapper)`
	flex-direction: column;
`;

export const Wrapper = styled(BaseFlexWrapper)`
	background-color: ${({ color }) => color};
	width: 100vw;
	min-height: 100vh;
	align-items: ${({ alignItems }) => alignItems};

	@media screen and (max-width: 500px) {
		width: 100vw;
	}
`;

export const MobileSizeWrapper = styled(Wrapper)`
	display: flex;
	flex-direction: column;
	width: 400px;
`;

export const RoundedWrapper = styled(BaseFlexWrapper)`
	border-radius: 40px;
	flex-direction: ${(props) => props.flexDirection};
	background-color: #131317;
	width: ${(props) => props.width}px;
	height: ${(props) => props.height}px;
	position: relative;

	@media screen and (max-width: 500px) {
		width: ${(props) => props.mWidth}px;
		height: ${(props) => props.mHeight}px;
	}
`;

export const InputWrapper = styled.input`
	width: ${({ width }) => width};
	height: ${({ height }) => height};
	border-radius: 8px;
	border: 1px solid #d0d0d0;
	background-color: white;
	padding-left: 0.5rem;
	position: relative;
`;

export const ButtonWrapper = styled.div`
	display: flex;
	width: ${({ width }) => width};
	height: ${({ height }) => height};
	border-radius: 8px;
	border: 1px solid #767676;
	background-color: #ffffff;
	text-align: center;
	justify-content: center;
	align-items: center;
	font-weight: bold;
`;

InputWrapper.defaultProps = {
	width: "270px",
	height: "52px",
};

ButtonWrapper.defaultProps = {
	width: "100px",
	height: "52px",
};

RoundedWrapper.defaultProps = {
	flexDirection: "row",
};

Wrapper.defaultProps = {
	color: "white",
	alignItems: "center",
};
