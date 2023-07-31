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

    if (!item) {
        return <div></div>;
    }

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
                {item.views} &middot;&nbsp; <FiThumbsUp />
                {item.hits}
            </BoardContent>
            <hr />
            {item.content}
            <hr />
            <DeleteBoard />
        </>
    );
}

export default BoardDetailPage;
