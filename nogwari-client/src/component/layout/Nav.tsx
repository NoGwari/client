import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
                    {categories.map((category, index) => (
                        // 각 링크 안에 카테고리 이름만 표시합니다.
                        <Link key={index} to={`/board/${category.name}`}>
                            {category.name}
                        </Link>
                    ))}
                </GridBox>
            </NavContainer>
        </>
    );
};

export default Nav;
