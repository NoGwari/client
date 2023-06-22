import styled from "styled-components";
import {useNavigate} from "react-router";

const ErrorWrap = styled.div`
  display: flex;
  justify-content: center;
  > div {
    height: 100vh;
    align-items: center;
    margin-top: 200px;
    p {
      color: black;
      display: flex;
      justify-content: center;
      margin-bottom: 14px;
    }
    button {
      width: 581px;
      height: 50px;
      margin-bottom: 60px;
      background-color: inherit;
      font-size: 14px;
      font-weight: 400;
      border: 3px solid skyblue;
      border-radius: 10px;
    }
  }
`;

const 사공사 = styled.div`
  display: flex;
  font-size: 100px;
  font-weight: 600;
  color: skyblue;
  justify-content: center;
`;
function Error(): JSX.Element {
    const navigate = useNavigate();

    const movePrevPage = () => {
            navigate(-1);
    };

    return (
        <ErrorWrap>
            <div>
                    <사공사>
                        404
                    </사공사>
                    <p>
                        없는 페이지입니다. 하단의 버튼을 눌러 이동할 수 있어요!
                    </p>
                    <button
                        onClick={movePrevPage}
                    >돌아가기</button>
            </div>
        </ErrorWrap>
    );
}

export default Error;