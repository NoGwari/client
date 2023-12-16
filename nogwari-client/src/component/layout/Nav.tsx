import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Http } from 'common';
import { idText } from 'typescript';
import { GoTriangleDown } from 'react-icons/go';
import { TextSize } from 'styles/styleds';
import { TiDeleteOutline } from 'react-icons/ti';

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
    height: 60px;
    background-color: whitesmoke;
    position: relative;
`;

const GridBox = styled.div`
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: 16px;
    margin-left: 10px;
`;

const CategoryBox = styled.div`
    display: flex;
    justify-content: flex-end;
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
    position: relative;
    display: inline-block;
    &:hover {
        background-color: skyblue;
        transform: translateY(-2px);
        .delete-button {
            opacitiy: 1;
        }
    }
    &: active {
        background-color: tomato;
    }
`;

const CategoryButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-grow: 1;

    input[type='text'] {
        height: 30px;
        border: 1px solid #ccc;
        padding: 5px;
        box-sizing: border-box;
    }
    button {
        padding: 6px 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: black;
        color: white;
        cursor: pointer;
        &:hover {
            background-color: skyblue;
            transform: translateY(-2px);
            .delete-button {
                opacity: 1;
            }
        }
        &: active {
            background-color: tomato;
        }
    }
`;
const DeleteButton = styled.button`
    position: absolute;
    bottom: -30px;
    right: 40px;
    background-color: transparent;
    border: none;
    cursor: pointer;
`;

const Nav: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const { categoryId } = useParams<{ categoryId: string }>();
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newId, setNewId] = useState<Number>(0);
    const [toggle, setToggle] = useState(false);
    const { itemId } = useParams();

    const isAdmin = sessionStorage.getItem('role') == 'admin';
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
    const deleteCategory = async (itemId: Number) => {
        try {
            const response = await fetch(Http + `/category/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
            });
            console.log(response);
            if (response.status === 200) {
                const updateResponse = await fetch(Http + `/category`);
                const updateData = await updateResponse.json();
                setCategories(updateData);
            } else {
                throw new Error('카테고리 삭제 실패');
            }
        } catch (error) {
            console.error('에러발생 : ', error);
        }
    };
    const handleCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCategoryName(e.target.value);
    };

    const handleToggle = () => {
        setToggle((prevState) => !prevState);
    };

    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;

    let notice = `/board?category=100`;
    let newLink;
    if (currentPath === '/board' && currentSearch !== '?category=0') {
        newLink = `/board?category=0`;
    } else {
        newLink = '/board';
    }

    return (
        <>
            <NavContainer>
                <GridBox>
                    <CategoryLink to={newLink}>전체 글 조회</CategoryLink>
                    {categories.map(
                        (category, index) =>
                            category.id !== 100 && (
                                <div key={index} style={{ position: 'relative' }}>
                                    <CategoryLink to={`/board?category=${category.id}`}>{category.name}</CategoryLink>
                                    {isAdmin && (
                                        <DeleteButton className="delete-button">
                                            <TiDeleteOutline onClick={() => deleteCategory(category.id)} />
                                        </DeleteButton>
                                    )}
                                </div>
                            )
                    )}
                </GridBox>
            </NavContainer>
            <div style={{ backgroundColor: '#F5F5F5', height: '45px' }}>
                {isAdmin && (
                    <CategoryBox>
                        {toggle && (
                            <CategoryButton>
                                <input
                                    type="text"
                                    placeholder="추가할 카테고리 이름"
                                    value={newCategoryName}
                                    onChange={handleCategoryNameChange}
                                />
                                <button
                                    onClick={() => {
                                        addCategory();
                                        setNewCategoryName('');
                                    }}
                                >
                                    추가
                                </button>
                            </CategoryButton>
                        )}
                        <GoTriangleDown
                            onClick={handleToggle}
                            style={{ fontSize: '30px', transform: 'rotate(90deg)' }}
                        />
                    </CategoryBox>
                )}
            </div>
        </>
    );
};

export default Nav;
