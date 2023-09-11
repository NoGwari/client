import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

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
        box-shadow: 1px 0px 6px 0;
        border-radius: 100%;
        display: inline-block;
        height: 85px;
        width: 85px;
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
