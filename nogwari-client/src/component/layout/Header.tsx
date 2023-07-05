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
  height: 70px;
  padding: 0 12px;
  background-color: #000;
  z-index: 1052;
`;

export const ServiceWrap = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  position: relative;
  color: white;
`;

export const HeaderLogo = styled.h1`
  display: flex;
  align-items: center;
  & a {
    display: block;
  }
  & img {
    border: 3px solid white;
    box-shadow:  1px 0px 6px 0;
    border-radius: 100%;
    display: inline-block;
    height: 85px;
    width: 85px;
  }
`;

const Header: React.FC = () => {
    return (
        <HeaderContainer>
            <ServiceWrap>
                <HeaderLogo>
                    <Link to={"/nogwari"}>
                        <img alt="노과리" src="/img/logo.PNG" />
                    </Link>
                </HeaderLogo>
            </ServiceWrap>
        </HeaderContainer>
    );
};

export default Header;
