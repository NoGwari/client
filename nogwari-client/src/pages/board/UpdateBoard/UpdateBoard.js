import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Http } from 'common';
import { useParams } from 'react-router-dom';

const UpdateBoard = () => {
    const [content, setContent] = useState('');
    const { itemId } = useParams();

    const handleChange = (value) => {
        setContent(value);
    };

    const update = async (title, content, hiddenNum, categoryId) => {
        try {
            const response = await fetch(Http + `/board/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
                body: JSON.stringify({ title, content, hiddenNum, categoryId }),
            });
            console.log(response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log('에러');
        }
    };

    return <ReactQuill value={content} onChange={handleChange} />;
};

export default UpdateBoard;
