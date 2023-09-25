import React, { useState } from 'react';
import { Http } from '../../common';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from './GoogleLogin';
import styled from 'styled-components';
import Layout from 'component/layout/Layout';

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

function LoginPage() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const onChangeId = (e) => {
        const { value } = e.target;
        setId(value);
    };

    const onChangePassword = (e) => {
        const { value } = e.target;
        setPassword(value);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(Http + '/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: id, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const data = await response.json();
            sessionStorage.setItem('token', data.token);
            console.log(data);
            navigate('/mypage');
        } catch (error) {
            console.error('Error during login:', error.message);
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
                    &nbsp;
                    <GoogleLoginButton />
                </LoginForm>
            </LoginContainer>
        </>
    );
}

export default LoginPage;
