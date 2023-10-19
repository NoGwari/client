import React, { useState } from 'react';
import { Http } from '../../common';
import styled from 'styled-components';
import Layout from 'component/layout/Layout';

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
const VarifyNum = styled.input`
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
const VarifyButton = styled.button`
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
`;

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [nickname, setNickname] = useState('');
    const [emailNum, setEmailNum] = useState('');
    const [showVarifyNum, setShowVarifyNum] = useState(false);

    const onChangeEmail = (e) => {
        const { value } = e.target;
        setEmail(value);
    };
    const onChangeemailNum = (e) => {
        const { value } = e.target;
        setEmailNum(value);
    };
    const onChangePassword = (e) => {
        const { value } = e.target;
        setPassword(value);
    };
    const onChangePasswordCheck = (e) => {
        const { value } = e.target;
        setPasswordCheck(value);
    };
    const onChangeNickname = (e) => {
        const { value } = e.target;
        setNickname(value);
    };
    const checkPasswordMatch = () => {
        return password === passwordCheck;
    };

    const signIn = async (e) => {
        e.preventDefault();
        console.log('ehlsi?');
        try {
            const response = await fetch(Http + '/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, password, nickname: nickname }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
        } catch (error) {
            console.error('Error during login:', error.message);
        }
    };

    const emailVarify = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(Http + '/auth/mailsubmit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            console.log('인증번호 보내는증');
            setShowVarifyNum(true);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
        } catch (error) {
            console.error('Error during login:', error.message);
        }
    };

    return (
        <>
            <Layout></Layout>
            {/* <input value={email} onChange={onChangeEmail} type="text" placeholder="이메일" />
            <button type="submit" onClick={emailVarify}>
                인증
            </button>
            <input value={password} onChange={onChangePassword} type="password" placeholder="비밀번호(바꿀거)" />
            <input value={passwordCheck} onChange={onChangePasswordCheck} type="password" placeholder="비밀번호 확인" />
            <input value={nickname} onChange={onChangeNickname} placeholder="닉네임" />
            {!checkPasswordMatch() && <p style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</p>}
            <button type="submit" onClick={signIn}>
                로그인
            </button>
            <br /> */}
            <SignInContainer>
                <SignInword>회원가입</SignInword>
                <SignInForm onSubmit={emailVarify}>
                    <Input value={email} onChange={onChangeEmail} type="text" placeholder="E-mail" maxLength={20} />
                    <VarifyNum
                        show={showVarifyNum}
                        value={emailNum}
                        onChange={onChangeemailNum}
                        type="text"
                        placeholder="인증번호"
                    ></VarifyNum>

                    {showVarifyNum ? (
                        <VarifyButton>인증코드 입력</VarifyButton>
                    ) : (
                        <Button type="submit">이메일 인증</Button>
                    )}
                </SignInForm>
            </SignInContainer>
        </>
    );
}

export default SignIn;
