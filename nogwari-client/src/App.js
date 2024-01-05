import React, { useEffect, lazy, Suspense, useState } from 'react';
import { GlobalStyle } from './styles/globalStyles.ts';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import Layout from './component/layout/Layout';
import Error from './component/utill/Error';
import My from './component/utill/My';
import { Http } from './common';
import CreateBoard from 'pages/board/CreateBoard/CreateBoard.js';
import LoginPage from './pages/auth/LoginPage.js';
import Board from './pages/board/index.js';
import SignIn from 'pages/auth/SignIn.js';
import BoardDetailPage from '../src/pages/board/board_detail.js';
import UpdateBoard from './pages/board/UpdateBoard/UpdateBoard.js';
import Mypage from 'pages/auth/mypage.js';
import ForgotPassword from 'pages/auth/ForgotPassword.js';
import Mycomment from 'pages/auth/mycomment.js';
import Mypost from 'pages/auth/mypost.js';
import { AuthProvider, useAuth } from 'pages/auth/AuthContext.js';
import { FadeLoader } from 'react-spinners';

const BoardPages = lazy(() => import('./pages/board'));

const GoogleLoginButton = () => {
    const clientId = '998416530637-vkpbjs93khbqj8t968jd0ls07aa2c9rj.apps.googleusercontent.com';
    return (
        <>
            <GoogleOAuthProvider clientId={clientId}>
                <GoogleLogin
                    onSuccess={(res) => {
                        console.log(jwtDecode(res.credential));
                    }}
                    onFailure={(err) => {
                        console.log(err);
                    }}
                />
            </GoogleOAuthProvider>
        </>
    );
};

function App() {
    return (
        <BrowserRouter>
            <GlobalStyle />
            <Routes>
                <Route path="/nogwari" element={<Layout />} />
                <Route
                    path="board/*"
                    element={
                        <Suspense
                            fallback={
                                <FadeLoader
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                    }}
                                />
                            }
                        >
                            <BoardPages />
                        </Suspense>
                    }
                />
                <Route path="/mypage" element={<Mypage />} />
                <Route path="/mypage/mypost" element={<Mypost />} />
                <Route path="/mypage/mycomment" element={<Mycomment />} />
                <Route path="/board/:itemId" element={<BoardDetailPage />} />
                <Route path="/updateBoard/:itemId" element={<UpdateBoard />} />
                <Route path="/createBoard" element={<CreateBoard />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/" element={<Board />} />
                <Route path="*" element={<Error />} />
            </Routes>
        </BrowserRouter>
    );
}
//git pull
export default App;
