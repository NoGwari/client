import React, { useState, useRef, useEffect, useMemo } from 'react';
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
    const [editorHtml, setEditorHtml] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const editorRef = useRef(null);
    const QuillRef = useRef();

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
        const selectedCategoryId = parseInt(e.target.value);
        setCategoryId(selectedCategoryId);
    };

    const onChangeTitle = (e) => {
        const { value } = e.target;
        setTitle(value);
    };

    const handleEditorChange = (html) => {
        setEditorHtml(html);
    };

    const handleImageUpload = () => {
        const input = document.createElement('input');
        const formData = new FormData();

        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (file != null) {
                formData.append('image', file);

                if (QuillRef.current) {
                    const url = Http + '/board/upload';

                    try {
                        const response = await fetch(url, {
                            method: 'POST',
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                            },
                            body: formData,
                        });

                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        console.log('성공한듯?');
                        const data = await response.json();
                        const imageUrl = data.imageUrl;

                        const range = QuillRef.current.getEditor().getSelection();
                        const quill = QuillRef.current.getEditor();

                        quill.insertEmbed(range.index, 'image', imageUrl);
                        console.log(imageUrl);
                        console.log(data);

                        setImageFiles((prevImageFiles) => [...prevImageFiles, file]);
                    } catch (error) {
                        console.error('이미지 업로드 에러:', error);
                    }
                } else {
                    console.warn('QuillRef.current is not available yet');
                }
            }
        };
    };

    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    [{ font: [] }],
                    [{ align: [] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{ list: 'ordered' }, { list: 'bullet' }, 'link'],
                    [
                        {
                            color: ['#000000', '#e60000', '#ff9900', 'custom-color'],
                        },
                        { background: [] },
                    ],
                    ['image', 'video'],
                ],
                handlers: {
                    image: handleImageUpload,
                },
            },
        }),
        []
    );

    // const handleDrop = (e) => {
    //     e.preventDefault();
    //     const fileList = e.dataTransfer.files;

    //     if (fileList && fileList.length > 0) {
    //         const newImages = Array.from(fileList).map((file) => ({
    //             file: file,
    //             thumbnail: URL.createObjectURL(file),
    //             type: file.type.slice(0, 5),
    //         }));

    //         setImageFiles((prevImages) => [...prevImages, ...newImages]);
    //     }
    // };

    const createNewPosting = async (title, content, categoryId) => {
        const url = Http + '/board';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ title, content, categoryId }),
            });
            console.log('잘 간다');

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Error creating new Posting', error.message);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('눌림');
        try {
            const newPosts = await createNewPosting(title, editorHtml, categoryId); // 이미지가 포함된 내용 전달
            console.log('New posting created:', newPosts);
        } catch (error) {
            console.error('Error creating new posting:', error.message);
        }
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
                ref={(element) => {
                    if (element != null) {
                        QuillRef.current = element;
                    }
                }}
            />
            <button onClick={handleSubmit}>게시물 작성</button>
        </div>
    );
}

export default CreateBoard;
