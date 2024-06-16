import React, { useEffect, useState } from "react";
import AdminMinBar from "./AdminMainBar";
import "./css/adminUser.css";
import Filter from "./component/Filter";
import axios from "axios";

const AdminUser = () => {
  // 검색창 상태
  const [searchTerm, setSearchTerm] = useState(""); // 검색 분류 소
  const [selectType, setSelectType] = useState(""); // 검색 분류 중

  const [users, setUsers] = useState([]); // 데이터를 저장할 상태
  const [editingUserId, setEditingUserId] = useState(null); // 수정 중인 사용자 ID
  const [updatedGrade, setUpdatedGrade] = useState(""); // 업데이트된 등급

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [currentGroup, setCurrentGroup] = useState(1); // 현재 페이지 그룹 상태
  const itemsPerPage = 8; // 페이지당 항목 수
  const pagesPerGroup = 5; // 그룹당 페이지 수

  useEffect(() => {
    adminUser(); // 회원 정보 리스트
  }, [searchTerm]);

  const adminUser = () => {
    // 임의의 데이터
    const data = [
      {
        mb_email: "user1@example.com",
        mb_role: "M",
        joinedAt: "2024-06-20T10:00:00",
        payedAt: "2024-06-20T11:00:00",
      },
      {
        mb_email: "user2@example.com",
        mb_role: "U",
        joinedAt: "2024-06-19T10:00:00",
        payedAt: "2024-06-19T11:00:00",
      },
      {
        mb_email: "user3@example.com",
        mb_role: "A0",
        joinedAt: "2024-06-18T10:00:00",
        payedAt: "2024-06-18T11:00:00",
      },
      {
        mb_email: "user4@example.com",
        mb_role: "M",
        joinedAt: "2024-06-17T10:00:00",
        payedAt: "2024-06-17T11:00:00",
      },
      {
        mb_email: "user5@example.com",
        mb_role: "U",
        joinedAt: "2024-06-16T10:00:00",
        payedAt: "2024-06-16T11:00:00",
      },
      {
        mb_email: "user6@example.com",
        mb_role: "M",
        joinedAt: "2024-06-15T10:00:00",
        payedAt: "2024-06-15T11:00:00",
      },
      {
        mb_email: "user7@example.com",
        mb_role: "A0",
        joinedAt: "2024-06-14T10:00:00",
        payedAt: "2024-06-14T11:00:00",
      },
      {
        mb_email: "user8@example.com",
        mb_role: "U",
        joinedAt: "2024-06-13T10:00:00",
        payedAt: "2024-06-13T11:00:00",
      },
    ];

    // 가입일시로 정렬(최신 가입 순)
    const sortedData = data.sort(
      (a, b) => new Date(b.joinedAt) - new Date(a.joinedAt)
    );
    setUsers(sortedData);
  };

  // 데이터를 필터링하고 정렬하는 함수
  const filterAndSortUsers = (data) => {
    console.log("검색 필터 소 : ", searchTerm);
    console.log("검색 필터 중 : ", selectType);
    let filtered = data;

    if (selectType && searchTerm) {
      filtered = filtered.filter((user) =>
        user[selectType]
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      if (a.mb_role === "N" && b.mb_role !== "N") {
        return -1;
      } else if (b.mb_role === "N" && a.mb_role !== "N") {
        return 1;
      } else if (a.mb_role === "N" && b.mb_role === "N") {
        return new Date(a.joinedAt) > new Date(b.joinedAt) ? -1 : 1;
      }
      return 0;
    });

    setUsers(filtered);
  };

  // 검색 중 분류 (콤보박스)
  const handleSelectTypeChange = (event) => {
    setSelectType(event.target.value);
    console.log("검색 중 분류 : ", event.target.value);
  };

  // 검색 소 분류 (input 입력창)
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
    console.log("검색 소 분류 : ", event.target.value);
  };

  // [검색] 기능
  const handleSearch = () => {
    if (searchTerm.trim() === "" && selectType === "") {
      // 검색어와 검색 분류가 모두 비어있는 경우, 전체 회원 정보를 다시 불러옴
      adminUser();
    } else {
      // 검색어나 검색 분류가 존재하는 경우, 이미 불러온 회원 정보에서 필터링 및 정렬을 수행
      filterAndSortUsers(users);
    }
  };

  // 회원 등급변경 전송(이메일, 등급)을 하기위한 데이터 세팅
  const handleEditClick = (user) => {
    setEditingUserId(user.mb_email);
    setUpdatedGrade(user.mb_role);
  };

  // 등급 변경을 위해 클릭한 값으로 설정 (관리자, 일반, 프리미엄)
  const handleGradeChange = (event) => {
    setUpdatedGrade(event.target.value);
  };

  // 회원 등급변경 완료 클릭시 회원DB데이터 수정
  const handleSaveClick = (user) => {
    console.log("등급 변경!", user);
    const meFormDate = new FormData();
    meFormDate.append("mb_role", updatedGrade);
    meFormDate.append("mb_email", editingUserId);

    axios
      .post(
        `http://${process.env.REACT_APP_IP}:8083/AdmApi/memberRoleUpdate`,
        meFormDate,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.error("API 요청 실패:", err);
        setUsers([]); // 오류 발생 시 빈 배열 설정
      });

    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.mb_email === user.mb_email ? { ...u, mb_role: updatedGrade } : u
      )
    );
    setEditingUserId(null);
  };

  // 페이징 번호 표기
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 페이징 다음 > 버튼
  const handleNextGroup = () => {
    setCurrentGroup(currentGroup + 1);
    setCurrentPage((currentGroup - 1) * pagesPerGroup + 1);
  };

  // 페이징 다음 < 버튼
  const handlePrevGroup = () => {
    setCurrentGroup(currentGroup - 1);
    setCurrentPage((currentGroup - 2) * pagesPerGroup + 1);
  };

  // 현재 페이지에 해당하는 데이터 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 번호 계산
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const totalGroups = Math.ceil(totalPages / pagesPerGroup);
  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // 날자형식 변환
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (dateString != null) {
      return date.toLocaleString();
    } else {
      return "없음";
    }
  };

  return (
    <div className="admin">
      <AdminMinBar />
      <div className="start">
        <div className="startIn">
          <h1 className="startTitle">회원 관리</h1>
          <hr />
          <div className="summaryDetails">
            <h1 className="aa">
              전체회원 <span className="bb">{users.length}</span>명
            </h1>
          </div>
          <hr />
          <div className="buttonss">
            <div></div>
            <div className="seletes">
              <select
                className="select"
                name="select"
                value={selectType}
                onChange={handleSelectTypeChange}
              >
                <option value="">- 항목 -</option>
                <option value="mb_email">아이디</option>
                <option value="joined_at">가입일시</option>
                <option value="mb_role">등급</option>
                <option value="payed_at">결제일시</option>
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
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>번호</th>
                  <th>아이디</th>
                  <th>등급</th>
                  <th>가입일시</th>
                  <th>프리미엄 결재일시</th>
                  <th>정보수정</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((user, index) => (
                  <tr key={user.mb_email}>
                    <td>{users.length - indexOfFirstItem - index}</td>
                    <td>{user.mb_email}</td>
                    <td>
                      {editingUserId === user.mb_email ? (
                        <select
                          className="styled-select"
                          value={updatedGrade}
                          onChange={handleGradeChange}
                        >
                          <option value="A0" className="new-member">
                            관리자
                          </option>
                          <option value="M" className="regular-member">
                            일반회원
                          </option>
                          <option value="U" className="premium-member">
                            프리미엄회원
                          </option>
                        </select>
                      ) : (
                        user.mb_role
                      )}
                    </td>
                    <td>{formatDate(user.joinedAt)}</td>
                    <td>{formatDate(user.payedAt)}</td>
                    <td>
                      {editingUserId === user.mb_email ? (
                        <button onClick={() => handleSaveClick(user)}>
                          완료
                        </button>
                      ) : (
                        <button onClick={() => handleEditClick(user)}>
                          수정
                        </button>
                      )}
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
        </div>
      </div>
    </div>
  );
};

export default AdminUser;
