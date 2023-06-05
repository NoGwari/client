import React from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";

export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  width: 100%;
  height: 50px;
  padding: 0 12px;
  background-color: #000;
  z-index: 1052;
`;

export const ServiceWrap = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  color: white;
`;

export const HeaderLogo = styled.h1`
  display: flex;
  align-items: center;
  width: 91.6px;
  & a {
    display: block;
  }
  & img {
    display: inline-block;
    width: 100%;
  }
`;

const Header: React.FC = () => {
    return (
        <HeaderContainer>
            <ServiceWrap>
                <HeaderLogo>
                    <Link to={"/a"}>
                        <img alt="노과리" src="../../assets/image/logo.PNG" />
                    </Link>
                </HeaderLogo>
            </ServiceWrap>
        </HeaderContainer>
    );
};

export default Header;
