import { styled } from '../../styles/theme';
import Layout from 'component/layout/Layout';
import { FiThumbsUp } from 'react-icons/fi';
import { AiOutlineEye } from 'react-icons/ai';
import { Link, useParams, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Http } from '../../common';
import Pagination from './pagination';
import { updateLanguageServiceSourceFile } from 'typescript';
import { FiImage } from 'react-icons/fi';
import { AiOutlineSearch } from 'react-icons/ai';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';

const defaultImageSrc = FiImage;

const Container = styled.div`
    margin: 0 100px;
    :: -webkit-scrollbar {
        display: none;
    }
`;

const List = styled.div`
    margin-top: 30px;
    font-size: 30px;
    font-weight: bold;
    position: relative;
    margin-left: 10vh;
`;

const BoardListContainer = styled.div`
    margin-top: 50px;
    height: auto;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
`;

const BoardItemContainer = styled.div`
    width: 70%;
    height: auto;
    margin: 3px;
    padding: 2px;
    background-color: #f9f9f9;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    border: 1px solid #323232;
    margin: auto;
`;

const CategoryTitle = styled.button`
    border: 1px solid black;
    border-radius: 2px;
    padding: 5px;
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
    padding: 3px;
`;

const BoardContent = styled.p`
    font-size: 12px;
    color: #666666;
    margin-top: 3px;
    display: flex;
    flex-direction: row;
    padding: 2px;
`;

const BoardImage = styled.div`
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
    margin-right: 100px;
`;

const Write = styled.button`
    color: white;
    border-radius: 3px;
    background: skyblue;
    font-size: 15px;
    border: none;
    &:hover {
        background: tomato;
        cursor: pointer;
        transform: translateY(-2px);
    }
`;

const SearchContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 50px;
`;

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
    const [notice, setNotice] = useState([]);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchvalue, setSearchvalue] = useState('');
    const [selectOption, setSelectOption] = useState('title');
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get('category');

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url;

                if (categoryId !== '100') {
                    url = Http + `/board?page=${page}&list_num=${limit}&category=${categoryId}`;

                    const response = await fetch(url, {
                        method: 'GET',
                        credentials: 'include',
                    });

                    if (response.ok) {
                        const result = await response.json();
                        const filteredData = result.data.filter((item) => item.categoryId !== 100);

                        setBoard(filteredData);
                        setTotalPages(Math.ceil(filteredData.length));
                    } else {
                        console.error('불러오기 실패');
                    }
                }
            } catch (error) {
                console.error('에러 발생', error);
            }
        };

        const noticeData = async () => {
            try {
                const response = await fetch(Http + `/board?page=${page}&list_num=${limit}&category=100`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const result = await response.json();
                    setNotice(result.data);
                } else {
                    console.error('불러오기 실패');
                }
            } catch (error) {
                console.error('에러 발생', error);
            }
        };

        fetchData();
        noticeData();
    }, [limit, page, categoryId]);

    const list_num = async () => {
        try {
            const response = await fetch(Http + `/board?list_num=${limit}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
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

    const handleSearchValue = (e) => {
        setSearchvalue(e.target.value);
    };

    const search = async () => {
        try {
            const encodedValue = encodeURIComponent(searchvalue);
            console.log(encodedValue);
            const response = await fetch(Http + `/board/search?searchType=${selectOption}&keyword=${encodedValue}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setBoard(data.rows);
                setTotalPages(Math.ceil(data.count));
                setSearchvalue('');
            } else {
                console.log('검색 결과를 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('에러 발생', error);
        }
    };

    const title = (() => {
        const params = new URLSearchParams(window.location.search);
        const category = params.get('category');

        if (category === null || category === '0') {
            return '전체 게시글';
        } else if (category === '100') {
            return '공지 사항';
        } else {
            return `카테고리${category}`;
        }
    })();

    return (
        <div>
            <Layout></Layout>
            <Container>
                <List>{title}</List>
                <BoardListContainer>
                    {notice.map((item) => (
                        <Link to={`/board/${item.id}`} key={item.id}>
                            <BoardItemContainer
                                style={{ background: '#e0e0e0', border: '1px solid #ccc', padding: '4px' }}
                            >
                                <BoardContainer>
                                    <BoardTitleContainer
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            widh: '100%',
                                        }}
                                    >
                                        <CategoryTitle
                                            style={{ backgroundColor: '#3498db', color: 'white', marginRight: '5px' }}
                                        >
                                            {item.categoryName}
                                        </CategoryTitle>
                                        <BoardTitle style={{ fontSize: '18px', padding: '0', marginRight: '50px' }}>
                                            {item.title}
                                        </BoardTitle>
                                        <BoardContent
                                            style={{ fontSize: '14px', color: '#666666', marginLeft: '450px' }}
                                        >
                                            {item.userNickname} &middot; {CreateTime(item.createdAt)} &nbsp;{' '}
                                            <AiOutlineEye />
                                            {item.views} &middot;&nbsp; <FiThumbsUp />
                                            {item.hits}
                                        </BoardContent>
                                    </BoardTitleContainer>
                                </BoardContainer>
                            </BoardItemContainer>
                        </Link>
                    ))}
                </BoardListContainer>
                <BoardListContainer>
                    {board.map((item) => (
                        <Link to={`/board/${item.id}`} key={item.id}>
                            <BoardItemContainer>
                                <BoardImage>
                                    {item.thumbnail ? (
                                        <img
                                            src={item.thumbnail}
                                            alt="Thumbnail"
                                            style={{ height: '48px', width: '48px' }}
                                        />
                                    ) : (
                                        <FiImage style={{ height: '48px', width: '48px' }} />
                                    )}
                                </BoardImage>
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
                <br />
                <hr style={{ width: '80%' }} />
                <WriteContainer>
                    <Write>
                        <Link to={`/createBoard`}>글쓰기</Link>
                    </Write>
                </WriteContainer>
                <SearchContainer>
                    <div>
                        표시할 페이지의 개수 &nbsp;
                        <select
                            style={{ cursor: 'pointer', padding: '1px', fontSize: '15px', marginBottom: '3px' }}
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
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Box
                            component="form"
                            sx={{ '& .MuiTextField-rppt': { m: 1, width: '40ch' }, height: '50px' }}
                            noValidate
                            autoComplete="off"
                        >
                            <FormControl
                                sx={{
                                    m: 1,
                                    minWidth: 120,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <NativeSelect value={selectOption} onChange={(e) => setSelectOption(e.target.value)}>
                                    <option value="title">제목</option>
                                    <option value="nickname">작성자</option>
                                </NativeSelect>
                                &nbsp;
                                <TextField
                                    variant="standard"
                                    type="text"
                                    value={searchvalue}
                                    onChange={handleSearchValue}
                                    placeholder="검색할 내용을 입력하세요"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <AiOutlineSearch style={{ cursor: 'pointer' }} onClick={search} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </FormControl>
                        </Box>
                    </div>
                </SearchContainer>
                <footer>
                    <Pagination total={totalPages} limit={limit} page={page} setPage={setPage} value={limit} />
                </footer>
            </Container>
        </div>
    );
}

export default Board;
