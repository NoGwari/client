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
                <Route path="/nogwari" element={<Layout />}>
                    <Route path="my" element={<My />} />
                </Route>
                <Route
                    path="board/*"
                    element={
                        <Suspense fallback={<> 로딩중입니다. </>}>
                            <BoardPages />
                        </Suspense>
                    }
                />
                <Route path="/board/:itemId" element={<BoardDetailPage />} />
                <Route path="/updateBoard/:itemId" element={<UpdateBoard />} />
                <Route path="/createBoard" element={<CreateBoard />}></Route>
                <Route path="/login" element={<LoginPage />}></Route>
                <Route path="/signin" element={<SignIn />}></Route>

                <Route path="/" element={<Board />}></Route>
                <Route path="*" element={<Error />} />
            </Routes>
            <Link to="http://ec2-13-209-73-184.ap-northeast-2.compute.amazonaws.com/auth/google">구글 호출</Link>
            {/*<header>*/}
            {/*    {board && board.map(x =>*/}
            {/*        <BoardTest>*/}
            {/*            {x.content}*/}
            {/*        </BoardTest>*/}
            {/*    )*/}
            {/*    }*/}
            {/*    <p>*/}
            {/*        노과리 프로젝트 배포*/}
            {/*        저는 재현이에요*/}
            {/*    </p>*/}
            {/*    <GoogleLoginButton />*/}
            {/*</header>*/}
        </BrowserRouter>
    );
}

export default App;
