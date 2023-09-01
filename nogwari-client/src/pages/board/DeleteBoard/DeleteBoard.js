import React from 'react';
import { Http } from '../../../common';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function DeleteBoard() {
    const params = useParams().itemId;
    const navigate = useNavigate();
    const deletePost = async () => {
        const url = Http + `/board/${params}`;
        const shouldDelete = window.confirm('게시물을 삭제하시겠습니까?');
        if (shouldDelete) {
            try {
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                console.log('게시물이 성공적으로 삭제되었습니다.');
                navigate('/board');
            } catch (error) {
                console.error('Error Deleting posting:', error.message);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await deletePost();
        } catch (error) {
            console.error('Error in handleSubmit:', error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <button type="submit">게시물 삭제</button>
        </form>
    );
}

export default DeleteBoard;
