import React, { useRef, useState } from "react";
import "../css/modal.css";

const Modal = ({ isOpen, onClose, inquiry, isAdmin }) => {
  const qstnsToAnswer = useRef(); // 답변 내용
  const [answers, setAnswers] = useState([]); // 답변 내용을 저장할 상태
  const [isAnswered, setIsAnswered] = useState(false); // 답변 완료 여부

  if (!isOpen || !inquiry) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // 답변 저장
  const saveAnswer = () => {
    const newAnswer = {
      ans_content: qstnsToAnswer.current.value,
      admin_id: "admin",
      answered_at: new Date().toISOString(),
    };
    setAnswers((prevAnswers) => [...prevAnswers, newAnswer]);
    setIsAnswered(true);
    alert("답변이 저장되었습니다.");
  };

  const isPrivate = inquiry.qstn_open === "N";
  const canViewContent =
    !isPrivate ||
    (isPrivate && sessionStorage.getItem("mb_email") === inquiry.mb_email) ||
    sessionStorage.getItem("mb_role") === "A0";
  const canViewAnswer =
    isAdmin ||
    (!isPrivate && isAnswered) ||
    sessionStorage.getItem("mb_role") === "A0" ||
    (isAnswered && sessionStorage.getItem("mb_email") === inquiry.mb_email);

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <div className="modal-header">
          <div className="modal-title">
            <h1>문의사항 답변</h1>
            <div className="user-info">
              <img src="./img/mypageuser.png" alt="mypageuser" />
              <div>
                <span className="user-email">{inquiry.mb_email}</span>
                <span className="question-date">
                  {formatDate(inquiry.questioned_at)}
                </span>
              </div>
            </div>
            <div className="question-details">
              <p className="question-title">제목: {inquiry.qstn_title}</p>
              <div className="question-content">
                {canViewContent ? (
                  <p>{inquiry.qstn_content}</p>
                ) : (
                  <p>비공개된 글 입니다.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        {canViewAnswer && (
          <div className="answer-section">
            {answers.map((ans, index) => (
              <div key={index} className="answer-content">
                <div className="user-info">
                  <img src="./img/blurbla_simbol.png" alt="mypageuser" />
                  <div>
                    <span className="user-email">{ans.admin_id}</span>
                    <span className="question-date">
                      {formatDate(ans.answered_at)}
                    </span>
                  </div>
                </div>
                <div className="question-details">
                  <p className="question-content">{ans.ans_content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {!isAnswered && isAdmin && (
          <div className="modal-body">
            <textarea
              ref={qstnsToAnswer}
              className="styled-textarea"
              placeholder="답변을 작성하세요"
            ></textarea>
          </div>
        )}
        <div className="modal-footer">
          <button className="button close-button" onClick={onClose}>
            닫기
          </button>
          {!isAnswered && isAdmin && (
            <button className="button save-button" onClick={saveAnswer}>
              저장
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
