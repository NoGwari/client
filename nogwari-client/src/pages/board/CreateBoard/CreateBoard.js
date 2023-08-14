import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Http } from '../../../common';
import styled from 'styled-components';
import Layout from 'component/layout/Layout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Title = styled.div``;
const Content = styled.textarea``;

function CreateBoard() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(Http + '/category');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.log('에러', error.message);
            }
        };
        fetchCategories();
    }, []);

    const onChangeCategoryId = (e) => {
        const selectedCategoryId = e.target.value;
        setCategoryId(selectedCategoryId);
    };

    const fileInputRef = useRef(null);
    const [imageFiles, setImageFiles] = useState([]);

    const onChangeTitle = (e) => {
        const { value } = e.target;
        setTitle(value);
    };

    const onChangeContent = (e) => {
        const { value } = e.target;
        setContent(value);
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

    const handleImageDelete = (index) => {
        setImageFiles((prevImages) => {
            const newImages = [...prevImages];
            newImages.splice(index, 1); // 해당 인덱스의 이미지 제거
            return newImages;
        });
    };

    const onChangeContents = (content) => {
        console.log(content);
    };

    const modules = {
        toolbar: {
            container: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ font: [] }],
                [{ align: [] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }, 'link'],
                [
                    {
                        color: [
                            '#000000',
                            '#e60000',
                            '#ff9900',
                            '#ffff00',
                            '#008a00',
                            '#0066cc',
                            '#9933ff',
                            '#ffffff',
                            '#facccc',
                            '#ffebcc',
                            '#ffffcc',
                            '#cce8cc',
                            '#cce0f5',
                            '#ebd6ff',
                            '#bbbbbb',
                            '#f06666',
                            '#ffc266',
                            '#ffff66',
                            '#66b966',
                            '#66a3e0',
                            '#c285ff',
                            '#888888',
                            '#a10000',
                            '#b26b00',
                            '#b2b200',
                            '#006100',
                            '#0047b2',
                            '#6b24b2',
                            '#444444',
                            '#5c0000',
                            '#663d00',
                            '#666600',
                            '#003700',
                            '#002966',
                            '#3d1466',
                            'custom-color',
                        ],
                    },
                    { background: [] },
                ],
                ['image', 'video'],
                ['clean'],
            ],
        },
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const fileList = e.dataTransfer.files;

        if (fileList && fileList.length > 0) {
            const newImages = Array.from(fileList).map((file) => ({
                file: file,
                thumbnail: URL.createObjectURL(file),
                type: file.type.slice(0, 5),
            }));

            setImageFiles((prevImages) => [...prevImages, ...newImages]);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        imageFiles.forEach((image, index) => {
            formData.append(`imageFile${index}`, image.file);
        });

        let jsonData = JSON.stringify({
            title: title,
            content: content,
            categoryId: Number(categoryId),
        });
        formData.append('jsonData', jsonData);

        const url = Http + '/board';

        fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
        })
            .then((response) => {
                console.log(response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                if (data) {
                    alert('성공');
                } else {
                    alert('실패');
                }
            })
            .catch((error) => {
                alert('에러: ' + error.message);
            });
    };

    return (
        <form onSubmit={handleSubmit} onDragOver={(e) => e.preventDefault()}>
            <Layout></Layout>
            <Title>
                <input value={title} onChange={onChangeTitle} type="text" placeholder="제목" maxLength={20} />
            </Title>
            <br />
            <select value={categoryId} onChange={onChangeCategoryId}>
                {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                        {item.name}
                    </option>
                ))}
            </select>
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
                                <button onClick={() => handleImageDelete(index)}>X</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <br />
            {/* <Content
                value={content}
                onChange={onChangeContent}
                placeholder="내용"
                style={{ width: '400px', height: '400px' }}
                maxLength={50}
            />
            <br />
            <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault(e)}
                style={{ border: '2px dashed gray', padding: '20px', margin: '20px 0', width: '400px' }}
            >
                <p>이미지를 드래그 앤 드롭하세요.</p>
                <p>또는 아래 버튼을 클릭하여 이미지를 선택하세요.</p>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} multiple />
            <button type="button" onClick={() => fileInputRef.current?.click()}>
                이미지 선택
            </button>
            <button type="submit">게시물 생성</button> */}
            <div>
                <ReactQuill onChange={onChangeContents} modules={modules} />
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
            <button type="submit">게시물 생성</button>
        </form>
    );
}

export default CreateBoard;
