import React, { useContext, useEffect, useState } from "react";
import "./css/MypageCustom.css";
import MypageBar from "./MypageBar";
import axios from "axios";
import Modal from "./component/Modal";
import { LoginUserContext } from "./context/LoginUserContent";
import { Link } from "react-router-dom";

const MypageCustom = () => {
  const [inquiries, setInquiries] = useState([]); // 데이터를 저장할 상태

  const [searchTerm, setSearchTerm] = useState(""); // 검색 분류 소
  const [selectType, setSelectType] = useState(""); // 검색 분류 중
  const [selectCategory, setSelectCategory] = useState(""); // 검색 분류 대

  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 상태
  const [selectedInquiry, setSelectedInquiry] = useState(null); // 선택된 문의 상태

  // 페이지 버튼
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [currentGroup, setCurrentGroup] = useState(1); // 현재 페이지 그룹 상태
  const itemsPerPage = 12; // 페이지당 항목 수
  const pagesPerGroup = 5; // 그룹당 페이지 수

  const { login_id } = useContext(LoginUserContext); // 로그인한 유저 아이디 가져오기

  useEffect(() => {
    boardList();
    // console.log("length : ", inquiri);
  }, [login_id, searchTerm, selectType]);

  const boardList = () => {
    axios
      .post(`http://${process.env.REACT_APP_IP}:8083/AdmApi/adminInquiry`, {})
      .then((res) => {
        const data = Array.isArray(res.data.aQstnsList)
          ? res.data.aQstnsList
          : [];
        setInquiries(data); // 데이터를 상태에 저장
        filterAndSortInquiries(data); // 필터링 및 정렬 실행
        console.log(data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  };

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

  // 모달
  const openModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setModalIsOpen(true);
  };

  // 데이터를 필터링하고 정렬하는 함수
  const filterAndSortInquiries = (data) => {
    console.log("검색 필터 소 : ", searchTerm);
    console.log("검색 필터 중 : ", selectType);
    console.log("검색 필터 대 : ", selectCategory);
    let filtered = data.filter((inquiry) => inquiry.mb_email === sessionStorage.getItem("mb_email"));
    // let filtered = data;

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
      if (a.answerStatus === "N" && b.answerStatus !== "N") {
        return -1;
      } else if (b.answerStatus === "N" && a.answerStatus !== "N") {
        return 1;
      } else if (a.answerStatus === "N" && b.answerStatus === "N") {
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
    boardList();
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextGroup = () => {
    setCurrentGroup(currentGroup + 1);
    setCurrentPage((currentGroup - 1) * pagesPerGroup + 1);
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

  // 선택된 항목 삭제
  const handleDelete = (e) => {
    const formData = new FormData();
    formData.append("qstns_idx", checkedList);

    console.log("삭제하려는 삭제번호들 : ", checkedList);
    if (true) {
      // alert("정말로 삭제를 진행하시겠습니까?");
      axios
        .post(
          `http://${process.env.REACT_APP_IP}:8083/AdmApi/adminQsntsDelete`,
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

  return (
    <div>
      <MypageBar />
      <section className="mypageCustom">
        <div className="CustomBody">
          <div className="ToolListBody">
            <p className="ToolList">문의사항</p>
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
          <hr className="Customtoolhr" />
          <div className="CustomLists">
            <div>
              <button className="CustomDelete" onClick={handleDelete}>
                삭제
              </button>
            </div>
            <div>
              <select name="choice" className="CustomChoiceBox"
              value={selectCategory}
              onChange={handleSelectCategoryChange}>
                <option className="">- 문의종류 -</option>
                <option value="I">모자이크</option>
                <option value="S">서비스</option>
                <option value="P">프리미엄</option>
                <option value="G">기타</option>
                <option value="R">신고</option>
              </select>
            </div>
            <div>
              <select
                name="choice"
                className="CustomChoiceBoxs"
                value={selectType}
                onChange={handleSelectTypeChange}
              >
                <option className="">- 항목 -</option>
                <option value="mb_email">아이디</option>
                <option value="qstn_title">문의제목</option>
                <option value="questioned_at">작성일시</option>
                <option value="qstn_answer">답변</option>
                {/* <option value="answeredAt">답변일시</option> */}
              </select>
            </div>
            <div>
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                className="customSearch"
                value={searchTerm}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <button className="searchBtn" onClick={handleSearch}>
                검색
              </button>
            </div>
          </div>
          <table className="customTable">
            <thead>
              <tr>
                <th className="customCheck">선택</th>
                <th className="customNum">번호</th>
                <th className="customItem">문의종류</th>
                <th className="customDivison">문의제목</th>
                <th className="customWriter">작성자</th>
                <th className="customDate">작성일시</th>
                <th className="customAnswer">답변</th>
                {/* <th className="customAnswerOk">답변완료</th> */}
              </tr>
            </thead>
            <tbody>
              {currentItems.map(
                (inquiry, index) =>
                  index < 12 && (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          id={inquiry}
                          value={inquiry.qstn_idx}
                          onChange={(e) =>
                            handleCheckboxChange(e, inquiry.qstn_idx)
                          }
                        ></input>
                      </td>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{getCategoryName(inquiry.qstn_category)}</td>
                      <td
                        className="CustomNum"
                        onClick={() => openModal(inquiry)}
                      >
                        {inquiry.qstn_title}
                      </td>
                      <td>{inquiry.mb_email}</td>
                      <td>{formatDate(inquiry.questioned_at)}</td>
                      <td
                        className={
                          inquiry.qstn_answer === "N" ? "redText" : "blackText"
                        }
                      >
                        {inquiry.qstn_answer === "N" ? "대기 중" : "답변 완료"}
                      </td>
                      {/* <td>{formatDate(inquiry.answered_at)}</td> */}
                    </tr>
                  )
              )}
            </tbody>
          </table>
          <Modal
            isOpen={modalIsOpen}
            onClose={() => setModalIsOpen(false)}
            inquiry={selectedInquiry}
            isAdmin={false} // 고객 페이지에서는 관리자 모드를 false로 설정
            isMypageCustomer={true} // 마이페이지 고객 모달로 설정
          />
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
      </section>
    </div>
  );
};
export default MypageCustom;
