import React, { useState, useCallback } from 'react';
import { Http } from '../../common';
import styled from 'styled-components';
import Layout from 'component/layout/Layout';
import { Form } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SignInContainer = styled.div`
    text-align: center;
`;
const SignInword = styled.div`
    color: black;
    font-weight: bold;
    font-size: 20px;
    text-align: center;
    margin-top: 80px;
`;
const SignInForm = styled.form`
    item-align: center;
    max-width: 300px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    margin-top: 20px;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    box-sizing: border-box;
`;

const StyledButton = styled.button`
    width: 100%;
    padding: 10px;
    color: #fff;
    border: none;
    cursor: pointer;
    background-color: #007bff;
    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;
const VerifyButton = styled.button`
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
`;

const FormBox = styled.div`
    position: relative;
    margin-bottom: 20px;

    .message {
        font-weight: 500;
        font-size: 2.6rem;
        line-height: 24px;
        letter-spacing: -1px;
        position: absolute;
        bottom: -10px;
        left: 0;

        &.success {
            color: #8f8c8b;
        }

        &.error {
            color: #ff2727;
        }
    }
`;

function SignIn() {
    const [email, setEmail] = useState('');
    const [verifyKey, setVerifyKey] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [nickname, setNickname] = useState('');
    const [showVerifyNum, setShowVerifyNum] = useState(false);

    const [EmailMessage, setEmailMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordConfirmMessage, setPasswordConfirmMessage] = useState('');
    const [NicknameMessage, setNickNameMessage] = useState('');

    const [isEmail, setIsEmail] = useState(false);
    const [isNickName, setIsNickName] = useState(false);
    const [isPassword, setIsPassword] = useState(false);
    const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);
    const [isVerifyNumEntered, setIsVerifyNumEntered] = useState(false);
    const [ischeckKey, setIscheckKey] = useState(false);

    const navigate = useNavigate();

    const onChangeEmail = useCallback((e) => {
        const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const EmailCurrent = e.target.value;
        setEmail(EmailCurrent);

        if (!EmailRegex.test(EmailCurrent)) {
            setEmailMessage('이메일 형식으로 부탁해요!');
            setIsEmail(false);
        } else {
            setEmailMessage('이메일 주소를 확인했어요!');
            setIsEmail(true);
        }
    }, []);

    const onChangeVerifykey = (e) => {
        const { value } = e.target;
        setVerifyKey(value);
    };
    const onChangePassword = useCallback((e) => {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
        const passwordCurrent = e.target.value;
        setPassword(passwordCurrent);

        if (!passwordRegex.test(passwordCurrent)) {
            setPasswordMessage('숫자+영문자+특수문자 조합으로 8자리 이상!');
            setIsPassword(false);
        } else {
            setPasswordMessage('안전한 비밀번호에요!');
            setIsPassword(true);
        }
    }, []);

    const onChangePasswordCheck = useCallback(
        (e) => {
            const passwordConfirmCurrent = e.target.value;
            setPasswordCheck(passwordConfirmCurrent);

            if (password === passwordConfirmCurrent) {
                setPasswordConfirmMessage('비밀번호를 똑같이 입력했어요!');
                setIsPasswordConfirm(true);
            } else {
                setPasswordConfirmMessage('비밀번호가 틀려요. 다시 확인해주세요');
                setIsPasswordConfirm(false);
            }
        },
        [password]
    );

    const onChangeNickname = useCallback((e) => {
        const nickname = e.target.value;
        setNickname(nickname);
        if (nickname.length > 10 || nickname.length == 0) {
            setNickNameMessage('닉네임은 10글자 미만으로 작성해 주세요.');
            setIsNickName(false);
        } else {
            setNickNameMessage('마음에 들어요!');
            setIsNickName(true);
        }
    }, []);

    const signUP = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(Http + '/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, password: password, nickname: nickname }),
            });
            window.confirm('회원가입을 완료했습니다.');
            navigate('/board');

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            } else if (response.status === 409) {
                window.confirm('이미 가입된 정보가 있습니다.');
            }
        } catch (error) {
            console.error('Error during login:', error.message);
        }
    };

    const emailVerify = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(Http + '/auth/mailsubmit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            if (response.ok) {
                console.log('인증번호 보내는증');
                setShowVerifyNum(true);
            } else if (response.status === 409) {
                window.confirm('이미 가입된 정보가 있습니다.');
                setShowVerifyNum(false);
                setEmail('');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
        } catch (error) {
            console.error('Error during login:', error.message);
        }
    };

    const Verifykey = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(Http + '/auth/checkkey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, verifyKey: verifyKey }),
            });
            console.log('인증키 확인', verifyKey);

            if (response.ok) {
                setIscheckKey(true);
                console.log('인증 확인');
                setIsVerifyNumEntered(true);
            } else if (response.status === 404) {
                setIscheckKey(false);
                console.log('코드 불일치');
                window.confirm('인증코드를 제대로 입력해주세요.');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
        } catch (error) {
            console.error('Error', error.message);
        }
    };

    return (
        <>
            <Layout></Layout>
            {isVerifyNumEntered ? (
                <SignInContainer>
                    <SignInword>회원가입</SignInword>
                    <SignInForm>
                        <FormBox>
                            <Input
                                style={{ fontSize: '14px' }}
                                value={nickname}
                                onChange={onChangeNickname}
                                type="text"
                                placeholder="닉네임"
                                maxLength={10}
                            />
                            <span
                                style={{ fontSize: '13px' }}
                                className={`message ${isNickName ? 'success' : 'error'}`}
                            >
                                {NicknameMessage}
                            </span>
                        </FormBox>
                        <FormBox>
                            <Input
                                style={{ fontSize: '14px' }}
                                value={password}
                                onChange={onChangePassword}
                                type="password"
                                placeholder="비밀번호"
                                maxLength={20}
                            />
                            <span
                                style={{ fontSize: '13px' }}
                                className={`message ${isPassword ? 'success' : 'error'}`}
                            >
                                {passwordMessage}
                            </span>
                        </FormBox>
                        <FormBox>
                            <Input
                                style={{ fontSize: '14px' }}
                                value={passwordCheck}
                                onChange={onChangePasswordCheck}
                                type="password"
                                placeholder="비밀번호확인"
                                maxLength={20}
                            />
                            <span
                                style={{ fontSize: '13px' }}
                                className={`message ${isPasswordConfirm ? 'success' : 'error'}`}
                            >
                                {passwordConfirmMessage}
                            </span>
                        </FormBox>
                        <StyledButton
                            type="submit"
                            onClick={signUP}
                            disabled={!(isNickName && isPassword && isPasswordConfirm)}
                        >
                            회원가입
                        </StyledButton>
                    </SignInForm>
                </SignInContainer>
            ) : (
                <SignInContainer>
                    <SignInword>회원가입</SignInword>
                    <SignInForm onSubmit={emailVerify}>
                        <FormBox>
                            {showVerifyNum ? (
                                <Input
                                    style={{ fontSize: '14px' }}
                                    show={showVerifyNum}
                                    value={verifyKey}
                                    onChange={onChangeVerifykey}
                                    type="text"
                                    placeholder="인증번호"
                                />
                            ) : (
                                <div>
                                    <Input
                                        value={email}
                                        onChange={onChangeEmail}
                                        type="text"
                                        placeholder="E-mail"
                                        maxLength={40}
                                    />
                                    <span
                                        style={{ fontSize: '13px' }}
                                        className={`message ${isEmail ? 'success' : 'error'}`}
                                    >
                                        {EmailMessage}
                                    </span>
                                </div>
                            )}
                        </FormBox>
                        <FormBox>
                            {showVerifyNum ? (
                                <VerifyButton onClick={Verifykey}>인증코드 입력</VerifyButton>
                            ) : (
                                <StyledButton type="submit" disabled={!isEmail}>
                                    이메일 인증
                                </StyledButton>
                            )}
                        </FormBox>
                    </SignInForm>
                </SignInContainer>
            )}
        </>
    );
}

export default SignIn;
