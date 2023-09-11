import React, { useState } from 'react';
import { Http } from '../../common';
import { useNavigate } from 'react-router-dom';

function CreateBoard() {
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
        e.preventDefault(); // 폼의 기본 동작인 페이지 새로고침 방지
        try {
            const response = await fetch(Http + '/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: id, password }), // 로그인 요청 데이터 전송
            });

            if (!response.ok) {
                const errorData = await response.json(); // 서버에서 에러 응답을 받으면 에러 데이터를 가져옴
                throw new Error(errorData.message); // 에러 데이터의 메시지를 에러로 던짐
            }

            const data = await response.json(); // 로그인 성공 시 데이터를 가져옴
            // 로그인 성공 후 처리: data를 활용하여 필요한 작업 수행
            sessionStorage.setItem('token', data.token);
            console.log(data);
            navigate('/board');
        } catch (error) {
            console.error('Error during login:', error.message);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input value={id} onChange={onChangeId} type="text" placeholder="아이디" maxLength={20} />
            <input value={password} onChange={onChangePassword} type="password" placeholder="패스워드" />
            <button type="submit">로그인</button>
        </form>
    );
}

export default CreateBoard;
