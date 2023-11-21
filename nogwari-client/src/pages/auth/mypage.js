import React, { useEffect, useState, useCallback } from 'react';
import { Http } from 'common';
import Layout from 'component/layout/Layout';
import styled from 'styled-components';
import { TiDeleteOutline } from 'react-icons/ti';
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

const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 20%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s ease;
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

const MypageImgContainer = styled.div`
    position: relative;
    display: inline-block;

    &:hover ${Overlay} {
        opacity: 1;
    }
`;

const Input = styled.input`
    width: 80%;
    padding: 10px;
    margin-bottom: 10px;
    box-sizing: border-box;
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

const VerifyButton = styled.button`
    width: 20%;
    height: 40px;
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

function Mypage() {
    const [me, setMe] = useState(null);
    const [newNickname, setNewNickname] = useState('');
    const [isUpdatingNickname, setIsUpdatingNickname] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');

    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordConfirmMessage, setPasswordConfirmMessage] = useState('');

    const [isPassword, setIsPassword] = useState(false);
    const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);

    const handleImageChange = async (e) => {
        const selectedFile = e.target.files[0];
        setImageFile(selectedFile);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                setImagePreview(reader.result);

                try {
                    const formData = new FormData();
                    formData.append('image', selectedFile);

                    const response = await fetch(Http + '/user/upload', {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                            'Cache-Control': 'no-cache',
                        },
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok.');
                    }

                    const data = await response.json();
                    const newImageUrl = data;

                    setMe((prevMe) => ({
                        ...prevMe,
                        img: newImageUrl,
                    }));

                    console.log('이미지 업로드 및 업데이트 완료');
                } catch (error) {
                    console.error('이미지 업로드 오류', error.message);
                }
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setImagePreview(null);
        }
    };

    const deleteImage = async () => {
        try {
            const response = await fetch(Http + '/user/default', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'Cache-Control': 'no-cache',
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            console.log(data);
            setMe((prevMe) => ({
                ...prevMe,
                img: data.url,
            }));
            console.log('기본 이미지로 변경');
        } catch (error) {
            console.error('이미지 업로드 오류', error.message);
        }
        window.confirm('기본이미지로 변경');
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
        setNewNickname('');

        try {
            const response = await fetch(Http + '/user/updatenick', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'Cache-Control': 'no-cache',
                },
                body: JSON.stringify({ nickname: newNickname }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            console.log('res:', response);
            const data = await response.json();
            console.log(data);
            setMe((prevMe) => ({
                ...prevMe,
                nickname: newNickname,
            }));
        } catch (error) {
            console.error('변경오류', error.message);
        } finally {
            setIsUpdatingNickname(false);
        }
    };
    const changepw = async () => {
        try {
            const response = await fetch(Http + '/user/updatepassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
                body: JSON.stringify({ password: passwordCheck }),
            });
            if (response.status === 401) {
                alert('비밀번호 변경 실패');
            } else {
                alert('비밀번호 변경 성공');
            }
        } catch (error) {
            console.log('변경 실패', error.message);
        }
    };

    const onChangePassword = useCallback((e) => {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
        const passwordCurrent = e.target.value;
        setPassword(passwordCurrent);

        if (!passwordRegex.test(passwordCurrent)) {
            setPasswordMessage('숫자+영문자+특수문자 조합으로 8자리 이상!');
            setIsPassword(false);
        } else {
            setPasswordMessage('안전한 비밀번호에요!');
            setIsPassword(true);
        }
    }, []);

    const onChangePasswordCheck = useCallback(
        (e) => {
            const passwordConfirmCurrent = e.target.value;
            setPasswordCheck(passwordConfirmCurrent);

            if (password === passwordConfirmCurrent) {
                setPasswordConfirmMessage('비밀번호를 똑같이 입력했어요!');
                setIsPasswordConfirm(true);
            } else {
                setPasswordConfirmMessage('비밀번호가 틀려요. 다시 확인해주세요');
                setIsPasswordConfirm(false);
            }
        },
        [password]
    );

    const withdrawal = async () => {
        const shouldwithdrawal = window.confirm('정말 탈퇴하시겠습니까? 삭제한 이후 복구능 불가능 합니다.');
        if (shouldwithdrawal) {
            try {
                const response = await fetch(Http + '/user/withdrawal', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                        'Cache-Control': 'no-cache',
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                console.log('회원탈퇴');
            } catch (error) {
                console.error('탈퇴오류', error.message);
            }
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
                            <p style={{ fontSize: '16px', marginBottom: '8px' }}>사용자 닉네임: {me.nickname}</p>
                            <p style={{ fontSize: '16px', color: '#555', marginBottom: '16px' }}>이메일: {me.email}</p>
                            <hr />
                            <MypageImgContainer>
                                <MypageImg src={me.img} alt="프로필 이미지" />
                                <Overlay>
                                    프로필 사진 변경
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            opacity: 0,
                                        }}
                                        onChange={handleImageChange}
                                    />
                                </Overlay>
                            </MypageImgContainer>
                            <br />
                            <TiDeleteOutline onClick={deleteImage} style={{ fontSize: '20px', color: 'red' }} />
                            <br />
                            <br />
                            <FormBox style={{ display: 'flex', flexDirection: 'row' }}>
                                <Input
                                    style={{ fontSize: '14px' }}
                                    type="text"
                                    value={newNickname}
                                    placeholder="변경할 닉네임을 입력해주세요."
                                    onChange={(e) => setNewNickname(e.target.value)}
                                />
                                <VerifyButton onClick={handleNicknameChange} disabled={isUpdatingNickname}>
                                    {isUpdatingNickname ? '변경 중...' : '변경'}
                                </VerifyButton>
                            </FormBox>
                            <hr />
                            <FormBox>
                                <Input
                                    style={{ fontSize: '14px', width: '100%' }}
                                    value={password}
                                    onChange={onChangePassword}
                                    type="password"
                                    placeholder="비밀번호"
                                    maxLength={20}
                                />
                                <br />
                                <span
                                    style={{ fontSize: '13px' }}
                                    className={`message ${isPassword ? 'success' : 'error'}`}
                                >
                                    {passwordMessage}
                                </span>
                            </FormBox>
                            <FormBox>
                                <Input
                                    style={{
                                        fontSize: '14px',
                                        width: '80%',
                                        display: 'inline-block',
                                        verticalAlign: 'top',
                                    }}
                                    value={passwordCheck}
                                    onChange={onChangePasswordCheck}
                                    type="password"
                                    placeholder="비밀번호확인"
                                    maxLength={20}
                                />
                                <VerifyButton onClick={changepw} disabled={!isPasswordConfirm}>
                                    변경
                                </VerifyButton>
                                <span
                                    style={{ fontSize: '13px' }}
                                    className={`message ${isPasswordConfirm ? 'success' : 'error'}`}
                                >
                                    {passwordConfirmMessage}
                                </span>
                            </FormBox>

                            <div
                                onClick={withdrawal}
                                style={{
                                    marginTop: 30,
                                    width: '30%',
                                    backgroundColor: 'red',
                                    fontSize: '14px',
                                    textAlign: 'center',
                                    float: 'right',
                                    cursor: 'pointer',
                                }}
                            >
                                회원 탈퇴
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
