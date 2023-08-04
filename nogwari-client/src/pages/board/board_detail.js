import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Http } from 'common';
import Layout from 'component/layout/Layout';
import styled from 'styled-components';
import DeleteBoard from './DeleteBoard/DeleteBoard';

import { FiThumbsUp } from 'react-icons/fi';
import { AiOutlineEye } from 'react-icons/ai';

const BoardTitleContainer = styled.div`
    display: flex;
    margin-top: 10px;
`;
const BoardTitle = styled.h1`
    font-size: 18px;
`;

const CategoryTitle = styled.button`
    border: 1px solid black;
    border-radius: 2px;
    padding: 3px;
    background-color: #e2e2e2;
    font-size: 11px;
`;
const BoardContent = styled.p`
    font-size: 14px;
    color: #666666;
    margin-top: 3px;
    display: flex;
    flex-direction: row;
`;

function BoardDetailPage() {
    const [board, setBoard] = useState([]);
    const [likes, setLikes] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(Http + '/board');
            const result = await res.json();
            setBoard(result);
        };
        fetchData();
    }, []);

    const { itemId } = useParams();
    const id = Number(itemId);
    const item = board.find((item) => item.id === Number(id));

    const postLike = async (boardId) => {
        const apiUrl = `http://ec2-15-164-55-240.ap-northeast-2.compute.amazonaws.com/board/hits/${boardId}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST', // 이 예제에서는 POST 요청을 보내도록 가정합니다.
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error posting like:', error.message);
            throw error;
        }
    };

    if (!item) {
        return <div></div>;
    }

    const handleLikeClick = () => {
        setLikes((prevLikes) => prevLikes + 1);

        // API 호출
        postLike(item.id)
            .then((responseData) => {
                console.log('좋아요가 성공적으로 저장되었습니다:', responseData);
            })
            .catch((error) => {
                console.error('좋아요 저장 실패:', error.message);
            });
    };

    return (
        <>
            <Layout></Layout>
            <BoardTitleContainer>
                <CategoryTitle>{item.categoryName}</CategoryTitle>
                <BoardTitle>{item.title}</BoardTitle>
            </BoardTitleContainer>
            <BoardContent>
                {item.userImg}
                {item.userNickname} &middot; &nbsp; <AiOutlineEye />
                {item.views} &middot;&nbsp; <FiThumbsUp onClick={handleLikeClick} style={{ cursor: 'pointer' }} />
                {likes} {item.hits}
            </BoardContent>
            <hr />
            {item.content}
            <hr />
            <DeleteBoard />
        </>
    );
}

export default BoardDetailPage;
