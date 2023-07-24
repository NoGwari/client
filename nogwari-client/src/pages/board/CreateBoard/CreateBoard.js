import React, { useCallback, useState } from 'react';
import { Http } from '../../../common';
import styled from 'styled-components';
import { useRef } from 'react';
import { useParams } from 'react-router';

const title = styled.div``;
const content = styled.textarea``;

function CreateBoard() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const categoryId = 1; //이거 드롭다운으로 바꾸기
    const createNewPosting = async (title, content, categoryId) => {
        const url = Http + '/board'; // 백엔드 서버의 엔드포인트 주소

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ title, content, categoryId }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating new posting:', error.message);
            throw error;
        }
    };

    const onChangeTitle = (e) => {
        const { value } = e.target;
        setTitle(value);
        // setInputCountTitle(e.target.value.length);
    };

    const onChangeContent = (e) => {
        const { value } = e.target;
        setContent(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createNewPosting(title, content, categoryId)
            .then((newPosts) => {
                console.log('New posting created:', newPosts);
            })
            .catch((error) => {
                console.error('Error creating new posting:', error.message);
            });
    };

    const FileUpLoad = () => {
        const fileInputRef = useRef < HTMLInputElement > null;
        const [imageFile, setImageFile] = (useState < UploadImage) | (null > null);
        const handleClickFileInput = () => {
            fileInputRef.current?.click();
        };
        const uploadProfile = () => {
            const fileList = e.target.files;
            const length = fileList?.length;
            if (fileList && fileList[0]) {
                const url = URL.createObjectURL(fileList[0]);

                setImageFile({
                    file: fileList[0],
                    thumbnail: url,
                    type: fileList[0].type.slice(0, 5),
                });
            }
        };
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={title} onChange={onChangeTitle} type="text" placeholder="제목" maxLength={20} />
            <br></br>
            <input value={content} onChange={onChangeContent} type="textarea" placeholder="내용" height="400px" />

            <br></br>
            <button type="submit">게시물 생성</button>
        </form>
    );
}

export default CreateBoard;
