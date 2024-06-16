import React, { useEffect, useState } from "react";
import AdminMinBar from "./AdminMainBar";
import "./css/adminInquiry.css";
import Modal from "./component/Modal"; // 모달 컴포넌트 임포트
import axios from "axios";

const AdminInquiry = () => {
  const [searchTerm, setSearchTerm] = useState(""); // 검색 분류 소
  const [selectType, setSelectType] = useState(""); // 검색 분류 중
  const [selectCategory, setSelectCategory] = useState(""); // 검색 분류 대

  const [inquiries, setInquiries] = useState([]); // 데이터를 저장할 상태
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 상태
  const [selectedInquiry, setSelectedInquiry] = useState(null); // 선택된 문의 상태
  const [waitingCount, setWaitingCount] = useState(0); // 대기 중인 문의 수
  const [todayCount, setTodayCount] = useState(0); // 오늘 등록된 문의 수

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [currentGroup, setCurrentGroup] = useState(1); // 현재 페이지 그룹 상태
  const itemsPerPage = 10; // 페이지당 항목 수
  const pagesPerGroup = 5; // 그룹당 페이지 수

  useEffect(() => {
    qntnsList(); // 문의사항 데이터 가져오기
  }, []);

  const qntnsList = () => {
    // 임의의 데이터
    const data = [
      {
        qstn_idx: 1,
        qstn_category: "I",
        qstn_title: "문의사항 제목1",
        mb_email: "user1@example.com",
        questioned_at: "2024-06-20T10:00:00",
        qstn_answer: "N",
      },
      {
        qstn_idx: 2,
        qstn_category: "S",
        qstn_title: "문의사항 제목2",
        mb_email: "user2@example.com",
        questioned_at: "2024-06-19T11:00:00",
        qstn_answer: "Y",
      },
      {
        qstn_idx: 3,
        qstn_category: "P",
        qstn_title: "문의사항 제목3",
        mb_email: "user3@example.com",
        questioned_at: "2024-06-18T12:00:00",
        qstn_answer: "N",
      },
      {
        qstn_idx: 4,
        qstn_category: "G",
        qstn_title: "문의사항 제목4",
        mb_email: "user4@example.com",
        questioned_at: "2024-06-17T13:00:00",
        qstn_answer: "Y",
      },
      {
        qstn_idx: 5,
        qstn_category: "R",
        qstn_title: "문의사항 제목5",
        mb_email: "user5@example.com",
        questioned_at: "2024-06-16T14:00:00",
        qstn_answer: "N",
      },
    ];
    
    setInquiries(data); // 데이터를 상태에 저장
    filterAndSortInquiries(data); // 필터링 및 정렬 실행
    const waiting = data.filter(
      (inquiry) => inquiry.qstn_answer === "N"
    ).length;
    setWaitingCount(waiting); // 대기 중인 문의 수 계산
    const today = new Date().toISOString().split("T")[0];
    const todayInquiries = data.filter(
      (inquiry) => inquiry.questioned_at.split("T")[0] === today
    ).length;
    setTodayCount(todayInquiries); // 오늘 등록된 문의 수 계산
  };

  // 데이터를 필터링하고 정렬하는 함수
  const filterAndSortInquiries = (data) => {
    console.log("검색 필터 소 : ", searchTerm);
    console.log("검색 필터 중 : ", selectType);
    console.log("검색 필터 대 : ", selectCategory);
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
    console.log("검색 대 분류 : ", event.target.value);
  };

  const handleSelectTypeChange = (event) => {
    setSelectType(event.target.value);
    console.log("검색 중 분류 : ", event.target.value);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
    console.log("검색 소 분류 : ", event.target.value);
  };

  // [검색] 기능
  const handleSearch = () => {
    qntnsList();
    if (
      searchTerm.trim() === "" &&
      selectType === "" &&
      selectCategory === ""
    ) {
      // 검색어가 비어있는 경우 모든 문의 내역을 보여줌
      // qntnsList();
    } else {
      filterAndSortInquiries(inquiries); // 검색 실행 시 필터 및 정렬 실행
    }
  };

  // 모달 열기
  const openModal = (inquiry) => {
    if (sessionStorage.getItem("mb_role") === "A0") {
      setSelectedInquiry(inquiry);
      setModalIsOpen(true);
    } else {
      console.log("관리자가 아닙니다.");
    }
  };

  // 모달 닫기
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedInquiry(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

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

  // 선택된 항목 삭제
  const handleDelete = (e) => {
    const formData = new FormData();
    formData.append("qstns_idx", checkedList);

    console.log("삭제하려는 삭제번호들 : ", checkedList);
    if (true) {
      axios
        .post(
          `http://${process.env.REACT_APP_LOCALHOST}:8083/AdmApi/adminQsntsDelete`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          if (res.data) {
            console.log("삭제여부 : ");
            alert("삭제가 완료되었습니다.");
            qntnsList(); // 삭제 후 문의사항 목록 다시 불러오기
            setCheckedList([]);
          } else {
            alert("삭제 실패");
          }
        })
        .catch((err) => {
          console.error("API 요청 실패:", err);
        });
    }
  };

  // 체크박스 클릭시 삭제 기능
  const [checkedList, setCheckedList] = useState([]);

  const checkedItemHandler = (value, isChecked) => {
    if (isChecked) {
      setCheckedList((prev) => [...prev, value]);
    } else {
      setCheckedList(checkedList.filter((item) => item !== value));
    }
  };

  const handleCheckboxChange = (e, value) => {
    const isChecked = e.target.checked;
    checkedItemHandler(value, isChecked);
  };

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

  return (
    <div className="admin">
      <AdminMinBar />
      <div className="start">
        <div className="startIn">
          <h1 className="startTitle">문의사항 관리</h1>
          <hr />
          <div className="summaryDetails">
            <div className="detailBorder">
              <p className="newTitle">문의 등록</p>
              <p className="newCount">
                <span className="newConutI">{todayCount}</span>건
              </p>
            </div>
            <div className="detailBorder">
              <p className="addC">문의 대기</p>
              <p className="addCount">
                <span className="addConutI">{waitingCount}</span>건
              </p>
            </div>
          </div>
          <hr />
          <div className="buttonss">
            <button className="delete" onClick={handleDelete}>
              삭제
            </button>
            <div className="seletes">
              <select
                className="select"
                name="select"
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
                className="select"
                name="select"
                value={selectType}
                onChange={handleSelectTypeChange}
              >
                <option value="">- 항목 -</option>
                <option value="mb_email">아이디</option>
                <option value="qstn_title">문의제목</option>
                <option value="questioned_at">작성일시</option>
                <option value="qstn_answer">답변</option>
              </select>
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={handleInputChange}
              />
              <button className="delete" onClick={handleSearch}>
                검색
              </button>
            </div>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th className="Inquiryselect">선택</th>
                  <th className="Inquirynum">번호</th>
                  <th className="Inquirytype">문의종류</th>
                  <th className="Inquirytitle">문의제목</th>
                  <th className="Inquiryid">아이디</th>
                  <th className="Inquirydate">문의일시</th>
                  <th className="Inquiryanswer">답변유무</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((inquiry, index) => (
                  <tr key={indexOfFirstItem + index}>
                    <td>
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          handleCheckboxChange(e, inquiry.qstn_idx)
                        }
                      />
                    </td>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{getCategoryName(inquiry.qstn_category)}</td>
                    <td
                      className="clickable"
                      onClick={() => openModal(inquiry)}
                    >
                      {inquiry.qstn_title}
                    </td>
                    <td>{inquiry.mb_email}</td>
                    <td>{formatDate(inquiry.questioned_at)}</td>
                    <td
                      className={inquiry.qstn_answer === "N" ? "red-text" : ""}
                    >
                      {inquiry.qstn_answer === "N" ? "대기 중" : "답변 완료"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
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
          </div>
          <Modal
            isOpen={modalIsOpen}
            onClose={closeModal}
            inquiry={selectedInquiry}
            isAdmin={true} // 관리자 페이지에서는 관리자 모드를 true로 설정
          />
        </div>
      </div>
    </div>
  );
};

export default AdminInquiry;
