import React, { useState, useEffect } from "react";
import "./css/MypagePay.css";
import MypageBar from "./MypageBar";
import axios from "axios";
import { Link } from "react-router-dom";

const MypagePay = () => {
  const formData = new FormData();
  formData.append("mb_email", sessionStorage.getItem("mb_email"));

  const [payData, setPayData] = useState([]);

  useEffect(() => {
    // 회원 결제 내역 조회
    axios
      .post(
        `http://${process.env.REACT_APP_LOCALHOST}:8083/MemApi/MypagePay`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        const data = res.data || [];
        setPayData(data.payment);
        sessionStorage.setItem("mb_role", data.member.mb_role); // 결재내역 조회를 통해 회원등급 세션에 적용
        console.log(data);
        console.log("회원의 등급 : ", sessionStorage.getItem("mb_role"));
      });
  }, []);

  // 날짜 변경하기
  const formatDate = (dateString) => {
    if (!dateString) return ""; // null 또는 undefined 처리
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // 유효하지 않은 날짜 처리
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:00`;
  };

  return (
    <div>
      <MypageBar />
      <section className="mypagePay">
        <div className="PayBody">
          <div className="ToolListBody">
            <p className="PayList">결재내역</p>
            <div className="MypageNavbar">
              <div>
                <Link to={"/Editor"} className="EditorBoxBody">
                  모자이크 처리
                </Link>
              </div>
              <div>
                <Link to={"/Premium"} className="PremiumBoxBody">
                  프리미엄 가입
                </Link>
              </div>
              <div>
                <Link to={"/Customer"} className="CustomerBoxBody">
                  고객센터
                </Link>
              </div>
            </div>
          </div>
          {/* <p className="PayList">결재내역</p>
          <div className="MypageNavbar">
            <div>
              <Link to={"/Editor"} className="EditorBoxBody">
                모자이크 처리
              </Link>
            </div>
            <div>
              <Link to={"/Premium"} className="PremiumBoxBody">
                프리미엄 가입
              </Link>
            </div>
            <div>
              <Link to={"/Customer"} className="CustomerBoxBody">
                고객센터
              </Link>
            </div>
          </div> */}
          <hr className="Paytoolhr" />
          <div className="PayBodys">
            <div className="PayContainer">
              <input type="date" i="date" className="PayDate"></input>
              <div className="PayDateBoxContainer">
                {payData.length > 0 ? (
                  payData.map((payment, index) => (
                    <div key={index} className="PayDateBox">
                      <p className="PayDates">{formatDate(payment.payed_at)}</p>
                      <p className="PaySuccess">
                        결재완료
                        <span className="Pays">{payment.pay_amount}원</span>
                      </p>
                      <p className="paySuccess">
                        블러블라 프리미엄
                        <span className="pays">{payment.pay_amount}원</span>
                      </p>
                      <div className="PayBox">
                        <p className="payCash">현금영수증</p>
                        <p className="payCheck">거래확인증</p>
                      </div>
                      <hr />
                    </div>
                  ))
                ) : (
                  <div className="no-payments">결재 내역이 없습니다.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MypagePay;
