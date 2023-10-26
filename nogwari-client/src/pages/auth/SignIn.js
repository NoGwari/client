import React, { useState } from 'react';
import { Http } from '../../common';
import styled from 'styled-components';
import Layout from 'component/layout/Layout';
import { useCallback } from 'react';

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
const VerifyNum = styled.input`
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
const VerifyButton = styled.button`
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
`;
const TextField = styled.input``;

function SignIn() {
    const [email, setEmail] = useState('');
    const [verifyKey, setVerifyKey] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [nickname, setNickname] = useState('');
    const [showVerifyNum, setShowVerifyNum] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordConfirmMessage, setPasswordConfirmMessage] = useState('');

    const [isName, setIsName] = useState(false);
    const [isPassword, setIsPassword] = useState(false);
    const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);

    const onChangeEmail = (e) => {
        const { value } = e.target;
        setEmail(value);
    };

    const onChangeVerifykey = (e) => {
        const { value } = e.target;
        setVerifyKey(value);
    };
    const onChangePassword = useCallback((e) => {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
        const passwordCurrent = e.target.value;
        setPassword(passwordCurrent);

        if (!passwordRegex.test(passwordCurrent)) {
            setPasswordMessage('숫자+영문자+특수문자 조합으로 8자리 이상 입력해주세요!');
            setIsPassword(false);
        } else {
            setPasswordMessage('안전한 비밀번호에요 : )');
            setIsPassword(true);
        }
    }, []);

    const onChangePasswordCheck = useCallback(
        (e) => {
            const passwordConfirmCurrent = e.target.value;
            setPasswordCheck(passwordConfirmCurrent);

            if (password === passwordConfirmCurrent) {
                setPasswordConfirmMessage('비밀번호를 똑같이 입력했어요 :)');
                setIsPasswordConfirm(true);
            } else {
                setPasswordConfirmMessage('비밀번호가 틀려요. 다시 확인해주세요 :(');
                setIsPasswordConfirm(false);
            }
        },
        [password]
    );

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

    const emailVerify = async (e) => {
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
            setShowVerifyNum(true);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
        } catch (error) {
            console.error('Error during login:', error.message);
        }
    };

    const Verifykey = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(Http + '/auth/checkkey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, verifyKey: verifyKey }),
            });
            console.log('인증키 확인', verifyKey);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
        } catch (error) {
            console.error('Error', error.message);
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
                <SignInForm onSubmit={emailVerify}>
                    <Input value={email} onChange={onChangeEmail} type="text" placeholder="E-mail" maxLength={20} />
                    <VerifyNum
                        show={showVerifyNum}
                        value={verifyKey}
                        onChange={onChangeVerifykey}
                        type="text"
                        placeholder="인증번호"
                    ></VerifyNum>
                    {showVerifyNum ? (
                        <VerifyButton onClick={Verifykey}>인증코드 입력</VerifyButton>
                    ) : (
                        <Button type="submit">이메일 인증</Button>
                    )}
                </SignInForm>
            </SignInContainer>
            <SignInContainer>
                <SignInword>정보등록</SignInword>
                <SignInForm>
                    <div className="formbox">
                        <Input
                            style={{ fontSize: '14px' }}
                            value={password}
                            onChange={onChangePassword}
                            type="password"
                            placeholder="영어+숫자+특수기호 포함 8자리이상"
                            maxLength={20}
                        />
                        <span className={`message ${checkPasswordMatch ? 'success' : 'error'}`}>{passwordMessage}</span>
                    </div>
                    <div className="formbox">
                        <Input
                            style={{ fontSize: '14px' }}
                            value={passwordCheck}
                            onChange={onChangePasswordCheck}
                            type="password"
                            placeholder="영어+숫자+특수기호 포함 8자리이상"
                            maxLength={20}
                        />
                        <span className={`message ${isPasswordConfirm ? 'success' : 'error'}`}>
                            {passwordConfirmMessage}
                        </span>
                    </div>
                </SignInForm>
            </SignInContainer>
        </>
    );
}

export default SignIn;
