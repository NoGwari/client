import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Http } from '../../../common';
import styled from 'styled-components';
import Layout from 'component/layout/Layout';
import ReactQuill, { Quill } from 'react-quill';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import { useLocation } from 'react-router-dom';
Quill.register('modules/imageResize', ImageResize);

const Title = styled.div``;
const Content = styled.textarea``;
const Container = styled.div`
    margin: 0 100px;
`;

function UpdateBoard() {
    const location = useLocation();
    const { title: initialTitle, category: initialCategory, content: initialContent } = location.state;
    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState(initialTitle || '');
    const [category, setCategory] = useState(initialCategory || '');
    const [editorHtml, setEditorHtml] = useState(initialContent || '');
    const [imageFiles, setImageFiles] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const { itemId } = useParams();
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
                setCategory(initialCategory);
            } catch (error) {
                console.log('에러', error.message);
            }
        };
        fetchCategories();
    }, [initialCategory]);

    const onChangeCategoryId = (e) => {
        const selectedCategoryId = e.target.value;
        setCategory(selectedCategoryId);
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
                    [{ align: [] }],
                    ['underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }, 'link'],
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

    const updatePosting = async (title, content, hiddenNum, categoryId) => {
        const url = Http + `/board/${itemId}`;

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
                body: JSON.stringify({ title, content, hiddenNum, categoryId }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Error updating posting', error.message);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const updatePost = await updatePosting(title, editorHtml, 0, category);
            console.log('Updated posting:', updatePost);
            navigate('/board');
        } catch (error) {
            console.error('Error updating posting:', error.message);
        }
    };

    return (
        <div>
            <Layout></Layout>
            <Container>
                <Title>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        placeholder="제목"
                        maxLength={20}
                    />
                </Title>
                <br />
                <select value={category} onChange={onChangeCategoryId}>
                    <option value="">카테고리 선택</option>
                    {categories.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>
                <ReactQuill
                    value={editorHtml || ' '}
                    onChange={handleEditorChange}
                    modules={modules}
                    theme="snow"
                    ImageResize={ImageResize}
                    ref={(element) => {
                        if (element != null) {
                            QuillRef.current = element;
                        }
                    }}
                />
                <button onClick={handleSubmit}>게시물 수정</button>
            </Container>
        </div>
    );
}

export default UpdateBoard;
