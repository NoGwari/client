import React from 'react';
import { useAuth } from './LoginInfo';
import Layout from 'component/layout/Layout';
import styled from 'styled-components';

const UserInfoContainer = styled.div`
    margin-top: 20px;
`;

function Mypage() {
    const { loggedInUser } = useAuth();

    return (
        <>
            <Layout></Layout>
            <UserInfoContainer>
                {loggedInUser ? (
                    <>
                        <p>안녕하세요, {loggedInUser.email}</p>
                    </>
                ) : (
                    <p>다시 로그인 해주세요</p>
                )}
            </UserInfoContainer>
        </>
    );
}

export default Mypage;
