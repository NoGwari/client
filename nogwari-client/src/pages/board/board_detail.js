import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Http } from 'common';
import Layout from 'component/layout/Layout';
import styled from 'styled-components';
import DeleteBoard from './DeleteBoard/DeleteBoard';
import { FiThumbsUp } from 'react-icons/fi';
import { AiOutlineEye } from 'react-icons/ai';
import UpdateBoard from './UpdateBoard/UpdateBoard';

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
    const { itemId } = useParams();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(Http + `/board/${itemId}`);
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await res.json();
                setBoard(result);
            } catch (error) {
                console.error('Error fetching board data:', error);
            }
        };
        fetchData();
    }, [itemId]);

    const hitUrl = async () => {
        try {
            const response = await fetch(Http + `/board/hits/${itemId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setBoard((prevBoard) =>
                prevBoard.map((board) => (board.id === data.id ? { ...board, hits: data.hits } : board))
            );
        } catch (error) {
            console.error('Error posting like:', error);
        }
    };

    if (!board) {
        // board로 체크
        return <div>Loading...</div>;
    }

    return (
        <>
            <Layout></Layout>
            <BoardTitleContainer>
                <CategoryTitle>{board.categoryName}</CategoryTitle>
                <BoardTitle>{board.title}</BoardTitle>
            </BoardTitleContainer>
            <BoardContent>
                {board.userImg}
                {board.userNickname} &middot; &nbsp; <AiOutlineEye />
                {board.views} &middot;&nbsp; <FiThumbsUp onClick={hitUrl} style={{ cursor: 'pointer' }} />
                {board.hits}
            </BoardContent>
            <hr />
            <div dangerouslySetInnerHTML={{ __html: board.content }}></div>
            <hr />
            <DeleteBoard />
        </>
    );
}

export default BoardDetailPage;
