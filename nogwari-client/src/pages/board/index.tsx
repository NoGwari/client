import {styled} from "../../styles/theme";
import {useEffect} from "react";
import {apiGBoard} from "../../store/modules/auth/authR";

const BoardContainer = styled.div`
  margin-top: 120px;
`
function Board(): JSX.Element {
    useEffect(() => {
        apiGBoard("");
    }, []);
    return (
        <BoardContainer>
            <p>보드</p>
        </BoardContainer>
    );
}

export default Board;