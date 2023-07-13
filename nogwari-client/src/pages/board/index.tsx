import {styled} from "../../styles/theme";

const BoardContainer = styled.div`
  margin-top: 120px;
`
function Board(): JSX.Element {
    return (
        <BoardContainer>
            <p>보드</p>
        </BoardContainer>
    );
}

export default Board;