import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Http } from 'common';
import Layout from 'component/layout/Layout';
import styled from 'styled-components';

function Mypage() {
    return (
        <>
            <Layout></Layout>
            여기는 마이페이지 입니다.
        </>
    );
}

export default Mypage;
