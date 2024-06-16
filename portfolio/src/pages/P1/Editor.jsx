import "./css/Editor.css";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MainBar from "./MainBar";
import axios from "axios";
import {
  faCar,
  faFaceSmile,
  faPhone,
  faSmoking,
  faVectorSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faSquare, faCircle } from "@fortawesome/free-regular-svg-icons";
import { useLocation } from "react-router-dom";
import AWS from "aws-sdk";
import ReactModal from "react-modal";
import { useNavigate } from "react-router-dom";
import localforage from "localforage";

ReactModal.setAppElement("#root");

const Editor = () => {
  const location = useLocation();
  const fileInputRef = useRef(null);
  const [mediaView, setMediaView] = useState(null);
  const [medias, setMedias] = useState([]);
  const [intensityAuto, setIntensityAuto] = useState(50);
  const [intensity, setIntensity] = useState(50);
  const [updatedAreas, setUpdatedAreas] = useState([]);
  const [activeTool, setActiveTool] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [dragStart, setDragStart] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [activeArea, setActiveArea] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [premiumModalIsOpen, setPremiumModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const openDeleteModal = () => setDeleteModalIsOpen(true);
  const closeDeleteModal = () => setDeleteModalIsOpen(false);
  const openLoginModal = () => setLoginModalIsOpen(true);
  const closeLoginModal = () => setLoginModalIsOpen(false);
  const navigate = useNavigate();
  const openPremiumModal = () => setPremiumModalIsOpen(true);
  const closePremiumModal = () => setPremiumModalIsOpen(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      // 로딩이 true일 때 실행할 코드
      console.log("로딩 중...");
    } else {
      // 로딩이 false일 때 실행할 코드
      console.log("로딩 완료");
    }
  }, [isLoading]);



  const [buttonStates, setButtonStates] = useState({
    face: false,
    carNumber: false,
    knife: false,
    cigar: false,
  });

  /////////////AWS S3설정/////////////
  AWS.config.update({
    accessKeyId: process.env.REACT_APP_API_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_KEY,
    region: process.env.REACT_APP_REGION,
  });

  const s3 = new AWS.S3();

  // 컴포넌트 마운트 시 LocalForage에서 데이터 불러오기
  useEffect(() => {
    const loadLocalforageData = async () => {
      try {
        const storedMedias = await localforage.getItem("medias");
        if (storedMedias) {
          setMedias(storedMedias);
        }
    
        const storedMediaView = await localforage.getItem("mediaView");
        if (storedMediaView) {
          setMediaView(storedMediaView);
        }
    
        if (location.state?.medias && location.state.medias.length > 0) {
          const formattedMedias = location.state.medias.map((media) => {
            if (typeof media === 'string') {
              const extension = media.split('.').pop().toLowerCase();
              let type = 'image/png';
              if (extension === 'mp4') {
                type = 'video/mp4';
              }
              return {
                type: type,
                data: `https://${process.env.REACT_APP_AWS_BUCKET}.s3.${process.env.REACT_APP_REGION}.amazonaws.com/${media}`
              };
            } else {
              return media;
            }
          });
    
          // 중복 추가 방지
          const uniqueMedias = formattedMedias.filter(
            (newMedia) => !storedMedias || !storedMedias.some((storedMedia) => storedMedia.data === newMedia.data)
);
    
          setMedias((prevMedias) => [...prevMedias, ...uniqueMedias]);
    
          if (!mediaView && uniqueMedias.length > 0) {
            setMediaView(uniqueMedias[0]?.data || null);
          }
        } else {
          console.error("No images passed in state.");
        }
      } catch (err) {
        console.error("Error loading medias or mediaView from localforage:", err);
      }
    };
    loadLocalforageData();
}, [location.state]);


  // 미디어 뷰가 변경될 때 처리
  useEffect(() => {
    if (mediaView) {
      console.log("Updated mediaView:", mediaView);
      if (mediaView.startsWith("data:image") || mediaView.startsWith("https")) {
        const image = new Image();
        image.src = mediaView;
        image.onload = () => {
          imageRef.current = image;
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext("2d");
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0, image.width, image.height);
          // updatedAreas.forEach((area) => {
          //   ctx.setLineDash([5, 3]);
          //   ctx.strokeStyle = "#000";
          //   ctx.lineWidth = 1;
          //   ctx.strokeRect(area.x, area.y, area.width, area.height);
          // });
        };
      } else if (mediaView.startsWith("data:video") || mediaView.endsWith(".mp4")) {
        const videoElement = document.createElement("video");
        videoElement.src = mediaView;
        videoElement.onloadeddata = () => {
          videoElement.currentTime = 0;
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext("2d");
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;
          ctx.drawImage(videoElement, 0, 0, videoElement.videoWidth, videoElement.videoHeight);
          setMediaView(videoElement.src);
          console.log("Video URL updated:", videoElement.src);
        };
      }
    }
  }, [mediaView]);
  

  // 데이터가 변경될 때 LocalForage에 저장
  useEffect(() => {
    localforage.setItem("medias", medias).catch((err) => {
      console.error("Error saving medias to localforage:", err);
    });
    localforage.setItem("mediaView", mediaView).catch((err) => {
      console.error("Error saving mediaView to localforage:", err);
    });
  }, [medias, mediaView]);

  
  // 로그아웃 핸들러
  const handleLogout = () => {
    sessionStorage.removeItem("mb_email");
    localforage.removeItem("medias").then(() => {
      console.log("medias removed from localforage");
      setMedias([]);
    }).catch((err) => {
      console.error("Error removing medias from localforage:", err);
    });

    localforage.removeItem("mediaView").then(() => {
      console.log("mediaView removed from localforage");
      setMediaView(null);
    }).catch((err) => {
      console.error("Error removing mediaView from localforage:", err);
    });

    navigate("/");
  };

  // 로그인 상태 확인
  useEffect(() => {
    console.log("반영됐는지 확인", sessionStorage.getItem("mb_role"));
    if (!sessionStorage.getItem("mb_email")) {
      setMedias([]);
      setMediaView(null);
    }
  }, []);

  // 파일 업로드 버튼 클릭 핸들러
const handleButtonClick = () => {
  const email = sessionStorage.getItem("mb_email");
  console.log(email);

  if (email === null) {
    // 이메일이 없는 경우
    if (medias.length >= 1) {
      console.log(medias.length);
      // 업로드된 파일이 이미 하나 있는 경우 로그인 모달을 열기
      openLoginModal();
      return;
    } else {
      // 사진 또는 동영상 한 장만 업로드 허용
      fileInputRef.current.setAttribute('multiple', false);
    }
  } else {
    // 이메일이 있는 경우 여러 장 업로드 허용
    fileInputRef.current.setAttribute('multiple', true);
  }

  // 파일 입력 요소를 클릭하여 파일 선택 창을 염
  fileInputRef.current.click();
  console.log("Attempting to open file dialog");  // 파일 선택 창 열기 시도 로그
};
  

  // AI 모자이크 버튼 클릭 핸들러
  const aiHandleButtonClick = (buttonType) => {
    setButtonStates((prevState) => ({
      ...prevState,
      [buttonType]: !prevState[buttonType],
    }));
  };

  // 파일 변경 핸들러
  const handleImageChange = (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files);

    if (
      null === sessionStorage.getItem("mb_email") &&
      (files.length > 2 || files.some((file) => file.type.startsWith("video/")))
    ) {
      openLoginModal();
      return;
    }
    if (
      sessionStorage.getItem("mb_role") === "M" &&
      files.some(
        (file) => file.type.startsWith("video/") && file.size > 5 * 1024 * 1024
      )
    ) {
      openPremiumModal();
      return;
    }

    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ type: file.type, data: reader.result });
        };
        reader.onerror = (error) => {
          console.error("Error reading file:", error);
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(
      (newMedias) => {
        setMedias((prevMedias) => {
          const updatedMedias = [...prevMedias, ...newMedias].filter(
            (value, index, self) =>
              index === self.findIndex((t) => t.data === value.data)
          );
          localforage.setItem("medias", updatedMedias).catch((err) => {
            console.error("Error saving medias to localforage:", err);
          });
          return updatedMedias;
        });
        if (newMedias.length > 0) {
          setMediaView(newMedias[0].data);
          localforage.setItem("mediaView", newMedias[0].data).catch((err) => {
            console.error("Error saving mediaView to localforage:", err);
          });
        }
      },
      (error) => {
        console.error("Error loading images: ", error);
      }
    );
  };

  // 미디어 선택 핸들러
  const selectMedia = (event, media) => {
    if (media && (media.type.startsWith("image") || media.type.startsWith("video"))) {
      setMediaView(media.data);
      setUpdatedAreas([]);
    }
  };

  // 미디어 삭제 핸들러
  const handleRemoveImage = (event, index) => {
    event.stopPropagation();
    setMedias((prevMedias) => {
      const filteredMedias = prevMedias.filter((_, idx) => idx !== index);
       // 로컬 스토리지 업데이트
      localforage.setItem("medias", filteredMedias).catch((err) => {
        console.error("Error saving medias to localforage:", err);
      });
      if (index === 0 && filteredMedias.length > 0) {
        setMediaView(filteredMedias[0].data);
      } else if (filteredMedias.length === 0) {
        setMediaView(null);
      }
      return filteredMedias;
    });
  };

  // 캔버스 마우스 다운 핸들러
  function handleMouseDown(e) {
    if (!activeTool) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    setDragStart({ x: startX, y: startY });
    setDragging(true);
  }

  // 캔버스 마우스 무브 핸들러
  function handleMouseMove(e) {
    if (!dragging || !dragStart || !activeTool) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(
      imageRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.rect(dragStart.x, dragStart.y, endX - dragStart.x, endY - dragStart.y);
    ctx.stroke();
  }

  // 캔버스 마우스 업 핸들러
  function handleMouseUp(e) {
    if (!dragging || !dragStart || !activeTool) {
      setDragging(false);
      return;
    }
    setDragging(false);
    const rect = canvasRef.current.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    const newArea = {
      x: dragStart.x,
      y: dragStart.y,
      width: endX - dragStart.x,
      height: endY - dragStart.y,
      imageData: null,
    };
    const ctx = canvasRef.current.getContext("2d");
    const imageData = ctx.getImageData(
      newArea.x,
      newArea.y,
      newArea.width,
      newArea.height
    );
    newArea.imageData = imageData;

    if (activeTool === "moza") {
      const mosaicResult = applyMosaic(
        dragStart.x,
        dragStart.y,
        endX - dragStart.x,
        endY - dragStart.y,
        intensityAuto
      );
      if (mosaicResult) {
        setUpdatedAreas((prevAreas) => [...prevAreas, newArea]);
        const updatedMedias = medias.map((img) =>
          img.data === mediaView
            ? { ...img, data: mosaicResult.mosaicImage }
            : img
        );
        setMedias(updatedMedias);
        setMediaView(mosaicResult.mosaicImage);
      }
    } else if (activeTool === "except") {
      setUpdatedAreas((prevAreas) => [...prevAreas, newArea]);
      setSelectedAreas((prevAreas) => [...prevAreas, newArea]);
      console.log("Active area set:", newArea);
    }
    setDragStart(null);
  }

  // 제출 버튼 클릭 핸들러
  // 제출 버튼 클릭 핸들러
const handleSubmit = async () => {
  if (!mediaView) return;

  // 로딩 시작
  setIsLoading(true);

  // 프리미엄 회원 확인
  if (
    sessionStorage.getItem("mb_role") === "M" &&
    (medias.some(
      (media) =>
        media.type.startsWith("video/") && media.size > 5 * 1024 * 1024
    ) ||
      activeTool === "except")
  ) {
    openPremiumModal();
    setIsLoading(false);  // 로딩 중지
    return;
  }

  let mediaFile, mediaFileName, mediaFileType;

  // 이미지 처리
  if (mediaView.startsWith("data:image")) {
    const response = await fetch(mediaView, { mode: "cors" });
    const blob = await response.blob();
    mediaFile = new File([blob], "mediaView.png", { type: "image/png" });
    mediaFileName = `mediaView-${Date.now()}.png`;
    mediaFileType = "image/png";
  } 
  // 동영상 처리
  else if (
    mediaView.startsWith("data:video") ||
    mediaView.startsWith("blob:")
  ) {
    const response = await fetch(mediaView, { mode: "cors" });
    const blob = await response.blob();
    mediaFile = new File([blob], "mediaView.mp4", { type: "video/mp4" });
    mediaFileName = `mediaView-${Date.now()}.mp4`;
    mediaFileType = "video/mp4";
  }

  // S3에 업로드
  await uploadToS3(mediaFile, mediaFileName);

  const mb_email = sessionStorage.getItem("mb_email");

  // 원본 파일 정보 생성
  const originalPhoto = {
    file_name: mediaFileName,
    file_rename: mediaFileName,
    file_type: mediaFileType,
    file_size: mediaFile.size,
    created_at: new Date().toISOString(),
    mb_email: mb_email ? mb_email : null,
  };

  console.log("원본 파일 정보", originalPhoto);

  let areaFileInfoArray = [];

  // 선택 영역 처리
  if (selectedAreas.length > 0) {
    for (let i = 0; i < selectedAreas.length; i++) {
      const area = selectedAreas[i];
      const canvas = document.createElement("canvas");
      canvas.width = area.width;
      canvas.height = area.height;
      const ctx = canvas.getContext("2d");
      ctx.putImageData(area.imageData, 0, 0);

      // Blob 생성 및 S3에 업로드
      await new Promise((resolve) => {
        canvas.toBlob(async (blob) => {
          const file = new File([blob], `area-${Date.now()}.png`, {
            type: "image/png",
          });
          const fileName = `area-${Date.now()}.png`;
          await uploadToS3(file, fileName);

          const areaFileInfo = {
            file_name: fileName,
            file_rename: fileName,
            file_type: file.type,
            file_size: file.size,
            created_at: new Date().toISOString(),
            mb_email: mb_email ? mb_email : null,
          };

          console.log("사용자 선택영역 파일 정보", areaFileInfo);
          areaFileInfoArray.push(areaFileInfo);
          resolve();
        }, "image/png");
      });
    }
  } else {
    console.log("Active area is not set");
  }

  const editorData = new FormData();
  
  // 원본 파일 정보를 FormData에 추가
  for (const key in originalPhoto) {
    editorData.append(`original_${key}`, originalPhoto[key]);
  }

  // 선택 영역 파일 정보를 FormData에 추가
  areaFileInfoArray.forEach((areaFileInfo, index) => {
    for (const key in areaFileInfo) {
      editorData.append(`area_${index}_${key}`, areaFileInfo[key]);
    }
  });

  // 버튼 상태와 농도 값을 FormData에 추가
  for (const key in buttonStates) {
    editorData.append(key, buttonStates[key]);
  }
  editorData.append("intensityAuto", intensityAuto);

  // API 호출
  axios
    .post(
      `http://${process.env.REACT_APP_LOCALHOST}:8083/FileApi/uploadFileInfo`,
      editorData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      console.log(res.data);
      
      // S3 URL 생성
      const s3Url = `https://${process.env.REACT_APP_AWS_BUCKET}.s3.${process.env.REACT_APP_REGION}.amazonaws.com/${res.data.file_name}`;
      
      // mediaView와 medias 업데이트
      setMediaView(s3Url);
      setMedias((prevMedias) => {
        const updatedMedias = prevMedias.map((media) => {
          if (media.data === mediaView) {
            return { ...media, data: s3Url, type: mediaFileType };
          }
          return media;
        });
        // LocalForage에 데이터 저장
        localforage.setItem("medias", updatedMedias).catch((err) => {
          console.error("Error saving medias to localforage:", err);
        });
        localforage.setItem("mediaView", s3Url).catch((err) => {
          console.error("Error saving mediaView to localforage:", err);
        });
        return updatedMedias;
      });
      console.log("S3 URL:", s3Url);
      // 추가: 동영상인 경우 URL이 변경되도록 처리
    if (mediaFileType === "video/mp4") {
      fetch(s3Url, { mode: "cors" })
        .then((response) => response.blob())
        .then((blob) => {
          const videoURL = URL.createObjectURL(blob);
          setMediaView(videoURL);
          console.log("Video URL updated:", videoURL);
        })
        .catch((error) => console.error("Error fetching video:", error));
    }

  })
  .catch((err) => {
    console.error("API 요청 실패:", err);
  })
  .finally(() => {
    setIsLoading(false); // 로딩 종료
  });
};

  

  // 모자이크 처리 함수
  function applyMosaic(x, y, width, height, intensity) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (imageRef.current) {
      ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
      const pixelSize = Math.max(1, Math.ceil((intensity / 100) * 30));
      for (let i = 0; i < width; i += pixelSize) {
        for (let j = 0; j < height; j += pixelSize) {
          averageColor(ctx, x + i, y + j, pixelSize);
        }
      }
      const dataUrl = canvas.toDataURL("image/png");
      return {
        mosaicImage: dataUrl,
        pixelSize: pixelSize,
      };
    } else {
      console.error("imgRef.current is not set");
      return null;
    }
  }

  // 평균 색상 계산 함수
  function averageColor(ctx, x, y, size) {
    const imageData = ctx.getImageData(x, y, size, size);
    let r = 0,
      g = 0,
      b = 0,
      a = 0,
      count = 0;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const index = (i * size + j) * 4;
        r += imageData.data[index];
        g += imageData.data[index + 1];
        b += imageData.data[index + 2];
        a += imageData.data[index + 3];
        count++;
      }
    }
    r /= count;
    g /= count;
    b /= count;
    a /= count;
    const averageColor = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(
      b
    )}, ${(a / 255).toFixed(2)})`;
    ctx.fillStyle = averageColor;
    ctx.fillRect(x, y, size, size);
  }

  // 농도 변경 핸들러
  const handleIntensityChange = (e) => {
    const newIntensity = parseInt(e.target.value);
    console.log("Slider Changed to", newIntensity);
    setIntensity(newIntensity);
    if (selectedAreas && selectedAreas.width > 0 && selectedAreas.height > 0) {
      applyMosaic(
        selectedAreas.x,
        selectedAreas.y,
        selectedAreas.width,
        selectedAreas.height,
        intensity
      );
    }
  };

  // 캔버스 클릭 핸들러
  function handleCanvasClick(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedArea = selectedAreas.find(
      (area) =>
        x >= area.x &&
        x <= area.x + area.width &&
        y >= area.y &&
        y <= area.y + area.height
    );

    setActiveArea(clickedArea);

    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(
      imageRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    selectedAreas.forEach((area) => {
      if (area === clickedArea) {
        ctx.setLineDash([]);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 4;
      } else {
        ctx.setLineDash([5, 3]);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
      }
      ctx.strokeRect(area.x, area.y, area.width, area.height);
    });
  }

  // 저장 버튼 클릭 핸들러
  const handleSave = async () => {
    if (!mediaView) {
      console.error("mediaView is not defined");
      return;
    }
  
    let mediaFile, mediaFileName, mediaFileType;
  
    try {
      console.log("mediaView:", mediaView);
  
      if (
        mediaView.startsWith("data:image") ||
        mediaView.endsWith(".png") ||
        mediaView.endsWith(".jpg") ||
        mediaView.endsWith(".jpeg")
      ) {
        console.log("Processing image data...");
  
        const response = await fetch(mediaView);
        if (!response.ok) {
          throw new Error("Failed to fetch image data");
        }
        const blob = await response.blob();
        console.log("Blob created from mediaView URL:", blob);
  
        if (!blob) {
          throw new Error("Failed to create Blob from mediaView URL");
        }
  
        mediaFile = new File([blob], "final-mediaView.png", {
          type: "image/png",
        });
        mediaFileName = `final-mediaView-${Date.now()}.png`;
        mediaFileType = "image/png";
  
        console.log("Image file created:", mediaFile);
  
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = mediaFileName;
        link.click();
      } else if (
        mediaView.startsWith("data:video") ||
        mediaView.startsWith("blob:") ||
        mediaView.endsWith(".mp4")
      ) {
        console.log("Processing video data...");
  
        const response = await fetch(mediaView);
        if (!response.ok) {
          throw new Error("Failed to fetch video data");
        }
        const blob = await response.blob();
        console.log("Blob created from mediaView URL:", blob);
  
        if (!blob) {
          throw new Error("Failed to create Blob from mediaView URL");
        }
  
        mediaFile = new File([blob], "final-mediaView.mp4", {
          type: "video/mp4",
        });
        mediaFileName = `final-mediaView-${Date.now()}.mp4`;
        mediaFileType = "video/mp4";
  
        console.log("Video file created:", mediaFile);
  
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = mediaFileName;
        link.click();
      } else {
        console.error("Unsupported media type:", mediaView);
      }
  
      if (!mediaFile) {
        console.error("Media file is not defined after processing");
        return;
      }
  
      const s3Url = await uploadToS3(mediaFile, mediaFileName);
      console.log("S3 URL:", s3Url);
  
      const mb_email = sessionStorage.getItem("mb_email");
  
      const originalPhoto = {
        file_name: mediaFileName,
        file_rename: mediaFileName,
        file_type: mediaFileType,
        file_size: mediaFile.size,
        created_at: new Date().toISOString(),
        mb_email: mb_email ? mb_email : null,
      };
  
      console.log("원본 파일 정보", originalPhoto);
  
      const editorData = new FormData();
      for (const key in originalPhoto) {
        editorData.append(`${key}`, originalPhoto[key]);
      }
  
      console.log("FormData to send:", Object.fromEntries(editorData.entries()));
  
      axios
        .post(
          `http://${process.env.REACT_APP_LOCALHOST}:8083/FileApi/mosaicUploadFileInfo`,
          originalPhoto, // FormData 대신 JSON 데이터 전송
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          setMediaView(s3Url);
          setMedias((prevMedias) => {
            return prevMedias.map((media) => {
              if (media.data === mediaView) {
                return { ...media, data: s3Url, type: mediaFileType };
              }
              return media;
            });
          });
          console.log("File saved locally and uploaded to S3:", s3Url);

          // LocalForage에 데이터 저장
          localforage.setItem("medias", medias).catch((err) => {
            console.error("Error saving medias to localforage:", err);
          });
          localforage.setItem("mediaView", s3Url).catch((err) => {
            console.error("Error saving mediaView to localforage:", err);
          });
          
          closeModal();
        })
        .catch((err) => {
          console.error("API 요청 실패:", err);
        });
    } catch (error) {
      console.error("Error in handleSave:", error);
    }
  };

  
  // S3 업로드 함수
  const uploadToS3 = async (file, key) => {
    const params = {
      Bucket: process.env.REACT_APP_AWS_BUCKET,
      Key: key,
      Body: file,
      ContentType: file.type,
    };
  
    try {
      const data = await s3.upload(params).promise();
      console.log("Upload Success", data.Location);
      return data.Location;
    } catch (err) {
      console.log("Upload Error", err);
      throw err;
    }
  };
  
  

  // 미디어 삭제 핸들러
  const handleDelete = async () => {
  if (!mediaView) return;

  setMedias((prevMedias) => {
    const filteredMedias = prevMedias.filter(
      (media) => media.data !== mediaView
    );

    // 로컬 스토리지 업데이트
    localforage.setItem("medias", filteredMedias).catch((err) => {
      console.error("Error saving medias to localforage:", err);
    });

    if (filteredMedias.length > 0) {
      setMediaView(filteredMedias[0].data);
      localforage.setItem("mediaView", filteredMedias[0].data).catch((err) => {
        console.error("Error saving mediaView to localforage:", err);
      });
    } else {
      setMediaView(null);
      localforage.removeItem("mediaView").catch((err) => {
        console.error("Error removing mediaView from localforage:", err);
      });
    }

    return filteredMedias;
  });

  closeDeleteModal();
};


  useEffect(() => {
    if (!sessionStorage.getItem("mb_email")) {
      setMedias([]);
    }
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0); // 페이지가 로드될 때 스크롤을 상단으로 이동
  }, []); // 빈 배열을 의존성으로 전달하여 컴포넌트가 마운트될 때만 실행되도록 함


  return (
    <div className="editor-specific">
      <MainBar onLogout={handleLogout} />
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleImageChange}
        multiple
        accept="image/*, video/*"
      />

      <section className="sec">
        <div className="buttons">
          <p className="auto">Auto Mosaic</p>
          <div className="li">
            <div className="types">
              <p>타입</p>
              <button
                className="type"
                onClick={() => aiHandleButtonClick("face")}
              >
                <FontAwesomeIcon
                  style={{ color: buttonStates.face ? "green" : "inherit" }}
                  icon={faFaceSmile}
                />
              </button>
              <button
                className="type"
                onClick={() => aiHandleButtonClick("carNumber")}
              >
                <FontAwesomeIcon
                  style={{
                    color: buttonStates.carNumber ? "green" : "inherit",
                  }}
                  icon={faCar}
                />
              </button>
              <button
                className="type"
                onClick={() => aiHandleButtonClick("knife")}
              >
                <FontAwesomeIcon
                  style={{ color: buttonStates.knife ? "green" : "inherit" }}
                  icon={faPhone}
                />
              </button>
              <button
                className="type"
                onClick={() => aiHandleButtonClick("cigar")}
              >
                <FontAwesomeIcon
                  style={{ color: buttonStates.cigar ? "green" : "inherit" }}
                  icon={faSmoking}
                />
              </button>
            </div>
            <div className="types">
              <p>농도</p>
              <input
                type="range"
                min="0"
                max="100"
                value={intensityAuto}
                onChange={(e) => setIntensityAuto(e.target.value)}
                className="slider"
              />
              <p>{intensityAuto}%</p>
            </div>
            <div className="types1">
              <p>모양</p>
              <button className="typeshape">
                <FontAwesomeIcon icon={faSquare} />
              </button>
              <button className="typeshape">
                <FontAwesomeIcon icon={faCircle} />
              </button>
            </div>
            <div className="types2">
              <p>모자이크 해제 대상</p>
              <button
                className="typeclear except"
                onClick={() => setActiveTool("except")}
              >
                <FontAwesomeIcon icon={faVectorSquare} />
              </button>
            </div>
            <div>
              <button className="typeSubmit" onClick={handleSubmit}>
                적용하기
              </button>
            </div>
          </div>
          <p className="auto">User Mosaic</p>
          <div className="li2">
            <div className="types2">
              <p>모자이크 대상 선택</p>
              <button
                className="typeclear moza"
                onClick={() => setActiveTool("moza")}
              >
                <FontAwesomeIcon icon={faVectorSquare} />
              </button>
            </div>
            <div className="types">
              <p>농도</p>
              <input
                type="range"
                min="0"
                max="100"
                value={intensity}
                onChange={handleIntensityChange}
                className="slider"
              />
              <p>{intensity}%</p>
            </div>
            <div className="types1">
              <p>모양</p>
              <button className="typeshape">
                <FontAwesomeIcon icon={faSquare} />
              </button>
              <button className="typeshape">
                <FontAwesomeIcon icon={faCircle} />
              </button>
            </div>
          </div>
          <div className="submits">
            <button onClick={handleButtonClick} className="submit active">
              사진/영상 업로드
            </button>
            <button className="submit" onClick={openModal}>
              저장
            </button>
            <button className="submit" onClick={openDeleteModal}>
              삭제
            </button>
          </div>
        </div>
        <div className="edit">
          {mediaView ? (
            <>
              {mediaView.startsWith("data:video") ||
              mediaView.startsWith("blob:") ||
              mediaView.endsWith(".mp4") ? (
                <video controls className="videoEdit">
                  <source src={mediaView} type="video/mp4" />
                </video>
              ) : (
                <canvas
                  ref={canvasRef}
                  className="imgEdit"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onClick={handleCanvasClick}
                />
              )}
            </>
          ) : (
            <p>이미지를 선택하세요</p>
          )}
        </div>
        <div className="imgSaves">
          {medias.map((media, index) => (
            <div
              key={index}
              className="imgsave"
              onClick={(event) => selectMedia(event, media)}
            >
              {media.type.startsWith("video/") ? (
                <video className="thumb" src={media.data} />
              ) : (
                <img src={media.data} alt={`미디어 ${index + 1}`} />
              )}
              <div
                className="delete-icon"
                onClick={(event) => handleRemoveImage(event, index)}
              >
                X
              </div>
            </div>
          ))}
        </div>
      </section>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Save Confirmation"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="modal-content">
          <h2>저장 확인</h2>
          <p>정말 저장하시겠습니까?</p>
          {mediaView && (
            <div className="media-preview">
              {mediaView.startsWith("data:video") ||
              mediaView.startsWith("blob:") ||
              mediaView.endsWith(".mp4") ? (
                <video controls className="video-preview">
                  <source src={mediaView} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={mediaView}
                  alt="mediaView"
                  className="image-preview"
                />
              )}
            </div>
          )}
          <div className="modal-buttons">
            <button className="btn confirm" onClick={handleSave}>
              확인
            </button>
            <button className="btn cancel" onClick={closeModal}>
              취소
            </button>
          </div>
        </div>
      </ReactModal>

      <ReactModal
        isOpen={deleteModalIsOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Confirmation"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="modal-content">
          <h2>삭제 확인</h2>
          <p>정말 삭제하시겠습니까?</p>
          {mediaView && (
            <div className="media-preview">
              {mediaView.startsWith("data:video") ||
              mediaView.startsWith("blob:") ? (
                <video controls className="video-preview">
                  <source src={mediaView} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={mediaView}
                  alt="mediaView"
                  className="image-preview"
                />
              )}
            </div>
          )}
          <div className="modal-buttons">
            <button className="btn confirm" onClick={handleDelete}>
              확인
            </button>
            <button className="btn cancel" onClick={closeDeleteModal}>
              취소
            </button>
          </div>
        </div>
      </ReactModal>

      <ReactModal
        isOpen={deleteModalIsOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Confirmation"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="modal-content">
          <h2>삭제 확인</h2>
          <p>정말 삭제하시겠습니까?</p>
          {mediaView && (
            <div className="media-preview">
              {mediaView.startsWith("data:video") ||
              mediaView.startsWith("blob:") ||
              mediaView.endsWith(".mp4") ? (
                <video controls className="video-preview">
                  <source src={mediaView} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={mediaView}
                  alt="mediaView"
                  className="image-preview"
                />
              )}
            </div>
          )}
          <div className="modal-buttons">
            <button className="btn confirm" onClick={handleDelete}>
              확인
            </button>
            <button className="btn cancel" onClick={closeDeleteModal}>
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
      <ReactModal
        isOpen={loginModalIsOpen}
        onRequestClose={closeLoginModal}
        contentLabel="Login Required"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="modal-content">
          <h2>로그인 하시겠습니까?</h2>
          <p>사진 세 장 이상 또는 동영상을 업로드하려면 로그인이 필요합니다.</p>
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
        isOpen={isLoading}
        contentLabel="Loading"
        className="LoadingModal"
        overlayClassName="Overlay"
      >
        <div className="modal-content">
          <h2>로딩 중...</h2>
          <div className="spinner"></div>
        </div>
      </ReactModal>

    </div>
  );
};

export default Editor;
