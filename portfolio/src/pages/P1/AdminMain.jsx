import React, { useEffect, useState } from "react";
import AdminMinBar from "./AdminMainBar";
import "./css/adminMain.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faCalendarWeek, faFaceGrinWide } from "@fortawesome/free-solid-svg-icons";
import MonthChart from "./component/MonthChart";
import { RegularSignupChart, PremiumSignupChart } from "./component/WeekChart";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AdminMain = () => {
  const [board, setBoard] = useState([
    { qstn_title: "문의사항 제목1", qstn_category: "I", mb_email: "user1@example.com", questioned_at: "2024-06-20", qstn_answer: "N" },
    { qstn_title: "문의사항 제목2", qstn_category: "S", mb_email: "user2@example.com", questioned_at: "2024-06-19", qstn_answer: "Y" },
    { qstn_title: "문의사항 제목3", qstn_category: "P", mb_email: "user3@example.com", questioned_at: "2024-06-18", qstn_answer: "N" },
    { qstn_title: "문의사항 제목4", qstn_category: "G", mb_email: "user4@example.com", questioned_at: "2024-06-17", qstn_answer: "Y" },
    { qstn_title: "문의사항 제목5", qstn_category: "R", mb_email: "user5@example.com", questioned_at: "2024-06-16", qstn_answer: "N" }
  ]);
  
  const [users, setUsers] = useState(100);
  const [todayCount, setTodayCount] = useState(5);
  const [waitingCount, setWaitingCount] = useState(2);
  const [recentUsers, setRecentUsers] = useState([
    { mb_email: "recentUser1@example.com", mb_role: "일반", joinedAt: "2024-06-20" },
    { mb_email: "recentUser2@example.com", mb_role: "프리미엄", joinedAt: "2024-06-19" },
    { mb_email: "recentUser3@example.com", mb_role: "일반", joinedAt: "2024-06-18" },
    { mb_email: "recentUser4@example.com", mb_role: "프리미엄", joinedAt: "2024-06-17" },
    { mb_email: "recentUser5@example.com", mb_role: "일반", joinedAt: "2024-06-16" }
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [monthlyData, setMonthlyData] = useState({
    labels: ["6월 5일", "6월 10일", "6월 15일", "6월 20일", "6월 25일"],
    regular: [70, 80, 120, 100, 110],
    premium: [35, 40, 70, 50, 55],
  });
  const [weeklyData, setWeeklyData] = useState({
    regular: [
      [1, 2, 3, 4, 5, 6, 7],
      [2, 3, 4, 5, 6, 7, 8],
      [3, 4, 5, 6, 7, 8, 9],
      [4, 5, 6, 7, 8, 9, 10],
      [5, 6, 7, 8, 9, 10, 11],
    ],
    premium: [
      [0, 1, 2, 3, 4, 5, 6],
      [1, 2, 3, 4, 5, 6, 7],
      [2, 3, 4, 5, 6, 7, 8],
      [3, 4, 5, 6, 7, 8, 9],
      [4, 5, 6, 7, 8, 9, 10],
    ],
  });

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleWeekChange = (event) => {
    setSelectedWeek(Number(event.target.value));
  };

  const getWeekNumber = (date) => {
    const day = date.getDate();
    if (day >= 1 && day <= 4) return 1;
    else if (day >= 5 && day <= 11) return 2;
    else if (day >= 12 && day <= 18) return 3;
    else if (day >= 19 && day <= 25) return 4;
    else return 5;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getWeeklyDataForSelectedWeek = () => {
    const weekIndex = selectedWeek - 1;
    const regularData = weeklyData.regular[weekIndex] || [];
    const premiumData = weeklyData.premium[weekIndex] || [];

    return {
      regular: regularData,
      premium: premiumData,
    };
  };

  const weeklyDataForSelectedWeek = getWeeklyDataForSelectedWeek();

  const getCategoryName = (category) => {
    switch (category) {
      case "T":
        return "전체";
      case "I":
        return "모자이크";
      case "S":
        return "서비스";
      case "P":
        return "프리미엄";
      case "G":
        return "기타";
      case "R":
        return "신고";
      default:
        return "알 수 없음";
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0); // 페이지가 로드될 때 스크롤을 상단으로 이동
  }, []); // 빈 배열을 의존성으로 전달하여 컴포넌트가 마운트될 때만 실행되도록 함

  return (
    <div className="admin">
      <AdminMinBar />
      <div className="summary">
        <div className="topconTainer">
          <div className="inqure">
            <div className="inqureHead">
              <h1>문의사항</h1>
              <Link to={"/AdminInquiry"} className="addeye">
                +더 보기
              </Link>
            </div>
            <hr />
            <div className="summaryDetail">
              <div className="detailBorder">
                <p className="newTitle">문의 등록</p>
                <p className="newCount">
                  <span className="newConutI">{todayCount}</span>건
                </p>
              </div>
              <div className="detailBorder">
                <p className="addC">문의 대기</p>
                <p className="addCount">
                  <span className="newConutIes">{waitingCount}</span>건
                </p>
              </div>
            </div>
            <div className="detail">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: "5%" }}>번호</th>
                    <th style={{ width: "8%" }}>항목</th>
                    <th style={{ width: "35%" }}>문의제목</th>
                    <th style={{ width: "10%" }}>문의자 명</th>
                    <th style={{ width: "12%" }}>작성일시</th>
                    <th style={{ width: "8%" }}>답변</th>
                  </tr>
                </thead>
                <tbody>
                  {board
                    .sort(
                      (a, b) =>
                        new Date(b.questioned_at) - new Date(a.questioned_at)
                    )
                    .slice(0, 5)
                    .map((qstns, index) => (
                      <tr key={qstns.qstn_title + index}>
                        <td>{index + 1}</td>
                        <td>{getCategoryName(qstns.qstn_category)}</td>
                        <td className="adminTitle">{qstns.qstn_title}</td>
                        <td>{qstns.mb_email}</td>
                        <td>{formatDate(qstns.questioned_at)}</td>
                        <td
                          className={
                            qstns.qstn_answer === "N" ? "redText" : "blackText"
                          }
                        >
                          {qstns.qstn_answer === "N" ? "대기 중" : "답변 완료"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="membership">
            <div className="inqureHead">
              <h1>회원관리</h1>
              <Link to={"/AdminUser"} className="addeye">
                +더 보기
              </Link>
            </div>
            <hr />
            <div className="totalUsers">
              <div className="totalBorder">
                <p className="totalUserTitle">전체 회원</p>
                <p className="totalCount">
                  <span className="totalConutI">{users}</span>명
                </p>
              </div>
            </div>
            <div className="detail">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: "15%" }}>번호</th>
                    <th style={{ width: "15%" }}>아이디</th>
                    <th style={{ width: "20%" }}>등급</th>
                    <th style={{ width: "25%" }}>가입일시</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user, index) => (
                    <tr key={user.mb_email}>
                      <td>{index + 1}</td>
                      <td>{user.mb_email}</td>
                      <td>{user.mb_role}</td>
                      <td>{formatDate(user.joinedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="subscriber">
          <div className="inqureHead">
            <h1>가입자 현황</h1>
          </div>
          <hr />
          <div className="subscriberDetail">
            <div className="newSubscriber">
              <div className="newSubscriberTitle">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  customInput={<FontAwesomeIcon icon={faCalendarDays} />}
                />
                <h1>
                  {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 신규 가입자
                </h1>
                <div className="weekSelection">
                  <select id="week" value={selectedWeek} onChange={handleWeekChange}>
                    <option value={1}>1주차</option>
                    <option value={2}>2주차</option>
                    <option value={3}>3주차</option>
                    <option value={4}>4주차</option>
                    <option value={5}>5주차</option>
                  </select>
                </div>
              </div>
              <div className="chartContainer">
                <MonthChart monthlyData={monthlyData} />
              </div>
            </div>
            <div className="weekchars">
              <div className="newSubscriberShort">
                <div className="newSubscriberShortTitle">
                  <FontAwesomeIcon icon={faCalendarWeek} />
                  <h1>신규 가입({selectedWeek}주차)</h1>
                </div>
                <div className="chartTotal">
                  <div className="weekChartContainer">
                    <RegularSignupChart
                      data={{
                        labels: ["일", "월", "화", "수", "목", "금", "토"],
                        datasets: [
                          {
                            label: "신규 가입자 수",
                            data: weeklyDataForSelectedWeek.regular,
                          },
                        ],
                      }}
                    />
                  </div>
                  <div>
                    <div className="weekChartTotla">
                      <FontAwesomeIcon className="emo" icon={faFaceGrinWide} />
                      <span className="con">
                        일주일{" "}
                        <span className="conDe">
                          {weeklyDataForSelectedWeek.regular.reduce((a, b) => a + b, 0)}명
                        </span>
                      </span>{" "}
                    </div>
                    <div className="weekChartTotla">
                      <FontAwesomeIcon className="emo" icon={faFaceGrinWide} />
                      <span className="con">
                        한달{" "}
                        <span className="conDe">
                          {monthlyData.regular
                            ? monthlyData.regular.reduce((a, b) => a + b, 0)
                            : 0}명
                        </span>
                      </span>{" "}
                    </div>
                  </div>
                </div>
              </div>
              <div className="newSubscriberVeryShort">
                <div className="newSubscriberVeryShortTitle">
                  <FontAwesomeIcon icon={faCalendarWeek} />
                  <h1>프리미엄 가입({selectedWeek}주차)</h1>
                </div>
                <div className="chartTotal">
                  <div className="weekChartContainer">
                    <PremiumSignupChart
                      data={{
                        labels: ["일", "월", "화", "수", "목", "금", "토"],
                        datasets: [
                          {
                            label: "프리미엄 가입자 수",
                            data: weeklyDataForSelectedWeek.premium,
                          },
                        ],
                      }}
                    />
                  </div>
                  <div>
                    <div className="weekChartTotla red">
                      <FontAwesomeIcon className="emo" icon={faFaceGrinWide} />
                      <span className="con">
                        일주일{" "}
                        <span className="conDe">
                          {weeklyDataForSelectedWeek.premium.reduce((a, b) => a + b, 0)}명
                        </span>
                      </span>{" "}
                    </div>
                    <div className="weekChartTotla red">
                      <FontAwesomeIcon className="emo" icon={faFaceGrinWide} />
                      <span className="con">
                        한달{" "}
                        <span className="conDe">
                          {monthlyData.premium
                            ? monthlyData.premium.reduce((a, b) => a + b, 0)
                            : 0}명
                        </span>
                      </span>{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMain;
