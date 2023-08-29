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
const CommentContainer = styled.div`
    width : 100%;
    margin : 0 auto;
    font family : Arrial, sans-serif;
`;
const Comment = styled.div`
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
    background-color: #f9f9f9;
    width: 100%;
`;
const CommentContent = styled.div`
    margin-top: 5px;
`;
const CommentForm = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: colunmn;
`;

const CommentTextarea = styled.textarea`
    width: 100%;
    padding: 5px;
    margin-right: 10px;
`;
const CommentSubmit = styled.button`
    background-color: #007bff;
    color: #fff;
    padding: 12px 24px;
    cursor: pointer;
    font-size: 13px;
    white-space: nowrap;
`;

function BoardDetailPage() {
    const [board, setBoard] = useState([]);
    const { itemId } = useParams();
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');

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

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };
    const handleSubmit = () => {
        if (content) {
            const newComment = {
                content,
            };
            setComments([...comments, newComment]);
            setContent('');
        }
    };

    if (!board) {
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
            <CommentContainer>
                {comments.map((comment, index) => (
                    <Comment key={index}>
                        <CommentContent>{comment.content}</CommentContent>
                    </Comment>
                ))}
                <CommentForm>
                    <CommentTextarea placeholder="댓글을 입력하세요" value={content} onChange={handleContentChange} />
                    <CommentSubmit onClick={handleSubmit}>댓글작성</CommentSubmit>
                </CommentForm>
            </CommentContainer>
        </>
    );
}

export default BoardDetailPage;
