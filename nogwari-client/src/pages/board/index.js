import { styled } from '../../styles/theme';
import Layout from 'component/layout/Layout';
import { FiThumbsUp } from 'react-icons/fi';
import { AiOutlineEye } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import React, { useEffect, lazy, Suspense, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Http } from '../../common';
import Pagination from './pagination';

const defaultImageSrc = '../../img/boardlist.png';

const List = styled.div`
    margin-top: 50px;
    font-size: 17px;
    margin-left: 20px;
    font-weight: bold;
`;

const BoardListContainer = styled.div`
    margin-top: 50px;
    height: auto;
    flex-wrap: wrap;
    justify-content: center;
`;

const BoardItemContainer = styled.div`
    width: 100%;
    margin: 3px;
    padding: 16px;
    background-color: #f9f9f9;
    border-radius: 8px;
    display: flex;
    flex-direction: row;
    border: 1px solid #323232;
`;

const CategoryTitle = styled.button`
    border: 1px solid black;
    border-radius: 2px;
    padding: 3px;
    background-color: #e2e2e2;
    margin-left: 2px;
    margin-right: 2px;
    font-size: 13px;
    font-weight: bold;
`;

const BoardTitle = styled.h4`
    font-size: 15px;
    margin-bottom: 2px;
    margin-left: 2px;
`;

const BoardContent = styled.p`
    font-size: 12px;
    color: #666666;
    margin-top: 3px;
    display: flex;
    flex-direction: row;
`;

const BoardImage = styled.img`
    margin-right: 16px;
    width: 48px;
    height: 48px;
`;

const BoardTitleContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 2px 0;
    overflow: hidden;
    box-sizing: border-box;
    margin: 0;
    vertical-align: middle;
    border: 0;
`;

const BoardContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const WriteContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const Write = styled.button`
    border-radius: 4px;
`;

const Page = styled.button``;

function CreateTime(timestamp) {
    if (!timestamp) {
        return '알수없음';
    }

    const now = new Date();
    const past = new Date(timestamp);
    const timeDiff = now.getTime() - past.getTime();
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days >= 7) {
        const Month = past.getMonth() + 1;
        const Day = past.getDate();
        return `${Month}월 ${Day}일`;
    } else if (days >= 1) {
        return `${days}일 전`;
    } else if (hours >= 1) {
        return `${hours}시간 전`;
    } else if (minutes >= 1) {
        return `${minutes}분 전`;
    }

    return '방금 전';
}

function Board() {
    const [board, setBoard] = useState([]);
    const [limit, setLimit] = useState(5);
    const [page, setPage] = useState(1);
    const [categroy, setCategory] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [categoryNames, setCategoryNames] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(Http + `/board?page=${page}&list_num=${limit}&category=${categroy}`);
            const result = await res.json();
            setBoard(result.data);
            setTotalPages(Math.ceil(result.count));

            const newCategoryNames = result.data.map((item) => item.categoryName);
            setCategoryNames([...new Set(newCategoryNames)]);
        };
        fetchData();
    }, [limit, page, categroy]);

    const list_num = async () => {
        try {
            const response = await fetch(Http + `/board?list_num=${limit}`);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
            } else {
                console.error('error');
            }
        } catch (error) {
            console.log('error 발생', error);
        }
    };
    useEffect(() => {
        list_num(limit);
    }, [limit]);

    board.forEach((item) => {
        const categoryName = item.categoryName;
        if (!categoryNames.includes(categoryName)) {
            categoryNames.push(categoryName);
        }
    });

    return (
        <>
            <Layout></Layout>
            <List>전체게시글</List>
            <BoardListContainer>
                <Page />
                표시할 페이지의 개수 : &nbsp;
                <select
                    type="number"
                    value={limit}
                    onChange={({ target: { value } }) => {
                        setLimit(Number(value));
                        setPage(1);
                    }}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
                <br />
                보고싶은 카테고리 이름 : &nbsp;
                <select
                    type="string"
                    value={categoryNames}
                    onChange={({ target: { value } }) => {
                        setCategoryNames(value);
                        setPage(1);
                    }}
                >
                    <option value="">전체 카테고리</option>
                    {categoryNames.map((categoryName, index) => {
                        <option key={index} value={categoryName}>
                            {categoryName}
                        </option>;
                    })}
                </select>
                <br />
                <hr />
                {board.map((item) => (
                    <Link to={`/board/${item.id}`} key={item.id}>
                        <BoardItemContainer>
                            <BoardImage src={item.userImg ? item.userImg : defaultImageSrc}></BoardImage>
                            <BoardContainer>
                                <BoardTitleContainer>
                                    <CategoryTitle>{item.categoryName}</CategoryTitle>
                                    <BoardTitle>{item.title}</BoardTitle>
                                </BoardTitleContainer>
                                <BoardContent>
                                    {item.userNickname} &middot; {CreateTime(item.createdAt)}
                                    &nbsp; <AiOutlineEye />
                                    {item.views} &middot;&nbsp; <FiThumbsUp />
                                    {item.hits}
                                </BoardContent>
                            </BoardContainer>
                        </BoardItemContainer>
                    </Link>
                ))}
            </BoardListContainer>
            <WriteContainer>
                <Write>
                    <Link to={`/createBoard`}>글쓰기</Link>
                </Write>
            </WriteContainer>
            <hr />
            <footer>
                <Pagination total={totalPages} limit={limit} page={page} setPage={setPage} value={limit} />
            </footer>
        </>
    );
}
export default Board;
