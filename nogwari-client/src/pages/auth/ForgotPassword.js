import React, { useState, useCallback } from 'react';
import { Http } from '../../common';
import styled from 'styled-components';
import Layout from 'component/layout/Layout';
import { Form } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const LoginContainer = styled.div`
    text-align: center;
`;
const Loginword = styled.div`
    color: black;
    font-weight: bold;
    font-size: 20px;
    text-align: center;
    margin-top: 80px;
`;
const LoginForm = styled.form`
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

const Button = styled.button`
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
`;
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

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [EmailMessage, setEmailMessage] = useState('');
    const [isEmail, setIsEmail] = useState(false);

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
                body: {
                    email: email,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            const data = await response.json();
            console.log(data);
        } catch {
            console.error('비밀번호 코드 오류');
        }
    };

    return (
        <>
            <Layout />
            <LoginContainer>
                <Loginword>비밀번호찾기</Loginword>
                <LoginForm onSubmit={ForgotPassword}>
                    <FormBox>
                        <div>
                            <Input
                                value={email}
                                onChange={onChangeEmail}
                                type="text"
                                placeholder="E-mail"
                                maxLength={20}
                            />
                            <span style={{ fontSize: '13px' }} className={`message ${isEmail ? 'success' : 'error'}`}>
                                {EmailMessage}
                            </span>
                        </div>
                    </FormBox>
                    <Button type="submit">인증코드 전송</Button>
                    &nbsp;
                </LoginForm>
            </LoginContainer>
        </>
    );
}

export default ForgotPassword;
