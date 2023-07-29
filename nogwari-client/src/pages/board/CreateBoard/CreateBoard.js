import React, { useState, useRef } from 'react';
import { Http } from '../../../common';
import styled from 'styled-components';
import { useParams } from 'react-router';
import {useNavigate} from 'react-router-dom';

const Title = styled.div``;
const Content = styled.textarea``;

function CreateBoard() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const categoryId = 1; // 이거 드롭다운으로 바꾸기
    const navigate = useNavigate();

    const fileInputRef = useRef(null);
    const [imageFiles, setImageFiles] = useState([]);

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
                navigate('/board');
            })
            .catch((error) => {
                console.error('Error creating new posting:', error.message);
            });
    };

    const handleFileChange = (e) => {
        const fileList = e.target.files;
        if (fileList && fileList.length > 0) {
            const newImages = Array.from(fileList).map((file) => ({
                file: file,
                thumbnail: URL.createObjectURL(file),
                type: file.type.slice(0, 5),
            }));

            setImageFiles((prevImages) => [...prevImages, ...newImages]);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Title>
                <input value={title} onChange={onChangeTitle} type="text" placeholder="제목" maxLength={20} />
            </Title>
            <br />
            {imageFiles.length > 0 && (
                <div>
                    {imageFiles.map((image, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ marginRight: '10px' }}>
                                <img
                                    src={image.thumbnail}
                                    alt={`미리보기${index}`}
                                    style={{ width: '100px', height: 'auto' }}
                                />
                            </div>
                            <div>
                                <p>이미지 이름: {image.file.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <br />
            <Content
                value={content}
                onChange={onChangeContent}
                placeholder="내용"
                style={{ width: '400px', height: '400px' }}
                maxLength={50}
            />
            <br />
            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} multiple />
            <button type="button" onClick={() => fileInputRef.current?.click()}>
                이미지 선택
            </button>
            <button type="submit">게시물 생성</button>
        </form>
    );
}

export default CreateBoard;
