import React, { useState } from 'react';
import { Http } from '../../common';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [nickname, setNickname] = useState('');

    const onChangeEmail = (e) => {
        const { value } = e.target;
        setEmail(value);
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
                body: JSON.stringify({ email: email, password, nickname: nickname }), // 로그인 요청 데이터 전송
            });

            if (!response.ok) {
                const errorData = await response.json(); // 서버에서 에러 응답을 받으면 에러 데이터를 가져옴
                throw new Error(errorData.message); // 에러 데이터의 메시지를 에러로 던짐
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
                body: JSON.stringify({ email: email }), // 이메일 보내기
            });
            console.log('인증번호 보내는증');

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
            <input value={email} onChange={onChangeEmail} type="text" placeholder="이메일" />
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
        </>
    );
}

export default SignIn;
