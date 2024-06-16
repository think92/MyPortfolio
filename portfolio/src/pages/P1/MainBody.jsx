import React, { useEffect, useRef, useState } from "react";
import MainBar from "./MainBar";
import "./css/mainbar.css";
import "./css/mainbody.css";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudArrowUp,
  faSliders,
  faShapes,
} from "@fortawesome/free-solid-svg-icons";
import {
  faTwitter,
  faYoutube,
  faFacebookF,
  faLinkedinIn,
  faFacebookMessenger,
} from "@fortawesome/free-brands-svg-icons";
import styled from "styled-components";
import ReactModal from "react-modal";

// 섹션 스타일 정의
const Section = styled.div`
  transition: background-color 0.9s ease-in-out;
`;

ReactModal.setAppElement("#root");

const MainBody = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [medias, setMedias] = useState([]);
  const [premiumModalIsOpen, setPremiumModalIsOpen] = useState(false);

  const openLoginModal = () => setLoginModalIsOpen(true);
  const closeLoginModal = () => setLoginModalIsOpen(false);
  const openPremiumModal = () => setPremiumModalIsOpen(true);
  const closePremiumModal = () => setPremiumModalIsOpen(false);

  const handleButtonClick = () => {
    if (
      null === sessionStorage.getItem("mb_email") &&
      (medias.length >= 1 ||
        medias.some((media) => media.type.startsWith("video/")))
    ) {
      openLoginModal();
    } else {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    e.preventDefault();

    const files = Array.from(e.target.files);

    if (
      null === sessionStorage.getItem("mb_email") &&
      (files.length + medias.length > 1 ||
        files.some((file) => file.type.startsWith("video/")))
    ) {
      openLoginModal();
      return;
    }

    // 프리미엄 회원 확인
    if (
      sessionStorage.getItem("mb_role") === "M" &&
      files.some(
        (file) => file.type.startsWith("video/") && file.size > 5 * 1024 * 1024
      )
    ) {
      openPremiumModal();
      return;
    }

    const imagesPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const fileData = {
            type: file.type,
            data: reader.result,
          };
          resolve(fileData);
        };
        reader.onerror = (error) => {
          console.error("Error reading file:", error);
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagesPromises)
      .then((files) => {
        setMedias((prevMedias) => [...prevMedias, ...files]);
        if (files.length > 0) {
          navigate("/Editor", { state: { medias: files } });
        } else {
          console.log("No images to navigate with.");
        }
      })
      .catch((error) => {
        console.error("Error loading files:", error);
      });
  };
  // MainBody 컴포넌트 내에 useEffect 훅 추가
  useEffect(() => {
    window.scrollTo(0, 0); // 페이지가 로드될 때 스크롤을 상단으로 이동
  }, []); // 빈 배열을 의존성으로 전달하여 컴포넌트가 마운트될 때만 실행되도록 함

  useEffect(() => {
    window.addEventListener("scroll", handleScroll); // 스크롤 이벤트 추가
    return () => {
      window.removeEventListener("scroll", handleScroll); // 이벤트 제거
    };
  }, []);

  // 기본 섹션 설정
  const [currentSection, setCurrentSection] = useState(0);
  const sectionHeight = window.innerHeight; // 섹션 높이

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    const scrollY = window.scrollY; // 현재 스크롤 위치
    const newSection = Math.floor(scrollY / sectionHeight); // 현재 섹션 결정
    setCurrentSection(newSection); // 현재 섹션 설정

    const scrollFraction = scrollY % sectionHeight; // 섹션 내 스크롤 비율

    if (scrollFraction > sectionHeight * 0.1) {
      // 섹션 마지막 20%일 때 다음 섹션으로 전환
      setCurrentSection(newSection + 1);
    }
  };

  // 배경색 변경 함수
  const getBackgroundColor = (sectionIndex) => {
    switch (sectionIndex) {
      case 0:
        return "#292c31"; // 첫 번째 섹션의 배경색
      case 1:
        return "#d4fe75"; // 두 번재
      case 2:
        return "#93D0FF"; // 세 번째
      default:
        return "#292c31"; // 기본
    }
  };

  return (
    <div className="body">
      <MainBar />
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleImageChange}
        multiple
      />
      <Section style={{ backgroundColor: getBackgroundColor(currentSection) }}>
        <div id="upload">
          <div className="uploadbackground1">
            <div className="uploadbackground2">
              <div className="uploadtext">
                <div className="simbolrotation">
                  <img
                    src="./img/blurbla_simbol_rotation.png "
                    className="introsimbol"
                    alt="simbol"
                  />
                </div>
                <h1>무료 온라인 모자이크 에디터</h1>
                <p>Blurbla(블러블라) 무료 온라인 모자이크 에디터로</p>
                <p>사진 및 동영상을 손쉽게 모자이크 처리 할 수 있습니다.</p>
                <br />
                <br />
                <button className="uploadtextbtn" onClick={handleButtonClick}>
                  이미지/영상업로드
                </button>
              </div>

              <div className="uploadimg">
                <img src="img/blurbla_main_img01.jpg" alt="mainimg" />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 1번째 소개 */}
      <Section
        className="intro01"
        style={{ backgroundColor: getBackgroundColor(currentSection) }}
      >
        <div id="intro1">
          <div className="introtitlebox">
            <div>
              <img
                src="./img/blurbla-eye.png"
                className="graphic1"
                alt="eye"
              ></img>
              <img
                src="./img/click.png"
                className="graphic2"
                alt="graphicicon"
              ></img>
              <h1 className="introtitle">
                블러블라 무료 모자이크 체험을 통해
                <br />
                에디터로 빠르고 쉽게 처리해보세요
              </h1>
            </div>
          </div>
          <div className="introtextbox">
            <div className="intro1box">
              <div className="iconbox">
                <p>
                  <FontAwesomeIcon
                    icon={faCloudArrowUp}
                    className="loadicon1"
                  />
                </p>
              </div>
              <div className="introtext">
                <h3>즉시 업로드</h3>
                <p>
                  이미지, 영상 업로드 버튼을
                  <br />
                  클릭하면 모자이크 편집을
                  <br />
                  바로 시작할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="intro1box">
              <div className="iconbox">
                <p>
                  <FontAwesomeIcon icon={faShapes} className="loadicon2" />
                </p>
              </div>
              <div className="introtext">
                <h3>사진/영상 모자이크</h3>
                <p>
                  이미지, 영상에 원하는
                  <br />
                  부분을 선택하거나 AI기능을
                  <br />
                  사용해서 모자이크를
                  <br />
                  처리할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="intro1box">
              <div className="iconbox">
                <p>
                  <FontAwesomeIcon icon={faSliders} className="loadicon3" />
                </p>
              </div>
              <div className="introtext">
                <h3>필터 및 조정</h3>
                <p>
                  다양한 모양과 농도를 선택하여
                  <br />
                  원하는 모자이크 결과를
                  <br />
                  만들 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 2번째 소개 */}
      <Section
        className="intro02"
        style={{ backgroundColor: getBackgroundColor(currentSection) }}
      >
        <div id="intro3">
          <div className="intro3box">
            <div id="intro3">
              <img src="./img/main_img02.jpg" alt="mainimg2" />
            </div>
            <div className="intro2">
              <h1 className="introtitles">
                AI를 활용해서 버튼 하나로
                <br />
                훤하는 부분 일괄 모자이크 처리
              </h1>
              <div className="numberbox1">
                <div className="numberbox">
                  <h1 className="num1">1</h1>
                </div>
                <div>
                  <h3>AI로 완벽하게 모자이크 처리 가능</h3>
                  <p>
                    원하는 타입으로 선택하면 AI가 완벽하게 모자이크
                    <br />
                    처리를 해드립니다.
                  </p>
                </div>
              </div>

              <div className="numberbox1">
                <div className="numberbox">
                  <h1 className="num1">2</h1>
                </div>
                <div>
                  <h3>여러 사진과 동영상도 한번에 쉽게 처리</h3>
                  <p>
                    클릭 한 번으로 동영상과 여러 장의 사진을 쉽게 처리
                    <br />할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section style={{ backgroundColor: getBackgroundColor(currentSection) }}>
        <hr className="line"></hr>
        <div id="intro4">
          <div className="blurblaicon">
            <img src="./img/blurbla_simbol.png" alt="simbol"></img>
          </div>
          <div className="snslingbody">
            <div className="snslink">
              <Link to={"/"}>
                <FontAwesomeIcon icon={faTwitter} className="loadicon7" />
              </Link>
              <Link to={"/"}>
                <FontAwesomeIcon icon={faFacebookF} className="loadicon7" />
              </Link>
              <Link to={"/"}>
                <FontAwesomeIcon icon={faYoutube} className="loadicon7" />
              </Link>
              <Link to={"/"}>
                <FontAwesomeIcon icon={faLinkedinIn} className="loadicon7" />
              </Link>
              <Link to={"/"}>
                <FontAwesomeIcon
                  icon={faFacebookMessenger}
                  className="loadicon7"
                />
              </Link>
            </div>
            <div className="adresslink">
              <p>© 2024 - Company, Inc. All rights reserved. Address Address</p>
            </div>
          </div>
          <div className="footeradress">
            <p>상호 : (주)블러블라 l 대표자명 : 임경남</p>
            <p>사업자등록번호 : 000-00-00000 l 연락처 : 00-000-0000</p>
            <p>주소 : 광주광역시 남구 송암로 60 광주CGI센터</p>
          </div>
        </div>
      </Section>

      <ReactModal
        isOpen={loginModalIsOpen}
        onRequestClose={closeLoginModal}
        contentLabel="Login Required"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="modal-content">
          <h2>로그인 하시겠습니까?</h2>
          <p>사진 두 장 이상 또는 동영상을 업로드하려면 로그인이 필요합니다.</p>
          <div className="modal-buttons">
            <button
              className="btn confirm"
              onClick={() => {
                closeLoginModal();
                navigate("/Login");
              }}
            >
              확인
            </button>
            <button className="btn cancel" onClick={closeLoginModal}>
              취소
            </button>
          </div>
        </div>
      </ReactModal>

      <ReactModal
        isOpen={premiumModalIsOpen}
        onRequestClose={closePremiumModal}
        contentLabel="Premium Required"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="modal-content">
          <h2>프리미엄 회원 기능</h2>
          <p>
            동영상 파일 크기가 5MB 이상, 모자이크 제외 기능은 프리미엄 회원만
            가능합니다.
          </p>
          <div className="modal-buttons">
            <button
              className="btn confirm"
              onClick={() => {
                closePremiumModal();
                navigate("/Premium");
              }}
            >
              확인
            </button>
            <button className="btn cancel" onClick={closePremiumModal}>
              취소
            </button>
          </div>
        </div>
      </ReactModal>
    </div>
  );
};

export default MainBody;
