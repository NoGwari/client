import styled from 'styled-components';
import Layout from '../layout/Layout';

const MyContainer = styled.div`
  
`;

const MyText = styled.p`
  
  color: darkblue;
  font-size: 18px;
  font-weight: bold;
`;

function My(): JSX.Element {
  return (
    <MyContainer>
      <Layout />
      <MyText>여기는 마이페이지 입니다.</MyText>
    </MyContainer>
  );
}

export default My;
