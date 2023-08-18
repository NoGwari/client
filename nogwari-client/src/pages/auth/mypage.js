import React, { useEffect, useState } from 'react';
import { Http } from 'common';
import Layout from 'component/layout/Layout';

function Mypage() {
    const [me, setMe] = useState(null);
    const [newNickname, setNewNickname] = useState('');
    const [isUpdatingNickname, setIsUpdatingNickname] = useState(false);

    useEffect(() => {
        const fetchMyPage = async () => {
            try {
                const response = await fetch(Http + '/auth/me', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setMe(data);
                console.log(data);
            } catch (error) {
                console.log('에러', error.message);
            }
        };
        fetchMyPage();
    }, []);
    const handleNicknameChange = async () => {
        if (!newNickname) {
            return;
        }
        setIsUpdatingNickname(true);

        try {
            const response = await fetch(Http + '/auth/updatenick', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ nickname: newNickname }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('변경오류', error.message);
        } finally {
            setIsUpdatingNickname(false);
        }
    };

    return (
        <>
            <Layout></Layout>
            <div>
                {me ? (
                    <div>
                        <p>여기는 마이페이지 입니다.</p>
                        <p>사용자 닉네임: {me.nickname}</p>
                        <p>이메일: {me.email}</p>
                        <p>사용자 이미지: {me.img}</p>
                        <br />
                        <div>
                            <p>닉네임 변경:</p>
                            <input type="text" value={newNickname} onChange={(e) => setNewNickname(e.target.value)} />
                            <button onClick={handleNicknameChange} disabled={isUpdatingNickname}>
                                {isUpdatingNickname ? '변경 중...' : '변경'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <p>로그인 정보를 불러오는 중...</p>
                )}
            </div>
        </>
    );
}

export default Mypage;
