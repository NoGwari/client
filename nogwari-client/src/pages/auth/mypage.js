import React, { useEffect, useState } from 'react';
import { Http } from 'common';
import Layout from 'component/layout/Layout';
import styled from 'styled-components';

const Mypageword = styled.div`
    color: black;
    font-weight: bold;
    font-size: 20px;
    text-align: center;
    margin-top: 80px;
`;

const MypageImg = styled.img`
    border-radius: 50%;
    width: 125px;
    height: 125px;
    border-radius: 50%;
`;

const MypageForm = styled.div`
    text-align: center;
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    margin-top: 20px;
`;

function Mypage() {
    const [me, setMe] = useState(null);
    const [newNickname, setNewNickname] = useState('');
    const [isUpdatingNickname, setIsUpdatingNickname] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    let profile = 'public/img/profile.png';
    let profileImg = me && me.img ? me.img : profile;

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        setImageFile(selectedFile);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setImagePreview(null);
        }
    };

    const handleImageUpload = async () => {
        if (!imageFile) {
            return;
        }
        setIsUploadingImage(true);

        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await fetch(Http + '/user/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();
            const newImageUrl = data;
            setImageUrl((prevImageUrl) => [...prevImageUrl, newImageUrl]);
            setImageUrl(newImageUrl);
            console.log(newImageUrl);
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
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
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
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
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

    return (
        <>
            <Layout></Layout>
            <div>
                {me && (
                    <>
                        <Mypageword>마이페이지</Mypageword>
                        <MypageForm>
                            <p>사용자 닉네임: {me.nickname}</p>
                            <p>이메일: {me.email}</p>
                            <MypageImg src={profileImg || profile} alt="프로필 이미지" />

                            <div>
                                <input type="file" accept="image/*" onChange={handleImageChange} />
                                <br />
                                {imagePreview && (
                                    <img src={imagePreview} alt="미리보기" style={{ maxWidth: '200px' }} />
                                )}
                                <button onClick={handleImageUpload} disabled={isUploadingImage}>
                                    {isUploadingImage ? '업로드 중...' : '업로드'}
                                </button>
                            </div>
                            <div>
                                <p>닉네임 변경:</p>
                                <input
                                    type="text"
                                    value={newNickname}
                                    onChange={(e) => setNewNickname(e.target.value)}
                                />
                                <button onClick={handleNicknameChange} disabled={isUpdatingNickname}>
                                    {isUpdatingNickname ? '변경 중...' : '변경'}
                                </button>
                            </div>
                        </MypageForm>
                        <br />
                    </>
                )}
            </div>
        </>
    );
}

export default Mypage;
