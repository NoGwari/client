import styled from 'styled-components';
import { Link } from 'react-router-dom';

const ErrorWrap = styled.div`
    display: flex;
    justify-content: center;
    > div {
        align-items: center;
        margin-top: 200px;
        p {
            color: black;
            display: flex;
            justify-content: center;
            margin-bottom: 14px;
        }
        a {
            width: 581px;
            height: 50px;
            margin-bottom: 60px;
            background-color: inherit;
            font-size: 14px;
            font-weight: 400;
            border: 3px solid skyblue;
            border-radius: 10px;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
            color: black;
        }
    }
`;

const Sagongsa = styled.div`
    display: flex;
    font-size: 100px;
    font-weight: 600;
    color: skyblue;
    justify-content: center;
`;
function Error(): JSX.Element {
    return (
        <ErrorWrap>
            <div>
                <Sagongsa>404</Sagongsa>
                <p>없는 페이지입니다. 하단의 버튼을 눌러 이동할 수 있어요!</p>
                <Link to="/board">돌아가기</Link>
            </div>
        </ErrorWrap>
    );
}

export default Error;
