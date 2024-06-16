import React, { useEffect, useState } from "react";
import MainBar from "./MainBar";
import "./css/Customer.css";
import Modal from "./component/Modal";
import ModalWrite from "./component/ModalWrite";
import { useNavigate } from "react-router-dom";

const Customer = () => {
  const navigate = useNavigate();

  // 임의 데이터
  const dummyData = [
    {
      num: 1,
      qstn_category: "I",
      qstn_title: "모자이크 문의 1",
      mb_email: "user1@example.com",
      questioned_at: "2023-06-01T12:00:00Z",
      qstn_answer: "N",
      qstn_open: "Y",
      qstn_content: "모자이크가 잘 되지 않아요."
    },
    {
      num: 2,
      qstn_category: "S",
      qstn_title: "서비스 문의 2",
      mb_email: "user2@example.com",
      questioned_at: "2023-06-02T12:00:00Z",
      qstn_answer: "Y",
      qstn_open: "N",
      qstn_content: "서비스 사용 방법을 알고 싶어요."
    },
    // 추가 더미 데이터...
  ];

  const [inquiries, setInquiries] = useState([]); // 데이터를 저장할 상태

  const [searchTerm, setSearchTerm] = useState("");
  const [selectType, setSelectType] = useState("");
  const [selectCategory, setSelectCategory] = useState(""); // 검색 분류 대
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 상태
  const [moadlWriteIsOpen, setModalWriteIsOpen] = useState(false); // 작성 모달 상태
  const [selectedInquiry, setSelectedInquiry] = useState(null); // 선택된 문의 상태
  const [waitingCount, setWaitingCount] = useState(0); // 대기 중인 문의 수
  const [todayCount, setTodayCount] = useState(0); // 오늘 등록된 문의 수

  // 페이지 버튼
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [currentGroup, setCurrentGroup] = useState(1); // 현재 페이지 그룹 상태
  const itemsPerPage = 10; // 페이지당 항목 수
  const pagesPerGroup = 5; // 그룹당 페이지 수

  useEffect(() => {
    boardList();
  }, []);

  const boardList = () => {
    // 임의 데이터 설정
    setInquiries(dummyData);
    filterAndSortInquiries(dummyData);
    const waiting = dummyData.filter((inquiry) => inquiry.qstn_open === "N").length;
    setWaitingCount(waiting);
    const today = new Date().toISOString().split("T")[0];
    const todayInquiries = dummyData.filter(
      (inquiry) => inquiry.questioned_at.split("T")[0] === today
    ).length;
    setTodayCount(todayInquiries);
  };

  //날짜 변경하기
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

  // 모달 열기
  const openModal = (inquiry) => {
    if (
      sessionStorage.getItem("mb_email") === inquiry.mb_email ||
      inquiry.qstn_open === "Y"
    ) {
      setSelectedInquiry(inquiry);
      setModalIsOpen(true);
    } else {
      alert("비공개된 문의사항입니다.");
    }
  };

  // 모달 닫기
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedInquiry(null);
  };

  // 작성하기 버튼 클릭 시 실행될 함수
  const handleWriteButtonClick = () => {
    console.log("작성하기 클릭!");
    if (sessionStorage.getItem("mb_email") === null) {
      alert("로그인이 필요합니다.");
      navigate("/Login");
    } else {
      setModalWriteIsOpen(true);
    }
  };

  // 데이터를 필터링하고 정렬하는 함수
  const filterAndSortInquiries = (data) => {
    let filtered = data;

    if (selectType && searchTerm) {
      filtered = filtered.filter((inquiry) =>
        inquiry[selectType]
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (selectCategory) {
      filtered = filtered.filter(
        (inquiry) => inquiry.qstn_category === selectCategory
      );
    }

    // "대기 중" 상태가 같은 경우, 날짜를 비교하여 오래된 문의를 상위에 배치
    filtered.sort((a, b) => {
      if (a.qstn_answer === "N" && b.qstn_answer !== "N") {
        return -1;
      } else if (b.qstn_answer === "N" && a.qstn_answer !== "N") {
        return 1;
      } else if (a.qstn_answer === "N" && b.qstn_answer === "N") {
        return new Date(a.questioned_at) > new Date(b.questioned_at) ? -1 : 1;
      }
      return 0;
    });

    setInquiries(filtered);
  };

  const handleSelectCategoryChange = (event) => {
    setSelectCategory(event.target.value);
  };

  const handleSelectTypeChange = (event) => {
    setSelectType(event.target.value);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // [검색] 기능
  const handleSearch = () => {
    boardList();
    if (
      searchTerm.trim() === "" &&
      selectType === "" &&
      selectCategory === ""
    ) {
      // 검색어가 비어있는 경우 모든 문의 내역을 보여줌
    } else {
      filterAndSortInquiries(inquiries); // 검색 실행 시 필터 및 정렬 실행
    }
  };

  //페이지
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextGroup = () => {
    setCurrentGroup(currentGroup + 1);
    setCurrentPage(nextGroupStartPage);
  };

  const handlePrevGroup = () => {
    setCurrentGroup(currentGroup - 1);
    setCurrentPage((currentGroup - 2) * pagesPerGroup + 1);
  };

  // 현재 페이지에 해당하는 데이터 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = inquiries.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 번호 계산
  const totalPages = Math.ceil(inquiries.length / itemsPerPage);
  const totalGroups = Math.ceil(totalPages / pagesPerGroup);
  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // 다음 페이지 번호 계산
  const nextGroupStartPage = endPage + 1;

  // 항목 카테고리
  const getCategoryName = (category) => {
    switch (category) {
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
    <div className="customer-body">
      <MainBar />
      <section className="customerbody">
        <div className="customerbox1">
          <div className="customertab">
            <div className="customerinquiry">
              <h1 className="customerinquirys">문의내역</h1>
              <div>
                <select
                  className="customerselectboxes"
                  name="choice"
                  value={selectCategory}
                  onChange={handleSelectCategoryChange}
                >
                  <option value="">- 문의 종류 -</option>
                  <option value="I">모자이크</option>
                  <option value="S">서비스</option>
                  <option value="P">프리미엄</option>
                  <option value="G">기타</option>
                  <option value="R">신고</option>
                </select>
                <select
                  className="customerselectbox"
                  name="choice"
                  value={selectType}
                  onChange={handleSelectTypeChange}
                >
                  <option value="">- 항목 -</option>
                  <option value="mb_email">아이디</option>
                  <option value="qstn_title">문의제목</option>
                  <option value="questioned_at">작성일시</option>
                  <option value="qstn_answer">답변</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                className="searchinput"
                value={searchTerm}
                onChange={handleInputChange}
              />
              <button className="searchbtn" onClick={handleSearch}>
                검색
              </button>
            </div>
            <table className="customertable">
              <thead>
                <tr>
                  <th className="customernum">번호</th>
                  <th className="customeritem">문의종류</th>
                  <th className="customerdivison">문의제목</th>
                  <th className="customerwriter">작성자</th>
                  <th className="customerdate">작성일시</th>
                  <th className="customeranswer">답변</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((inquiry, index) => (
                  <tr key={inquiry.num}>
                    <td className="customernums">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td>{getCategoryName(inquiry.qstn_category)}</td>
                    <td
                      className="customerdivisons"
                      onClick={() => openModal(inquiry)}
                    >
                      {inquiry.qstn_open === "N" ? (
                        <div>
                          <img
                            src="./img/secured-lock.png"
                            className="lockicon"
                            alt="잠금"
                          ></img>
                          비공개된 글 입니다.
                        </div>
                      ) : (
                        <div>{inquiry.qstn_title}</div>
                      )}
                    </td>
                    <td className="customerwriters">{inquiry.mb_email}</td>
                    <td className="customerdates">
                      {formatDate(inquiry.questioned_at)}
                    </td>
                    <td
                      className={
                        inquiry.qstn_answer === "N" ? "redText" : "blackText"
                      }
                    >
                      {inquiry.qstn_answer === "N" ? "대기 중" : "답변 완료"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Modal
              isOpen={modalIsOpen}
              onClose={closeModal}
              inquiry={selectedInquiry}
              isPrivate={selectedInquiry?.qstn_open === "N"}
              isAdmin={false} // 고객 페이지에서는 관리자 모드를 false로 설정
            />

            {/* 페이지 버튼 */}
            <div className="paginations">
              <div></div>
              <div className="ss">
                {currentGroup > 1 && (
                  <button onClick={handlePrevGroup}>{"<"}</button>
                )}
                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    onClick={() => handlePageChange(number)}
                    className={currentPage === number ? "active" : ""}
                  >
                    {number}
                  </button>
                ))}
                {currentGroup < totalGroups && (
                  <button onClick={handleNextGroup}>{">"}</button>
                )}
              </div>
              {/* 작성하기 버튼 */}
              <div className="customerwrite">
                <button
                  id="bt"
                  className="customerwrites"
                  onClick={handleWriteButtonClick}
                >
                  작성하기
                </button>
              </div>
            </div>
          </div>

          <span className="customerbox2">
            <h1 className="customerservice">고객센터</h1>
          </span>
        </div>
      </section>
      <ModalWrite
        isOpen={moadlWriteIsOpen}
        onClose={() => setModalWriteIsOpen(false)}
      />
    </div>
  );
};

export default Customer;
