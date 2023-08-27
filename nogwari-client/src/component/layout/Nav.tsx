import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Http } from 'common';

interface Category {
    id: number;
    name: string;
    post_num: number;
}

const NavContainer = styled.div`
    margin-top: 70px;
    display: flex;
    width: 100%;
    height: 100px;
    background-color: whitesmoke;
`;

const GridBox = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
`;

const Nav: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const { categoryId } = useParams<{ categoryId: string }>();

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

    return (
        <>
            <NavContainer>
                <GridBox>
                    <Link to={`/board`}>전체 글 조회</Link>
                    {categories.map((category, index) => (
                        <Link key={index} to={`/board?category=${category.id}`}>
                            {category.name}
                        </Link>
                    ))}
                </GridBox>
            </NavContainer>
        </>
    );
};

export default Nav;
