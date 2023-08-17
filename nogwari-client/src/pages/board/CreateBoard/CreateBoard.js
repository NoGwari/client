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
        const selectedCategoryId = e.target.value;
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
                        imageUrl = response.data.url;

                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }

                        const data = await response.json();
                        const imageUrl = data.imageUrl;

                        const range = QuillRef.current.getEditor().getSelection();
                        QuillRef.current.getEditor().insertEmbed(range.index, 'image', imageUrl);

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
