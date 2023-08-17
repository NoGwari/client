import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Http } from '../../../common';
import styled from 'styled-components';
import Layout from 'component/layout/Layout';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Title = styled.div``;
const Content = styled.textarea``;

function CreateBoard() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [editorHtml, setEditorHtml] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const editorRef = useRef(null);

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

    // const fileInputRef = useRef(null);
    // const [imageFiles, setImageFiles] = useState([]);

    const onChangeTitle = (e) => {
        const { value } = e.target;
        setTitle(value);
    };

    // const onChangeContent = (e) => {
    //     const { value } = e.target;
    //     setContent(value);
    // };

    // const handleFileChange = (e) => {
    //     const fileList = e.target.files;
    //     if (fileList && fileList.length > 0) {
    //         const newImages = Array.from(fileList).map((file) => ({
    //             file: file,
    //             thumbnail: URL.createObjectURL(file),
    //             type: file.type.slice(0, 5),
    //         }));

    //         setImageFiles((prevImages) => [...prevImages, ...newImages]);
    //     }
    // };

    // const handleImageDelete = (index) => {
    //     setImageFiles((prevImages) => {
    //         const newImages = [...prevImages];
    //         newImages.splice(index, 1); // 해당 인덱스의 이미지 제거
    //         return newImages;
    //     });
    // };

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

    const handleEditorChange = (html) => {
        setEditorHtml(html);
    };
    const handleImageUpload = (file) => {
        console.log('이미지이미지이미지이ㅣ지');
        const formData = new FormData();
        formData.append('image', file);

        const url = Http + '/board/upload';

        fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                const imageUrl = data.imageUrl;

                const range = editorRef.getEditor().getSelection();
                editorRef.getEditor().insertEmbed(range.index, 'image', imageUrl);

                setImageFiles((prevImageFiles) => [...prevImageFiles, file]);
            })
            .catch((error) => {
                console.error('이미지 업로드 에러:', error);
            });
    };

    const handleDrop = (e) => {
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
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        imageFiles.forEach((image, index) => {
            formData.append(`imageFile${index}`, image.file);
        });

        formData.append('title', title);
        formData.append('content', editorHtml);
        formData.append('categoryId', categoryId);

        const url = Http + '/board/upload';

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
        <div>
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
            <ReactQuill
                value={editorHtml}
                onChange={handleEditorChange}
                modules={modules}
                theme="snow"
                ref={editorRef}
                onPaste={(e) => handleImageUpload(e.clipboardData.files[0])}
            />
            <button onClick={handleSubmit}>게시물 작성</button>
        </div>
    );
}

export default CreateBoard;
