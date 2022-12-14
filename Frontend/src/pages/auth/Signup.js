import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Wrapper, MobileSizeWrapper, InputWrapper, InputFullWrapper } from "./../../components/styled/Wrapper";
import { BaseForm } from "../../components/common/forms/Form";
import InputCheckButton from "./../../components/common/buttons/InputCheckButton";
import { useNavigate } from "react-router-dom";
import NumberCircle from "./../../components/auth/NumberCircle";
import { ProgressBlock, ProgressDescription, SignupBody, SignupHeader } from "../../components/styled/Signup";
import { emailConfirm, emailDuplicateCheck, emailSendConfirm, login, nickNameDuplicateCheck, signup } from "../../api/AuthAPI";
import Header from "./../../components/layout/Header";
import Button from "./../../components/common/buttons/Button";
import EmptySpace from "./../../components/layout/EmptySpace";
import { getUser } from "../../api/MyPageAPI";
import { useDispatch } from "react-redux";
import { storeLogin, storeLogout } from "../../store/reducers/user";
import Loading from "./../../components/common/Loading";
import { useSelector } from "react-redux";

const InputBlock = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;
`;

const InputTag = styled.div`
	margin-top: 2rem;
	@media screen and (max-width: 500px) {
		font-size: 0.9rem;
	}
`;

const AlertTag = styled.div`
	display: ${({ display }) => display};
	color: ${({ color }) => color};
	font-size: 0.8rem;
`;

const BirthSelectBox = styled.select`
	width: 30%;
	height: 52px;
	background-color: white;
	border-radius: 8px;
	border: 1px solid #d0d0d0;
	text-align: center;
	font-size: 0.9rem;
`;

const Signup = () => {
	const [loading, setLoading] = useState(false);
	const [state, setState] = useState({
		userEmail: "",
		userEmailCode: "",
		password: "",
		password2: "",
		userName: "",
		userNickName: "",
		userPhone: "",
		userBirth: "",
		userGender: "M",
		userCategory: [],
		userEmailChecked: false,
		userEmailConfirmed: false,
		passwordChecked: false,
		userNickNameChecked: false,
	});

	const [valid, setValid] = useState({
		passwordNotValid: false,
		passwordNotMatch: false,
	});

	const [birthDate, setBirthDate] = useState({
		year: "2022",
		month: "01",
		day: "01",
	});

	const emailConfirmRef = useRef([]);
	const passwordRef = useRef([]);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	// input ??? ?????? ??? ?????????
	const onHandleInput = (e) => {
		if (e.target.name === "userEmail") setState({ ...state, ["userEmailChecked"]: false });
		setState({ ...state, [e.target.name]: e.target.value });
	};

	// ????????? ?????? ??????
	const onHandleEmailDuplicateCheck = async (e) => {
		e.preventDefault();
		if (state.userEmailChecked) {
			alert("?????? ????????? ????????? ??????????????????.");
			return;
		}
		if (state.userEmail.length < 1) {
			alert("???????????? ??????????????????.");
			return;
		}

		const response = await emailDuplicateCheck(state.userEmail);

		if (response.code === 200) {
			const finish = confirm("?????? ????????? ??????????????????. ??? ???????????? ????????? ?????????????????????????");
			if (finish) {
				alert("????????? ???????????? ??????????????? ??????????????????. ???????????? ??????????????? ??????????????????.");
				sendConfirmEmail();
				setState({ ...state, ["userEmailChecked"]: true });
				emailConfirmRef.current[0].disabled = true;
				emailConfirmRef.current[0].style.backgroundColor = "#f0f0f0";
				emailConfirmRef.current[1].disabled = false;
				emailConfirmRef.current[1].style.backgroundColor = "#ffffff";
			}
		} else if (response.code === 401) {
			alert("?????? ????????? ??????????????????.");
		} else {
			alert("????????? ??????????????????.");
		}
	};

	// ????????? ?????? ?????? ??????
	const sendConfirmEmail = async () => {
		const response = await emailSendConfirm(state.userEmail);
	};

	// ????????? ??????
	const onHandleEmailConfirm = async (e) => {
		e.preventDefault();
		if (!state.userEmailChecked) {
			alert("?????? ????????? ?????? ??? ?????????.");
			return;
		}
		if (state.userEmailCode.length < 1) {
			alert("????????? ?????? ????????? ??????????????????.");
			return;
		}

		const response = await emailConfirm({ userToken: state.userEmailCode });

		if (response.code === 200) {
			// ???????????? ???????????? ?????? ??? (30???)
			const timeGap = new Date().getTime() - new Date(response.????????????).getTime();
			const timeGapMinute = timeGap / 1000 / 60;
			if (timeGapMinute >= 30) {
				alert("????????? ??????????????? ?????? ????????? ?????????????????????. ????????? ?????? ??????????????????.");
				setState({ ...state, userEmailCode: "", userEmailChecked: false });
				emailConfirmRef.current[0].disabled = false;
				emailConfirmRef.current[0].style.backgroundColor = "white";
				emailConfirmRef.current[1].disabled = true;
				emailConfirmRef.current[1].style.backgroundColor = "#f0f0f0";
				return;
			}

			// ?????? ??????
			alert("????????? ????????? ?????????????????????.");
			setState({ ...state, userEmailConfirmed: true });
			emailConfirmRef.current[1].disabled = true;
			emailConfirmRef.current[1].style.backgroundColor = "#f0f0f0";
		} else {
			alert("?????? ????????? ?????????????????????. ?????? ??????????????????.");
		}
	};

	// ???????????? ????????? ??????
	const userPwRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,12}$/i;
	const userPwCheck = (e) => {
		onHandleInput(e);

		if (!userPwRegex.test(state.password)) {
			setValid({ ...valid, passwordNotMatch: false });
			setValid({ ...valid, passwordNotValid: true });
		} else {
			setValid({ ...valid, passwordNotMatch: false });
			setValid({ ...valid, passwordNotValid: false });
		}
	};

	// ????????????, ????????????????????? ?????? ??????
	const userPwMatch = (e) => {
		onHandleInput(e);

		if (state.password !== state.password2) {
			setValid({ ...valid, passwordNotValid: false });
			setValid({ ...valid, passwordNotMatch: true });
		} else {
			setValid({ ...valid, passwordNotValid: false });
			setValid({ ...valid, passwordNotMatch: false });
		}
	};

	// ????????? ?????? ??????
	const onHandleNickNameDuplicateCheck = async (e) => {
		e.preventDefault();
		if (state.userNickNameChecked) {
			alert("?????? ????????? ????????? ??????????????????.");
			return;
		}
		if (state.userNickName.length < 1) {
			alert("???????????? ??????????????????.");
			return;
		}

		const response = await nickNameDuplicateCheck(state.userNickName);

		if (response.code === 200) {
			const finish = confirm("?????? ????????? ??????????????????. ??? ??????????????? ????????? ?????????????????????????");
			if (finish) {
				setState({ ...state, ["userNickNameChecked"]: true });
				emailConfirmRef.current[2].disabled = true;
				emailConfirmRef.current[2].style.backgroundColor = "#f0f0f0";
			}
		} else if (response.code === 401) {
			alert(response.message);
		} else {
			alert("????????? ??????????????????.");
		}
	};

	// ?????? ??????
	const changeGender = (val) => {
		setState({ ...state, userGender: val });
	};

	const submitForm = async () => {
		const response = await signup(state);

		if (response.code === 200 || response.code === 201) {
			return;
		} else {
			alert("??????????????? ??????????????????.");
		}
	};

	const loginOnSignup = async () => {
		const response = await login({
			userEmail: state.userEmail,
			password: state.password,
		});
		console.log(response);
		if (response.status === 200) {
			// ?????? ??? ?????? sessionStorage??? ??????
			const accessToken = response.data.token.access;
			const refreshToken = response.data.token.refresh;
			sessionStorage.setItem("ACCESS_TOKEN", accessToken);
			sessionStorage.setItem("REFRESH_TOKEN", refreshToken);

			// ?????? ?????? ?????? ?????? api ??????
			const userData = await getUser();

			// ????????? ???????????? ?????? dispatch -> data??? ??????
			dispatch(storeLogin({ isLogin: true, data: userData }));

			// ??????
			navigate("/signupinterests", { state: state });
		} else {
			alert("???????????? ??? ????????? ??????????????????. ?????? ??????????????????.");
			navigate("/");
			return;
		}
	};

	// ?????? ??? ??????
	const submitState = async () => {
		// ????????? ?????? ?????? ??????
		if (!state.userEmailChecked || !state.userEmailConfirmed) {
			alert("???????????? ?????? ??????????????????.");
			return;
		}
		// ???????????? : ?????? 8??????, notmatch??? notvalid ?????? ????????? ??????
		if (state.password.length < 8 || state.password2.length < 8 || valid.passwordNotMatch || valid.passwordNotValid) {
			alert("??????????????? ?????? ??????????????????.");
			return;
		}
		// ?????? : ?????? ??????
		if (state.userName.length < 1 || state.userName.length > 12) {
			alert("????????? 1?????? ?????? 12?????? ???????????? ?????????.");
			return;
		}
		// ?????? : ????????? ??????
		const nameRegex = /^[???-???|???-???|a-z|A-Z|]+$/;
		if (!nameRegex.test(state.userName)) {
			alert("????????? ???????????? ??????????????????.");
			return;
		}
		// ????????? : ?????? ??????
		if (state.userNickName.length < 1 || state.userName.length > 12) {
			alert("???????????? 1?????? ?????? 12?????? ???????????? ?????????.");
			return;
		}
		if (!state.userNickNameChecked) {
			// ????????? : ?????? ?????? ??????
			alert("????????? ?????? ????????? ????????????.");
			return;
		}
		// ?????? : 2021?????? ?????? ??????
		const now = new Date();
		if (parseInt(now.getFullYear()) - parseInt(state.userBirth.substring(0, 4)) < 4) {
			alert("5??? ????????? ????????? ??? ????????????.");
			return;
		}
		// ???????????????
		const phoneRegex = /^[0-9]+$/;
		if (!phoneRegex.test(state.userPhone)) {
			alert("????????? ????????? ???????????? ??????????????????.");
			return;
		}

		setLoading(true);
		submitForm();
		setTimeout(() => loginOnSignup(), 1000);
		setLoading(false);
	};

	const userData = useSelector((state) => state.user.value);
	useEffect(() => {
		window.scrollTo(0, 0);
		if (userData.isLogin) {
			dispatch(storeLogout());
		}
	}, []);

	useEffect(() => {
		setState({
			...state,
			userBirth: birthDate.year + "-" + birthDate.month + "-" + birthDate.day,
		});
	}, [birthDate]);

	/* ?????? ????????? ?????? ?????? */
	const now = new Date();

	let years = [];
	for (let y = now.getFullYear(); y >= 1930; y -= 1) {
		years.push(y);
	}

	let month = [];
	for (let m = 1; m <= 12; m += 1) {
		if (m < 10) {
			// ????????? 2????????? ???????????? ?????? ????????? 1?????? ?????? 0??? ????????????
			month.push("0" + m.toString());
		} else {
			month.push(m.toString());
		}
	}
	let days = [];
	let date = new Date(birthDate.year, birthDate.month, 0).getDate();
	for (let d = 1; d <= date; d += 1) {
		if (d < 10) {
			// ????????? 2????????? ???????????? ?????? ????????? 1?????? ?????? 0??? ????????????
			days.push("0" + d.toString());
		} else {
			days.push(d.toString());
		}
	}
	/* ?????? ????????? ?????? ??? */

	return (
		<>
			<Header />
			<Wrapper>
				{loading ? <Loading /> : null}
				<MobileSizeWrapper>
					<SignupHeader>
						<ProgressBlock>
							<NumberCircle color="#C0F0B0" number="1" />
							<ProgressDescription>???????????? ??????</ProgressDescription>
						</ProgressBlock>
						<ProgressBlock>
							<NumberCircle color="#D0D0D0" number="2" />
							<ProgressDescription>???????????? ??????</ProgressDescription>
						</ProgressBlock>
					</SignupHeader>
					<SignupBody>
						<InputTag>????????? (?????????)</InputTag>
						<BaseForm onSubmit={onHandleEmailDuplicateCheck}>
							<InputBlock>
								<InputWrapper
									name="userEmail"
									type="email"
									value={state.userEmail}
									placeholder="user@example.com"
									onChange={onHandleInput}
									ref={(el) => (emailConfirmRef.current[0] = el)}
									width="270px"
								/>
								<InputCheckButton message="?????? ??????" />
							</InputBlock>
						</BaseForm>
						<BaseForm onSubmit={onHandleEmailConfirm}>
							<InputBlock>
								<InputWrapper
									name="userEmailCode"
									value={state.userEmailCode}
									placeholder="????????? ?????? ??????"
									onChange={onHandleInput}
									disabled
									bg="#f0f0f0"
									ref={(el) => (emailConfirmRef.current[1] = el)}
									width="270px"
								/>
								<InputCheckButton message="????????? ??????" />
							</InputBlock>
						</BaseForm>
						<InputTag>????????????</InputTag>
						<InputBlock>
							<InputFullWrapper
								name="password"
								type="password"
								value={state.password}
								placeholder="??????+??????+???????????? ?????? 8~12???"
								onChange={userPwCheck}
								onKeyUp={userPwCheck}
								ref={(el) => (passwordRef.current[0] = el)}
							/>
						</InputBlock>
						<InputBlock>
							<InputFullWrapper
								name="password2"
								type="password"
								value={state.password2}
								placeholder="???????????? ?????????"
								onChange={userPwMatch}
								onKeyUp={userPwMatch}
								ref={(el) => (passwordRef.current[1] = el)}
							/>
						</InputBlock>
						{valid.passwordNotValid ? <AlertTag color="red">????????? ??? ?????? ?????????????????????.</AlertTag> : <AlertTag></AlertTag>}
						{valid.passwordNotMatch ? <AlertTag color="red">??????????????? ???????????? ????????????.</AlertTag> : <AlertTag></AlertTag>}
						{state.passwordChecked ? <AlertTag color="green">????????? ??? ?????? ?????????????????????.</AlertTag> : <AlertTag></AlertTag>}
						<InputTag>??????</InputTag>
						<InputBlock>
							<InputFullWrapper
								name="userName"
								type="text"
								value={state.userName}
								placeholder="????????? ??????????????????."
								onChange={onHandleInput}
								width="100%"
							/>
						</InputBlock>
						<InputTag>?????????</InputTag>
						<BaseForm onSubmit={onHandleNickNameDuplicateCheck}>
							<InputBlock>
								<InputWrapper
									name="userNickName"
									type="text"
									value={state.userNickname}
									placeholder="???????????? ??????????????????."
									onChange={onHandleInput}
									ref={(el) => (emailConfirmRef.current[2] = el)}
									width="270px"
								/>
								<InputCheckButton message="?????? ??????" />
							</InputBlock>
						</BaseForm>
						<InputTag>????????????</InputTag>
						<InputBlock>
							<BirthSelectBox
								value={birthDate.year}
								onChange={(e) => {
									setBirthDate({ ...birthDate, year: e.target.value });
								}}
							>
								{years.map((item) => (
									<option value={item} key={item}>
										{item}
									</option>
								))}
							</BirthSelectBox>
							<BirthSelectBox
								value={birthDate.month}
								onChange={(e) => {
									setBirthDate({ ...birthDate, month: e.target.value });
								}}
							>
								{month.map((item) => (
									<option value={item} key={item}>
										{item}
									</option>
								))}
							</BirthSelectBox>
							<BirthSelectBox
								value={birthDate.day}
								onChange={(e) => {
									setBirthDate({ ...birthDate, day: e.target.value });
								}}
							>
								{days.map((item) => (
									<option value={item} key={item}>
										{item}
									</option>
								))}
							</BirthSelectBox>
						</InputBlock>
						<InputTag>??????</InputTag>
						<InputBlock>
							<Button
								message="???"
								value="M"
								width="45%"
								bg={state.userGender === "M" ? "#c0f0b0" : "#ffffff"}
								borderColor={state.userGender === "M" ? "#80e080" : "#767676"}
								clickEvent={() => changeGender("M")}
							/>
							<Button
								message="???"
								value="F"
								width="45%"
								bg={state.userGender === "F" ? "#c0f0b0" : "#ffffff"}
								borderColor={state.userGender === "F" ? "#80e080" : "#767676"}
								clickEvent={() => changeGender("F")}
							/>
						</InputBlock>
						<InputTag>????????? ??????</InputTag>
						<InputBlock>
							<InputFullWrapper
								name="userPhone"
								type="text"
								value={state.userPhone}
								placeholder="????????? ????????? ??????????????????. (ex. 01012341234)"
								onChange={onHandleInput}
								width="100%"
							/>
						</InputBlock>
						<InputTag></InputTag>
						<Button message="??? ???" width="100%" borderColor="#80E080" color="#80C0A0" clickEvent={() => submitState()}></Button>
					</SignupBody>
					<EmptySpace />
				</MobileSizeWrapper>
			</Wrapper>
		</>
	);
};

export default Signup;
