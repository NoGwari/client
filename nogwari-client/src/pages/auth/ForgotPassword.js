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
                headers: {
                    'Content-Type': 'application/json',
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
                <Loginword>로그인하기</Loginword>
                <LoginForm onSubmit={handleLogin}>
                    <Input value={id} onChange={onChangeId} type="text" placeholder="아이디" maxLength={20} />
                    <Input value={password} onChange={onChangePassword} type="password" placeholder="패스워드" />
                    <Button type="submit">로그인</Button>
                    <Forgot onClick={Forget}>비밀번호를 잊어버렸어요</Forgot>
                    &nbsp;
                    <GoogleLoginButton />
                </LoginForm>
            </LoginContainer>
        </>
    );
}

export default ForgotPassword;
