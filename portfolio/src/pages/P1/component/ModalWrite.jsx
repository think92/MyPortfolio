import React, { useState, useEffect } from "react";
import "../css/modalwrite.css";
import axios from "axios";
import Customer from "../Customer";

const ModalWrite = ({ isOpen, onClose, onWriteComplete }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [isPrivate, setIsPrivate] = useState("N");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("qstn_title", title);
    formData.append("qstn_content", content);
    formData.append("qstn_category", category);
    formData.append("qstn_open", isPrivate);
    formData.append("mb_email", sessionStorage.getItem("mb_email"));

    axios
      .post(
        `http://${process.env.REACT_APP_IP}:8083/QstApi/qstnsInsert`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        if (res.data === "Success") {
        } else {
          alert(
            "문의작성이 실패하였습니다. 새로고침 이후 재시도 부탁드립니다."
          );
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });

    // 작성 로직 추가
    console.log("분류 : ", category);
    console.log("제목 : ", title);
    console.log("내용 : ", content);
    console.log("비공개 : ", isPrivate);

    onClose();
  };

  return (
    <div className="modalWrite">
      <div className="modalWrite-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <div className="modalWrite-header">
          <div className="modalWrite-title">
            <h1 className="modalWrite-titles">문의사항 작성하기</h1>
            <div className="modalCheckbox-container">
              <label className="checkBoxes">
                <input
                  type="radio"
                  name="privacy"
                  onChange={() => setIsPrivate("Y")}
                  className="checkBox"
                />
                <p className="checkboxOpen">공개</p>
                <input
                  type="radio"
                  name="privacy"
                  checked={isPrivate === "N"}
                  onChange={() => setIsPrivate("N")}
                  className="checkBox"
                />
                <p className="checkboxPrivate">비공개</p>
              </label>
            </div>
            <div className="ModalWriteuserInrtos">
              <div>
                <select
                  name="choice"
                  className="ModalWriteselectbox"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option className="ModalWrite-opt">
                    항목을 선택해주세요.
                  </option>
                  <option value="I">모자이크 관련</option>
                  <option value="S">서비스 이용</option>
                  <option value="P">프리미엄 결제</option>
                  <option value="G">기타</option>
                  <option value="R">신고</option>
                </select>
                <div id="ModalWriteTitles">
                  <p>제목 : </p>
                  <input
                    type="text"
                    placeholder="제목을 입력해주세요."
                    id="ModalWriteTitle"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  ></input>
                </div>
              </div>
              <div>{/* qstn_content를 표시 */}</div>
            </div>
          </div>
        </div>
        <div className="modalWrite-body">
          <textarea
            className="styled-textarea"
            placeholder="내용을 작성하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <div className="modalWrite-footer">
          <button className="modalWriteClosebutton" onClick={onClose}>
            닫기
          </button>
          <button className="modalWriteSavebutton" onClick={handleSubmit}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalWrite;
