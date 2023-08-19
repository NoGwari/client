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
    const offset = (page - 1) * limit;
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(Http + '/board');
            const result = await res.json();
            setBoard(result);
        };
        fetchData();
    }, []);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const currentData = board.slice(startIndex, endIndex);
    return (
        <>
            <Layout></Layout>
            <List>전체게시글</List>
            <BoardListContainer>
                <Page />
                표시할 페이지의 개수 : &nbsp;
                <select type="number" value={limit} onChange={({ target: { value } }) => setLimit(Number(value))}>
                    <option value="3">3</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
                <br />
                <hr />
                {currentData.map((item) => (
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
                <Pagination total={board.length} limit={limit} page={page} setPage={setPage} />
            </footer>
        </>
    );
}
export default Board;
