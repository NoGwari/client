import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Http } from '../../../common';
import styled from 'styled-components';
import ReactQuill, { Quill } from 'react-quill';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
Quill.register('modules/imageResize', ImageResize);

const Title = styled.div``;
const Content = styled.textarea``;
const Container = styled.div`
    margin: 0 100px;
`;
function UpdateBoard() {
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

    return (
        <div>
            <button>게시물 수정</button>
        </div>
    );
}

export default UpdateBoard;
