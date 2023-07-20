import React, { useState } from "react";
import { Http } from "../../../common";
import { useParams } from "react-router-dom";

function CreateBoard() {
  const params = useParams().itemId;
  console.log(params);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const categoryId = 1; //이거 드롭다운으로 바꾸기
  const hiddenNum = "0"; // 이거 체크박스로 바꾸기
  const createNewPosting = async (title, content, categoryId) => {
    const url = Http + `/board/${params}`; // 백엔드 서버의 엔드포인트 주소
    console.log(useParams);
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization" : `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ title, content, hiddenNum ,categoryId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating new posting:', error.message);
      throw error;
    }
  };

  const onChangeTitle = (e) => {
    const { value } = e.target;
    setTitle(value);
    // setInputCountTitle(e.target.value.length);
  };

  const onChangeContent = (e) => {
    const { value } = e.target;
    setContent(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    createNewPosting(title, content, categoryId)
      .then((newPosts) => {
        console.log('New posting created:', newPosts);
      })
      .catch((error) => {
        console.error('Error creating new posting:', error.message);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={onChangeTitle}
        type="text"
        placeholder="수정할 제목"
        maxLength={20}
      />
      <input
        value={content}
        onChange={onChangeContent}
        type="text"
        placeholder="수정할 내용"
      />
      <button type="submit">게시물 수정</button>
    </form>
  );
}

export default CreateBoard;
