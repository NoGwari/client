import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const HeaderContainer = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
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
        box-shadow: 1px 0px 6px 0;
        border-radius: 100%;
        display: inline-block;
        height: auto; /* 높이를 자동으로 조정합니다. */
        max-height: 85px; /* 최대 높이를 85px로 제한합니다. */
        max-width: 85px; /* 최대 넓이를 85px로 제한합니다. */
        width: 10vw; /* 넓이를 화면 넓이의 10%로 설정합니다. */
    }
`;

export const Navbar = styled.li`
    display: flex;
    width: 100px;
    align-items: center;
    justify-content: center;
    position: relative;
    color: white;
`;
export const NavbarWrap = styled.ul`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    color: white;
`;

const Header: React.FC = () => {
    const isNotLogin = () => {
        return sessionStorage.getItem('token') === null;
    };
    return (
        <HeaderContainer>
            <ServiceWrap>
                <HeaderLogo>
                    <Link to={'/board'}>
                        <img alt="노과리" src="/img/logo.PNG" />
                    </Link>
                </HeaderLogo>
            </ServiceWrap>
            <NavbarWrap>
                {isNotLogin() ? (
                    <>
                        <Navbar>
                            <Link to="/signin">회원가입</Link>
                        </Navbar>
                        <Navbar>
                            <Link to="/login">로그인</Link>
                        </Navbar>
                    </>
                ) : (
                    <Navbar>
                        <Link to="/mypage">마이페이지</Link>
                    </Navbar>
                )}
            </NavbarWrap>
        </HeaderContainer>
    );
};

export default Header;
