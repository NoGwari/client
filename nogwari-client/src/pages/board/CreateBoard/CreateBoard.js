import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Http } from '../../../common';
import styled from 'styled-components';
import Layout from 'component/layout/Layout';
import ReactQuill, { Quill } from 'react-quill';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
Quill.register('modules/imageResize', ImageResize);

const Title = styled.div``;
const Content = styled.textarea``;

function CreateBoard() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [editorHtml, setEditorHtml] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const QuillRef = useRef();
    const navigate = useNavigate();

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

    const handleImageUpload = async () => {
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
                                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                            },
                            body: formData,
                        });

                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }

                        const data = await response.json();
                        const newImageUrl = data;

                        setImageUrls((prevImageUrls) => [...prevImageUrls, newImageUrl]);
                        setImageUrl(newImageUrl);

                        const quill = QuillRef.current.getEditor();
                        const range = quill.getSelection();

                        quill.insertEmbed(range.index, 'image', newImageUrl);
                        quill.setSelection(range.index + 1);

                        setImageFiles((prevImageFiles) => [...prevImageFiles, file]);
                    } catch (error) {
                        console.error('이미지 업로드 에러:', error);
                    }
                } else {
                    console.warn('QuillRef.current 가 아직 사용 가능하지 않습니다');
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
                clipboard: {
                    matchVisual: false,
                },
            },
            imageResize: {
                parchment: Quill.import('parchment'),
                modules: ['Resize', 'DisplaySize', 'Toolbar'],
            },
        }),
        []
    );
    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'align',
        'image',
    ];

    const createNewPosting = async (title, content, categoryId, imageUrl) => {
        const url = Http + '/board';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
                body: JSON.stringify({ title, content, categoryId, imageUrl }),
            });
            console.log('잘 간다');
            navigate('/board');

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
            const newPosts = await createNewPosting(title, editorHtml, categoryId, imageUrl);
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
                <option value="">카테고리 선택</option>
                {categories.map((item) => (
                    <>
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    </>
                ))}
            </select>
            <ReactQuill
                value={editorHtml || ' '}
                onChange={handleEditorChange}
                modules={modules}
                theme="snow"
                formats={formats}
                ImageResize={ImageResize}
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
