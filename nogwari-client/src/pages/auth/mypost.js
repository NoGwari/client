import React, { useEffect, useState, useRef } from 'react';
import { Http } from 'common';
import { useNavigate, Link } from 'react-router-dom';
import Layout from 'component/layout/Layout';
import styled from 'styled-components';

const Mypageword = styled.div`
    color: black;
    font-weight: bold;
    font-size: 20px;
    text-align: center;
    margin-top: 50px;
`;

const MypageList = styled.div`
    display: flex;
    flex-direction: row;
    width: 60%;
    margin: auto;
    margin-top: 30px;
`;

const Mypagebutton = styled.button`
    width: 180px;
    height: 40px;
    background-color: white;
    &: hover {
        background-color: #e2e2e2;
    }
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 10px;
    margin: 1px;
    text-align: center;
    border: 2px solid #e2e2e2;
`;

const MypageForm = styled.div`
    text-align: center;
    width: 60%;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    margin-top: 20px;
`;

function Mypost() {
    const navigate = useNavigate();

    const [post, setPost] = useState([]);

    useEffect(() => {
        const mypost = async () => {
            try {
                const response = await fetch(Http + `/user/mypost`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                        'Cache-Control': 'no-cache',
                    },
                });
                if (response.ok) {
                    const result = await response.json();
                    console.log(result);
                    setPost(result.rows);
                } else {
                    console.log('불러오기 실패');
                }
            } catch (error) {
                console.error('내가 쓴 글 불러오기 실패', error.message);
            }
        };
        mypost();
    }, []);

    return (
        <>
            <div>
                <Layout />
                <MypageList>
                    <Mypagebutton onClick={() => navigate('/mypage')}>정보 변경</Mypagebutton>
                    <Mypagebutton onClick={() => navigate('/mypage/mypost')}>내가 쓴 글</Mypagebutton>
                    <Mypagebutton onClick={() => navigate('/mypage/mycomment')}>내가 단 댓글</Mypagebutton>
                </MypageList>
                <Mypageword>내가 쓴 글</Mypageword>
                <MypageForm>
                    {post.map((item, index) => (
                        <div key={index}>
                            <p>Title: {item.title}</p>
                            <p>Updated At: {item.updatedAt}</p>
                        </div>
                    ))}
                </MypageForm>
            </div>
        </>
    );
}

export default Mypost;
