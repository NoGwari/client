import {useEffect, useState} from "react";
import styled from "styled-components";
import { GlobalStyle } from "./styles/globalStyles.ts";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import {GoogleLogin} from "@react-oauth/google";
import {GoogleOAuthProvider} from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import Layout from "./component/layout/Layout";

const GoogleLoginButton = () => {
    const clientId = '998416530637-vkpbjs93khbqj8t968jd0ls07aa2c9rj.apps.googleusercontent.com'
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

const BoardTest = styled.div`
    display: flex;
`;
function App() {
    const [board, setBoard] = useState([]);
    useEffect(() => {
        const fetchData = async() => {
            const res = await fetch('http://18.224.69.86' + '/board');
            const result = res.json();
            return result;
        }
        fetchData().then(res => setBoard(res));

    }, []);

    return (
       <BrowserRouter>
            <GlobalStyle />
           <Routes>
               <Route path="/" />
               <Route index element={<Layout />} />
           </Routes>
           <header>
               {board && board.map(x =>
                   <BoardTest>
                       {x.content}
                   </BoardTest>
               )
               }
               <p>
                   노과리 프로젝트 배포
               </p>
               <GoogleLoginButton />
           </header>

       </BrowserRouter>
    );
}

export default App;
