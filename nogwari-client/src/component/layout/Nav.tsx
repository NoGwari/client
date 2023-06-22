import React from "react";
import {Link} from "react-router-dom";
import {HeaderContainer, HeaderLogo, ServiceWrap} from "./Header";
import styled from "styled-components";

const NavContainer = styled.div`
  margin-top: 70px;
  display: flex;
  width: 100%;
  height: 100px;
  background-color: tomato;
`
const GirdBpx = styled.div`
display: grid;
`
const Nav: React.FC = () => {
    return (
        <NavContainer>
                <GirdBpx>
                    <Link to={"/bc"}>
                        카테고리1
                    </Link>
                    <Link to={"/bc"}>
                        카테고리1
                    </Link>
                    <Link to={"/bc"}>
                        카테고리1
                    </Link>

                </GirdBpx>
        </NavContainer>
    );
};

export default Nav;