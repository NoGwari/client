import { styled } from '../../styles/theme';
import { useEffect } from 'react';
import { apiGBoard } from '../../store/modules/auth/authR';
import Layout from 'component/layout/Layout';
import boardDummy from './dummy';
import { FiThumbsUp } from 'react-icons/fi';
import { FiThumbsDown } from 'react-icons/fi';
import { AiOutlineEye } from 'react-icons/ai';

const defaultImageSrc = '../../img/boardlist.png';

//카테고리 이름
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
function Board(): JSX.Element {
    return (
        <>
            <Layout></Layout>
            <List>전체게시글</List>
            <BoardListContainer>
                {boardDummy.map((item) => (
                    <BoardItemContainer key={item.id}>
                        <BoardImage src={item.userImg ? item.userImg : defaultImageSrc}></BoardImage>
                        <BoardContainer>
                            <BoardTitleContainer>
                                <CategoryTitle>{item.categoryName}</CategoryTitle>
                                <BoardTitle>{item.title}</BoardTitle>
                            </BoardTitleContainer>
                            <BoardContent>
                                {item.userId} &middot; {item.createdAt ? item.createdAt : '0000-00-00T00:00:00:000Z'}
                                &nbsp; <AiOutlineEye />
                                {item.views} &middot;&nbsp; <FiThumbsUp />
                                {item.hits} &middot;&nbsp; <FiThumbsDown />
                                {item.dislikes}
                            </BoardContent>
                        </BoardContainer>
                    </BoardItemContainer>
                ))}
            </BoardListContainer>
        </>
    );
}
export default Board;
