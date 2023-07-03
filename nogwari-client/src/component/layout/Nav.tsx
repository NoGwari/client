import React from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";

const NavContainer = styled.div`
  margin-top: 70px;
  display: flex;
  width: 100%;
  height: 100px;
  background-color: whitesmoke;
`
const GirdBpx = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 1fr 2fr);
`
const LinkContainer = styled.div`
border: 1px solid black;
`

const LinkBox: React.FC = () => {
    return (
        <LinkContainer>
            <Link to={"/bc"}>
                카테고리1
            </Link>
        </LinkContainer>
    )
}
const Nav: React.FC = () => {
    return (
        <NavContainer>
                <GirdBpx>
                    <Link to={"/bc"}>
                        카테고리1
                    </Link>
                </GirdBpx>
        </NavContainer>
    );
};

export default Nav;