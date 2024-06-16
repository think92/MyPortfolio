import React from "react";
import "./css/adminMainBody.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faRightFromBracket,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";

const AdminMain = () => {
  const navigate = useNavigate();

  const handleClick = (message) => {
    alert(message);
    navigate("/Admin");
  };

  const changeBtn = {
    backgroundColor: "#4ce577",
  };

  function LogOut(params) {
    sessionStorage.clear(); // 로그인(id) 로그아웃(false) 상태로 설정할것..!
  }

  return (
    <section className="adminbar-body">
      <div className="home">
        <Link to={"/"} className="admingomainhome">
          <FontAwesomeIcon className="homeIcon" icon={faHouse} />
          <p>메인 홈</p>
        </Link>
      </div>
      <div className="adminIntroduce">
        <img src="./img/blurbla_simbol.png" className="adminsimbol" />
        <p className="admin1">관리자(admin1)</p>
        <div>
          <NavLink
            to={"/Admin"}
            className="admintool"
            style={({ isActive }) => (isActive ? changeBtn : {})}
          >
            <FontAwesomeIcon
              icon={faCircle}
              className="facircle"
              to={"/Admin"}
              style={({ isActive }) => (isActive ? changeBtn : {})}
            />
            <p className="admintools">대시보드</p>
          </NavLink>
          <NavLink
            to={"/AdminInquiry"}
            className="admincustomer"
            style={({ isActive }) => (isActive ? changeBtn : {})}
          >
            <FontAwesomeIcon
              icon={faCircle}
              className="facirclewhite"
              to={"/AdminInquiry"}
              onClick={() => {
                changeBtn();
              }}
            />
            <p className="menuListcustomers">문의사항</p>
          </NavLink>
          <NavLink
            to={"/AdminUser"}
            className="adminuser"
            style={({ isActive }) => (isActive ? changeBtn : {})}
          >
            <FontAwesomeIcon
              icon={faCircle}
              className="facirclewhite"
              to={"/AdminUser"}
              style={({ isActive }) => (isActive ? changeBtn : {})}
            />
            <p className="adminuseres">회원관리</p>
          </NavLink>

          <NavLink className="adminupdate">
            <FontAwesomeIcon
              icon={faCircle}
              className="facirclewhite"
              onClick={() => {
                changeBtn();
              }}
            />
            <p
              className="adminupdates"
              onClick={() => handleClick("페이지 준비중입니다.")}
            >
              기능 업데이트
            </p>
          </NavLink>
          <NavLink className="adminupdate">
            <FontAwesomeIcon
              icon={faCircle}
              className="facirclewhite"
              onClick={() => {
                changeBtn();
              }}
            />
            <p
              className="adminupdates"
              onClick={() => handleClick("페이지 준비중입니다.")}
            >
              알림 서비스
            </p>
          </NavLink>
          <NavLink className="adminupdate">
            <FontAwesomeIcon
              icon={faCircle}
              className="facirclewhite"
              onClick={() => {
                changeBtn();
              }}
            />
            <p
              className="adminupdates"
              onClick={() => handleClick("페이지 준비중입니다.")}
            >
              관리자 권한 설정
            </p>
          </NavLink>
        </div>
      </div>
      <div className="adminlogout">
        <FontAwesomeIcon
          className="faRightFromBracket"
          icon={faRightFromBracket}
        />
        <Link to={"/"} className="adminlogouts" onClick={LogOut}>
          로그아웃
        </Link>
      </div>
    </section>
  );
};

export default AdminMain;
