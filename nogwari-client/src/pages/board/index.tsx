import {styled} from "../../styles/theme";
import {useEffect} from "react";
import {apiGBoard} from "../../store/modules/auth/authR";
import boardDummy from "./dummy";

const defaultImageSrc = '../../img/boardlist.png'

//카테고리 이름
const List = styled.div`
  margin-top: 120px;
  font-size: 17px;
  margin-left:20px;
  font-weight:bold;
`

const BoardListContainer = styled.div`
  margin-top: 50px;
  height:auto;
  flex-wrap: wrap;
  justify-content: center;
`;

const BoardItemContainer = styled.div`
  width: 100%;
  margin: 3px;
  padding: 16px;
  background-color: #f0f0f0;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
`;


const CategoryTitle = styled.button`
  border : 1px solid black;
  border-radius:10px;
  padding : 3px;
  background-color : #bebebe;
  margin-left : 2px;
  margin-right : 2px;
  font-size:13px;
`;

const BoardTitle = styled.h4`
  font-size: 15px;
  margin-bottom:2px;
  margin-left : 2px;
`;

const BoardContent = styled.p`
  font-size: 12px;
  color: #666666;
  margin-top : 3px;
  display : flex;
  flex-direction : row;
`;

const BoardImage = styled.img`
  margin-right:16px;
  width:48px;
  height:48px;
`;

const BoardTitleContainer = styled.div`
  display : flex;
  align-items: center;
  padding: 2px 0;
  overflow: hidden;
  box-sizing : border-box;
  margin: 0;
  vertical-align: middle;
  border: 0;
`;

const BoardContainer = styled.div`
  display : flex;
  flex-direction : column; 
  `
function Board(): JSX.Element {
    useEffect(() => {
        apiGBoard("");
    }, []);
    return (
      <>
        <List>전체게시글</List>
        <BoardListContainer>
        {boardDummy.map(item => (
          <BoardItemContainer key={item.id}>
            <BoardImage src={item.userImg ? item.userImg : defaultImageSrc}></BoardImage>
            <BoardContainer>
              <BoardTitleContainer>
                  <CategoryTitle>{item.categoryName}</CategoryTitle>
                  <BoardTitle>{item.title}</BoardTitle>
              </BoardTitleContainer>
              <BoardContent>
                {item.userId} &middot; {item.createdAt? item.createdAt : "0000-00-00T00:00:00:000Z"} &middot; {item.views} &middot; {item.hits}
              </BoardContent>
            </BoardContainer>
          </BoardItemContainer>
        ))}
      </BoardListContainer>
      </>
    );
  }
export default Board;