import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Http } from 'common';
import Layout from 'component/layout/Layout';
import styled from 'styled-components';

function BoardComment() {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');
    const [reply, setReply] = useState('');
    const [hits, setHits] = useState(0);
    const [commentHits, setCommentHits] = useState(0);
    const [commentHitStatus, setCommentHitStatus] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const { itemId } = useParams();

    const fetchComments = async () => {
        const response = await fetch(Http + `/comment/${itemId}`, {
            method: 'GET',
            header: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        const result = await response.json();
        const commentIds = result.comment.map((comment) => comment.id);
        setComments(result.comment);

        const commentHitted = await Promise.all(
            result.comment.map(async (comment) => {
                const response = await fetch(Http + `/comment/ishit/${comment.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    },
                    credentials: 'include',
                });

                if (response.status === 200) {
                    const hitted = await response.json();
                    return hitted;
                }

                return false;
            })
        );
        const likedComments = result.comment.map((comment, index) => (commentHitted[index] ? comment.id : 0));
        setCommentHitStatus(likedComments);
    };

    const ishitComment = async () => {
        try {
            await fetchComments();

            const commentId = commentId;
            if (commentHitStatus[commentId] === false) {
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
                    setCommentHitStatus({ ...commentHitStatus, [commentId]: true });
                }
            } else {
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
                    setCommentHitStatus({ ...commentHitStatus, [commentId]: false });
                }
            }
        } catch (error) {
            console.error('좋아요 처리 실패:', error);
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
}

// const ishitComment = async () => {
//     const response = await fetch(Http + `/comment/hits/}`, {
//         method: 'POST',
//         header: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${sessionStorage.getItem('token')}`,
//         },
//         credentials: 'include',
//     });
//     if (response.ok) {
//     }
// };

export default BoardComment;
