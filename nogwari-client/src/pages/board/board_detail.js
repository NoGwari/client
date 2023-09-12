import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Http } from 'common';
import Layout from 'component/layout/Layout';
import styled from 'styled-components';
import DeleteBoard from './DeleteBoard/DeleteBoard';
import { FiThumbsUp } from 'react-icons/fi';
import { AiOutlineEye, AiFillDelete } from 'react-icons/ai';
import { ImReply } from 'react-icons/im';
import { RiAlarmWarningFill } from 'react-icons/ri';

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
    width: 100%;
    margin: 0 auto;
    font-family: Arial, sans-serif;
`;
const Comment = styled.div`
    border: 1px solid #ccc;
    padding: 3px;
    margin-bottom: 5px;
    background-color: #f9f9f9;
    width: 100%;
`;
const CommentContent = styled.div`
    margin-top: 1px;
    margin-bottom: 1px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
const CommentForm = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
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

const ReplyContent = styled.div`
    margin-top: 1px;
    margin-bottom: 1px;
    margin-left: 10px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 80%;
`;

function BoardDetailPage() {
    const [board, setBoard] = useState({});
    const { itemId } = useParams();
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');
    const [hits, setHits] = useState(0);
    const [commentHits, setCommentHits] = useState(0);
    const [replyHits, setReplyHits] = useState(0);
    const [isReplying, setIsReplying] = useState(false);
    const [replyCommentId, setReplyCommentId] = useState(null);
    const [replyComments, setReplyComments] = useState([]);
    const [reply, setReply] = useState('');

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
        fetchComments();
    }, [itemId]);

    const ishit = async () => {
        try {
            const response = await fetch(Http + `/board/ishit/${itemId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network reponse was not ok');
            }
            console.log(response);
        } catch (error) {
            console.error('확인 에러: ', error);
        }
    };

    const hitUrl = async () => {
        try {
            const response = await fetch(Http + `/board/hits/${itemId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setHits(hits + 1);
        } catch (error) {
            console.error('Error posting like:', error);
        }
    };
    const fetchComments = async () => {
        try {
            const response = await fetch(Http + `/comment/${itemId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setComments(data.comment);
                setReplyComments(data.reply);
            } else {
                console.error('댓글 가져오기 실패');
            }
        } catch (error) {
            console.error('오류 발생:', error);
        }
    };

    const hitComment = async (commentId) => {
        try {
            const response = await fetch(Http + `/comment/hits/${commentId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.text();
            if (responseData === 'OK') {
                console.log('좋아요가 성공적으로 처리되었습니다.');
                if (!replyComments[commentId]) {
                    setCommentHits(commentHits + 1);
                } else {
                    setReplyHits(replyHits + 1);
                }
            } else {
                console.log('좋아요가 눌리지 않아요');
            }
            fetchComments();
        } catch (error) {
            console.error('Error posting like:', error);
        }
    };

    const deleteComment = async (id) => {
        const shouldDelete = window.confirm('삭제하시겠습니까?');
        if (shouldDelete) {
            try {
                const response = await fetch(Http + `/comment/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    },
                });
                if (response.ok) {
                    console.log('댓글 삭제 완료');
                    fetchComments();
                }
            } catch (error) {
                console.error('에러', error);
            }
        }
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const toggleReply = (commentId) => {
        setIsReplying(!isReplying);
        setReplyCommentId(commentId);
    };

    const handleSubmit = async () => {
        if (content) {
            const newComment = {
                content,
            };

            try {
                const response = await fetch(Http + `/comment/${itemId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    },
                    body: JSON.stringify(newComment),
                });

                if (response.ok) {
                    setContent('');
                    setComments([...comments, newComment]);
                    fetchComments();
                    console.log('댓글 작성 성공');
                } else {
                    console.error('댓글 작성 실패');
                }
            } catch (error) {
                console.error('오류 발생:', error);
            }
        }
    };
    const ReplyComment = async () => {
        if (reply) {
            const newReply = {
                reply,
            };
            try {
                const response = await fetch(Http + `/comment/reply/${itemId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({
                        content: reply,
                        parentCommentId: replyCommentId,
                    }),
                });

                if (response.ok) {
                    setReply('');
                    setReplyComments(newReply);
                    setIsReplying(false);
                    fetchComments();
                    console.log('답글 작성 성공');
                    console.log(newReply);
                    console.log(replyCommentId);
                } else {
                    console.error('답글 작성 실패');
                }
            } catch (error) {
                console.error('오류 발생:', error);
            }
        }
    };

    if (!board.title || comments === null) {
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
                <img src={board.userImg} alt="사용자 이미지" /> &middot; &nbsp;
                {board.userNickname} &middot; &nbsp; <AiOutlineEye />
                {board.views} &middot;&nbsp; <FiThumbsUp onClick={hitUrl && ishit} style={{ cursor: 'pointer' }} />
                {hits}
            </BoardContent>
            <hr />
            <div dangerouslySetInnerHTML={{ __html: board.content }}></div>
            <hr />
            <DeleteBoard />
            <hr />
            <br />
            <CommentContainer>
                {comments.map((comment) => {
                    return (
                        <Comment key={comment.id}>
                            <CommentContent>
                                <div>
                                    {comment.userNickname} : {comment.content}
                                    &nbsp;&nbsp;&nbsp;
                                    <button onClick={() => toggleReply(comment.id)}>답글 달기</button>
                                    {isReplying && replyCommentId === comment.id && (
                                        <div>
                                            <textarea
                                                placeholder="답글 내용을 입력하세요"
                                                value={reply}
                                                onChange={(e) => setReply(e.target.value)}
                                            />
                                            <button onClick={() => ReplyComment(reply)}>전송</button>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <FiThumbsUp
                                        onClick={() => hitComment(comment.id)}
                                        style={{ cursor: 'pointer', marginLeft: '5px' }}
                                    />
                                    {comment.hits}
                                    &nbsp;&nbsp; &nbsp;&nbsp;
                                    <AiFillDelete
                                        onClick={() => deleteComment(comment.id)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    &nbsp;&nbsp;
                                    <RiAlarmWarningFill />
                                </div>
                            </CommentContent>
                            {Object.values(replyComments)
                                .filter((element) => parseInt(element.parentCommentsId) === parseInt(comment.id))
                                .map((reply) => (
                                    <ReplyContent key={reply.id}>
                                        <div>
                                            {reply.userNickname} : {reply.content} <ImReply />
                                        </div>
                                        <div>
                                            <FiThumbsUp
                                                onClick={() => hitComment(reply.id)}
                                                style={{ cursor: 'pointer', marginLeft: '5px' }}
                                            />
                                            {reply.hits}
                                            &nbsp;&nbsp; &nbsp;&nbsp;
                                            <AiFillDelete
                                                onClick={() => deleteComment(reply.id)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            &nbsp;&nbsp;
                                            <RiAlarmWarningFill />
                                        </div>
                                    </ReplyContent>
                                ))}
                        </Comment>
                    );
                })}
                <CommentForm>
                    <CommentTextarea placeholder="댓글을 입력하세요" value={content} onChange={handleContentChange} />
                    <CommentSubmit onClick={handleSubmit}>댓글 작성</CommentSubmit>
                </CommentForm>
            </CommentContainer>
        </>
    );
}

export default BoardDetailPage;
