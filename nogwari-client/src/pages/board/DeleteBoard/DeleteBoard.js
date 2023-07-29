import React, { useState } from "react";
import { Http } from "../../../common";
import { useParams } from "react-router-dom";

function DeleteBoard() {
  const params = useParams().itemId;
  console.log(params);
  const deletePost = async () => {
    const url = Http + `/board/${params}`; // 백엔드 서버의 엔드포인트 주소
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Authorization" : `Bearer ${localStorage.getItem("token")}`
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return;
    } catch (error) {
      console.error('Error Deleting posting:', error.message);
      throw error;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    deletePost()
  };



  return (
    <form onSubmit={handleSubmit}>
    <button type="submit">게시물 삭제</button>
    </form>
  );
}

export default DeleteBoard;
