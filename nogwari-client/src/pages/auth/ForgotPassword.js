import React, { useState, useCallback, useRef } from 'react';
import { Http } from '../../common';
import styled from 'styled-components';
import Layout from 'component/layout/Layout';
import { Form } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { MdContentCopy } from 'react-icons/md';
import { FaCheck } from 'react-icons/fa';
const ForgotContainer = styled.div`
    text-align: center;
`;
const Forgotword = styled.div`
    color: black;
    font-weight: bold;
    font-size: 20px;
    text-align: center;
    margin-top: 80px;
`;
const ForgotForm = styled.form`
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

const TemporaryPassword = styled.div`
    width: 80%;
    padding: 10px;
    height : 100%
    margin-bottom: 10px;
    box-sizing: border-box;
    display: inline-block;
    border: 1px solid #ccc;
`;

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [verifyKey, setVerifyKey] = useState('');
    const [randomPassword, setRandomPassword] = useState('');
    const [showVerifyNum, setShowVerifyNum] = useState(false);

    const [EmailMessage, setEmailMessage] = useState('');

    const [isEmail, setIsEmail] = useState(false);
    const [isVerifyNumEntered, setIsVerifyNumEntered] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const textRef = useRef(null);

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

    const ForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(Http + '/user/mailSubmitForInitPassword', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    accept: '*/*',
                },
                body: JSON.stringify({ email: email }),
            });
            if (response.ok) {
                console.log('인증 확인');
                setShowVerifyNum(true);
            } else if (response.status === 404) {
                console.log('없는 이메일');
               alert('가입되지 않은 이메일입니다.');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
        } catch (error) {
            console.error('Error', error.message);
        }
    };

    const InitPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(Http + '/user/initpassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, verifyKey: verifyKey }),
            });
            if (response.ok) {
                const responseData = await response.json();
                const randomPassword = responseData.randomPassword;
                console.log('랜덤 비빌번호 :', randomPassword);
                setRandomPassword(randomPassword);
                setIsVerifyNumEntered(true);
            } else if (response.status === 404) {
                console.log('코드 불일치');
               alert('인증코드를 제대로 입력해주세요.');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
        } catch (error) {
            console.error('Error', error.message);
        }
    };
    const toClipboard = async () => {
        try {
            await navigator.clipboard.writeText(randomPassword);
            setIsCopied(true);
        } catch (err) {
            console.error('클립보드 복사 실패:', err);
        }
    };
    const copyPassword = (e) => {
        e.preventDefault();
        toClipboard();
    };

    const gotologin = (e) => {
        e.preventDefault();
        navigate('/login');
    };
    return (
        <>
            <Layout />
            {isVerifyNumEntered ? (
                <ForgotContainer>
                    <Forgotword>임시 비밀번호</Forgotword>
                    <ForgotForm>
                        <FormBox>
                            <TemporaryPassword>
                                {randomPassword} &nbsp;
                                <span onClick={(e) => copyPassword(e)} style={{ cursor: 'pointer' }}>
                                    {isCopied ? <FaCheck /> : <MdContentCopy />}
                                </span>
                            </TemporaryPassword>
                            {isCopied && <p style={{ fontSize: '12px' }}>복사되었습니다!</p>}
                        </FormBox>
                        <FormBox>
                            <VerifyButton onClick={gotologin}>로그인하러가기</VerifyButton>
                        </FormBox>
                    </ForgotForm>
                </ForgotContainer>
            ) : (
                <ForgotContainer>
                    <Forgotword>비밀번호찾기</Forgotword>
                    <ForgotForm onSubmit={ForgotPassword}>
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
                                <VerifyButton onClick={InitPassword}>인증코드 입력</VerifyButton>
                            ) : (
                                <StyledButton type="submit" disabled={!isEmail}>
                                    이메일 인증
                                </StyledButton>
                            )}
                        </FormBox>
                        &nbsp;
                    </ForgotForm>
                </ForgotContainer>
            )}
        </>
    );
}

export default ForgotPassword;
