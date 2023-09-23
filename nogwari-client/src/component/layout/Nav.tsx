import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Http } from 'common';
import { idText } from 'typescript';

interface Category {
    id: number;
    name: string;
    post_num: number;
}

const NavContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100px;
    background-color: whitesmoke;
`;

const GridBox = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
`;

const CategoryBox = styled.div`
    display: flex;
    margin: 3px;
`;

const CategoryLink = styled(Link)`
    display: inline-block;
    padding: 4px 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: black;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    margin-bottom: 5px;
    margin-right: 2px;
    font-size: 13px;
    font-weight: bold;
    color: white;
    transition: background-color 0.3s;

    &:hover {
        background-color: skyblue;
        transform: translateY(-2px);
    }
    &: active {
        background-color: tomato;
    }
`;

const Nav: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const { categoryId } = useParams<{ categoryId: string }>();
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newId, setNewId] = useState<Number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(Http + '/category');
                if (!response.ok) {
                    throw new Error('API 요청 실패');
                }
                const data = (await response.json()) as Category[];
                setCategories(data);
            } catch (error) {
                console.error('카테고리 가져오는 중 에러발생: ', error);
            }
        };
        fetchData();
    }, []);

    const addCategory = async () => {
        try {
            const response = await fetch(Http + '/category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    id: newId,
                    name: newCategoryName,
                }),
            });
            console.log(response);
            if (response.ok) {
                const responseData = await response.json();
                const updateResponse = await fetch(Http + `/category`);
                const updateData = (await updateResponse.json()) as Category[];
                setCategories(updateData);
                setNewId(responseData.id);
            } else {
                throw new Error('카테고리 추가 실패');
            }
        } catch (error) {
            console.error('에러발생 : ', error);
        }
    };
    const handleCategoryNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewCategoryName(e.target.value);
    };
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;

    let newLink;

    if (currentPath === '/board' && currentSearch !== '?category=0') {
        newLink = `${currentPath}?category=0`;
    } else {
        newLink = '/board';
    }

    return (
        <>
            <NavContainer>
                <GridBox>
                    <CategoryLink to={newLink}>전체 글 조회</CategoryLink>
                    {categories.map((category, index) => (
                        <CategoryLink key={index} to={`/board?category=${category.id}`}>
                            {category.name}
                        </CategoryLink>
                    ))}
                </GridBox>
                <CategoryBox>
                    <textarea
                        placeholder="카테고리 이름을 입력하세요"
                        value={newCategoryName}
                        onChange={handleCategoryNameChange}
                    />
                    <button onClick={addCategory}>카테고리 추가</button>
                </CategoryBox>
            </NavContainer>
        </>
    );
};

export default Nav;
