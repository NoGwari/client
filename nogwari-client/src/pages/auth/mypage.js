import React, { useEffect, useState } from 'react';
import { Http } from 'common';
import Layout from 'component/layout/Layout';

function Mypage() {
    const [me, setMe] = useState(null);

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
                    </div>
                ) : (
                    <p>로그인 정보를 불러오는 중...</p>
                )}
            </div>
        </>
    );
}

export default Mypage;
