import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Http } from 'common';
import Layout from 'component/layout/Layout';
import styled from 'styled-components';
import DeleteBoard from './DeleteBoard/DeleteBoard';
import { FiThumbsUp } from 'react-icons/fi';
import { AiOutlineEye, AiFillDelete } from 'react-icons/ai';
import { ImReply } from 'react-icons/im';
import { RiAlarmWarningFill } from 'react-icons/ri';
import { Navigate } from 'react-router-dom';
import { Checkbox } from '@mui/material';

const Container = styled.div`
    margin: 0 100px;
`;
const BoardTitleContainer = styled.div`
    display: flex;
    margin-top: 10px;
`;
const BoardTitle = styled.h1`
    font-size: 25px;
    margin-left: 30px;
`;

const CategoryTitle = styled.button`
    border: none;
    border-radius: 5px;
    padding: 5px;
    background-color: #e2e2e2;
    font-size: 25px;
`;
const BoardContent = styled.p`
    font-size: 14px;
    color: #666666;
    margin-top: 3px;
    display: flex;
    flex-direction: row;
    align-items: center;
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

const CheckboxContainer = styled.div`
    display: flex;
    align-items: center;
`;

const StyledCheckbox = styled.div`
    width: 20px;
    height: 20px;
    border: 2px solid #3498db;
    border-radius: 5px;
    display: inline-block;
    cursor: pointer;
    background-color: ${(props) => (props.ishidden ? '#3498db' : 'transparent')};
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
    const [ishidden, setIshidden] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(Http + `/board/${itemId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
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

    const boardData = async () => {
        try {
            const res = await fetch(Http + `/board/${itemId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await res.json();
            setBoard(result);
        } catch (error) {
            console.error('Error fetching board data:', error);
        }
    };

    const ishit = async () => {
        try {
            const response = await fetch(Http + `/board/ishit/${itemId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                if (data === false) {
                    try {
                        const hitResponse = await fetch(Http + `/board/hits/${itemId}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                            },
                            credentials: 'include',
                        });
                        if (hitResponse.ok) {
                            setHits(hits + 1);
                        }
                    } catch (error) {
                        console.error('좋아요 누르기 실패:', error);
                    }
                } else if (data === true) {
                    try {
                        const unhitResponse = await fetch(Http + `/board/unhits/${itemId}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                            },
                            credentials: 'include',
                        });
                        if (unhitResponse.ok) {
                            setHits(hits - 1);
                        }
                    } catch (error) {
                        console.error('좋아요 취소 실패:', error);
                    }
                }
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('확인 에러: ', error);
        }
        boardData();
    };

    const fetchComments = async () => {
        try {
            const response = await fetch(Http + `/comment/${itemId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
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

    const ishitComment = async (commentId) => {
        try {
            const response = await fetch(Http + `/comment/ishit/${commentId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                if (data === false) {
                    try {
                        const hitResponse = await fetch(Http + `/comment/hits/${commentId}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                            },
                            credentials: 'include',
                        });
                        if (hitResponse.ok) {
                            setCommentHits(commentHits + 1);
                        }
                    } catch (error) {
                        console.error('좋아요 누르기 실패:', error);
                    }
                } else if (data === true) {
                    try {
                        const unhitResponse = await fetch(Http + `/comment/unhits/${commentId}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                            },
                            credentials: 'include',
                        });
                        if (unhitResponse.ok) {
                            setCommentHits(commentHits - 1);
                        }
                    } catch (error) {
                        console.error('좋아요 취소 실패:', error);
                    }
                }
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('확인 에러: ', error);
        }
        fetchComments();
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
                    credentials: 'include',
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
                    credentials: 'include',
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
                    credentials: 'include',
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

    const ishitReply = async (commentId) => {
        try {
            const response = await fetch(Http + `/comment/ishit/${commentId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                if (data === false) {
                    try {
                        const hitResponse = await fetch(Http + `/comment/hits/${commentId}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                            },
                            credentials: 'include',
                        });
                        if (hitResponse.ok) {
                            setReplyHits(replyHits + 1);
                            if (commentId == reply.id) {
                            }
                        }
                    } catch (error) {
                        console.error('좋아요 누르기 실패:', error);
                    }
                } else if (data === true) {
                    try {
                        const unhitResponse = await fetch(Http + `/comment/unhits/${commentId}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                            },
                            credentials: 'include',
                        });
                        if (unhitResponse.ok) {
                            setReplyHits(replyHits - 1);
                            if (commentId == reply.id) {
                            }
                        }
                    } catch (error) {
                        console.error('좋아요 취소 실패:', error);
                    }
                }
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('확인 에러: ', error);
        }
        fetchComments();
    };

    const handleUpdateClick = () => {
        navigate(`/updateBoard/${itemId}`, {
            state: {
                title: board.title,
                category: board.categoryName,
                content: board.content,
            },
        });
    };

    const handleHidden = async () => {
        try {
            const response = await fetch(Http + `/board/hidden/${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
                credentials: 'include',
            });

            if (response.status === 401) {
                alert('권한이 없습니다.');
            }

            if (response.status === 200) {
                const data = await response.json();
                const userConfirmed = window.confirm('게시물 숨김처리 ON/OFF');
                if (userConfirmed) {
                    console.log(data);
                    console.log(data.hidden);
                    setIshidden((prevIsHidden) => !prevIsHidden);
                    localStorage.setItem('checkboxstate', ishidden ? '#3498db' : 'transparent');
                }
            }
        } catch (error) {
            console.error('에러 확인: ', error);
        }
    };

    if (!board.title || comments === null) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Layout></Layout>
            <Container>
                <BoardTitleContainer>
                    <CategoryTitle>{board.categoryName}</CategoryTitle>

                    <BoardTitle>{board.title}</BoardTitle>
                </BoardTitleContainer>
                <BoardContent>
                    <img src={board.userImg} alt="사용자 이미지" style={{ maxWidth: '50px' }} /> &nbsp;
                    {board.userNickname} &middot; &nbsp; <AiOutlineEye />
                    {board.views} &middot;&nbsp;{' '}
                    <FiThumbsUp
                        onClick={ishit}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    {board.hits}
                    <CheckboxContainer style={{ marginLeft: 'auto' }}>
                        게시글 숨김 &nbsp;
                        <StyledCheckbox ishidden={ishidden} onClick={handleHidden} />
                    </CheckboxContainer>
                </BoardContent>
                <hr />
                <div dangerouslySetInnerHTML={{ __html: board.content }}></div>
                <hr />

                <button onClick={() => handleUpdateClick()}>게시글 수정</button>
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
                                            onClick={() => ishitComment(comment.id)}
                                            style={{ cursor: 'pointer' /*color:  ? 'red' : 'black'*/ }}
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
                                                    onClick={() => ishitReply(reply.id)}
                                                    style={{
                                                        cursor: 'pointer',
                                                        //color: isLikedReply ? 'red' : 'black',
                                                    }}
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
                        <CommentTextarea
                            placeholder="댓글을 입력하세요"
                            value={content}
                            onChange={handleContentChange}
                        />
                        <CommentSubmit onClick={handleSubmit}>댓글 작성</CommentSubmit>
                    </CommentForm>
                </CommentContainer>
            </Container>
        </div>
    );
}

export default BoardDetailPage;
