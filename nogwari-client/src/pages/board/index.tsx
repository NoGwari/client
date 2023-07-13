import {styled} from "../../styles/theme";
import {useEffect} from "react";
import {apiGBoard} from "../../store/modules/auth/authR";
import {useApi} from "../../store/modules/common";

const BoardContainer = styled.div`
  margin-top: 120px;
`
function Board(): JSX.Element {
    const { apiResult } = useApi();
    const callBoard = async () => {
        const res = await apiResult(apiGBoard, {});
        console.log(res)
        return res;
    }

    useEffect(() => {
        callBoard();
    }, []);
    return (
        <BoardContainer>
            <p>보드</p>
        </BoardContainer>
    );
}

export default Board;