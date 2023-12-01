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
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    margin-top: 20px;
`;

const Posts = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    overflow: hidden;
`;

const Title = styled(Link)`
    max-width: 280px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &: hover {
        cursor: pointer;
        font-weight: bold;
    }
`;

function CreateTime(timestamp) {
    if (!timestamp) {
        return '알수없음';
    }

    const now = new Date();
    const past = new Date(timestamp);
    const timeDiff = now.getTime() - past.getTime();
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days >= 7) {
        const Month = past.getMonth() + 1;
        const Day = past.getDate();
        return `${Month}월 ${Day}일`;
    } else if (days >= 1) {
        return `${days}일 전`;
    } else if (hours >= 1) {
        return `${hours}시간 전`;
    } else if (minutes >= 1) {
        return `${minutes}분 전`;
    }

    return '방금 전';
}

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
                            <Posts>
                                <Title to={`/post/${item.id}`}>{item.title}</Title>
                                <p style={{ fontSize: '12px' }}>{CreateTime(item.createdAt)}</p>
                            </Posts>
                            <hr style={{ background: '#e2e2e2', height: '1px', border: '0' }} />
                        </div>
                    ))}
                </MypageForm>
            </div>
        </>
    );
}

export default Mypost;
