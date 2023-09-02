import React, { useEffect, useState } from 'react';
import { Http } from 'common';
import Layout from 'component/layout/Layout';
import { useNavigate } from 'react-router-dom';

function Mypage() {
    const [me, setMe] = useState(null);
    const [newNickname, setNewNickname] = useState('');
    const [isUpdatingNickname, setIsUpdatingNickname] = useState(false);
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        setImageFile(selectedFile);
    };

    const handleImageUpload = async () => {
        if (!imageFile) {
            return;
        }
        setIsUploadingImage(true);

        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await fetch(Http + '/auth/me', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            console.log('이미지 업로드 완료');
        } catch (error) {
            console.error('이미지 업로드 오류', error.message);
        } finally {
            setIsUploadingImage(false);
        }
    };

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
            const response = await fetch(Http + '/user/updatenick', {
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
            console.log('res:', response);
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('변경오류', error.message);
        } finally {
            setIsUpdatingNickname(false);
        }
    };
    const logOut = () => {
        localStorage.removeItem('token');
        navigate('/');
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
                        <div>
                            <p>이미지 변경:</p>
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                            <button onClick={handleImageUpload} disabled={isUploadingImage}>
                                {isUploadingImage ? '업로드 중...' : '업로드'}
                            </button>
                        </div>
                        <br />
                        <div>
                            <p>닉네임 변경:</p>
                            <input type="text" value={newNickname} onChange={(e) => setNewNickname(e.target.value)} />
                            <button onClick={handleNicknameChange} disabled={isUpdatingNickname}>
                                {isUpdatingNickname ? '변경 중...' : '변경'}
                            </button>
                        </div>
                        <button onClick={logOut}>로그아웃</button>
                    </div>
                ) : (
                    <p>로그인 정보를 불러오는 중...</p>
                )}
            </div>
        </>
    );
}

export default Mypage;
