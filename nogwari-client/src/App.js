import './App.css';
import {useEffect, useState} from "react";
import styled from "styled-components";

const BoardTest = styled.div`
    display: flex;
`;
function App() {
    const [board, setBoard] = useState([]);
    useEffect(() => {
        const fetchData = async() => {
            const res = await fetch('http://18.224.69.86:3000' + '/board');
            const result = res.json();
            return result;
        }
        fetchData().then(res => setBoard(res));
    }, []);
    return (
        <div className="App">
            <header className="App-header">
                {board && board.map(x =>
                    <BoardTest>
                        {x.content}
                    </BoardTest>
                    )
                }
                <p>
                    노과리 프로젝트 배포
                </p>
            </header>
        </div>
    );
}

export default App;
