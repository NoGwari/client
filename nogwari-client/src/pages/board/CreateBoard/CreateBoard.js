import React, { useState } from "react";
import { Http } from "../../../common";

function CreateBoard() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const categoryId = 1; //이거 드롭다운으로 바꾸기
  const createNewPosting = async (title, content, categoryId) => {
    const url = Http + '/board'; // 백엔드 서버의 엔드포인트 주소

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization" : `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ title, content, categoryId }),
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
  console.log(title);

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={onChangeTitle}
        type="text"
        placeholder="제목"
        maxLength={20}
      />
      <input
        value={content}
        onChange={onChangeContent}
        type="text"
        placeholder="내용"
      />
      <button type="submit">게시물 생성</button>
    </form>
  );
}

export default CreateBoard;
