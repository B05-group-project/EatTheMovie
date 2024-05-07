const carousel = document.querySelector(".carousel"),
  firstImg = carousel.querySelectorAll("img")[0],
  arrowIcons = document.querySelectorAll(".wrapper i");

let isDragStart = false,
  isDragging = false,
  prevPageX,
  prevScrollLeft,
  positionDiff;

const showHideIcons = () => {
  // 캐러셀 스크롤 왼쪽 값에 따른 이전/다음 아이콘 표시 및 숨기기
  let scrollWidth = carousel.scrollWidth - carousel.clientWidth; // getting max scrollable width
  arrowIcons[0].style.display = carousel.scrollLeft == 0 ? "none" : "block";
  arrowIcons[1].style.display =
    carousel.scrollLeft == scrollWidth ? "none" : "block";
};

arrowIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    let firstImgWidth = firstImg.clientWidth + 14; // 첫 번때 이미지 너비를 가져오고 14의 여백값을 추가

    // 클릭한 아이콘이 왼쪽에 있는 경우, 캐러셀 스크롤 왼쪽에서 너비값을 줄이고 ㅣ그렇지 않으면 추가
    carousel.scrollLeft += icon.id == "left" ? -firstImgWidth : firstImgWidth;
    setTimeout(() => showHideIcons(), 60); // calling showHideIcons after 60ms
  });
});

// 스크롤할 이미지가 남아 있지 않으면 여기에서 돌아온다
const autoSlide = () => {
  if ( carousel.scrollLeft - (carousel.scrollWidth - carousel.clientWidth) > -1 || carousel.scrollLeft <= 0)
    return;

  positionDiff = Math.abs(positionDiff); // positionDiff을 양수로 만들어준다
  let firstImgWidth = firstImg.clientWidth + 14;
  // 중간 이미지 중심을 가져오기 위해 캐러셀 왼쪽에서 더하거나 줄여야 하는 차이 값을 얻는다
  let valDifference = firstImgWidth - positionDiff;

  if (carousel.scrollLeft > prevScrollLeft) {
    // 사용자가 오른쪽으로 스크롤하는 경우
    return (carousel.scrollLeft += positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff);
  }
  // 사용자가 왼쪽으로 스크롤하는 경우
  carousel.scrollLeft -= positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
};

// 마우스 다운 이벤트 시 전역 변수 값 업데이트
const dragStart = (e) => {
  isDragStart = true;
  prevPageX = e.pageX || e.touches[0].pageX;
  prevScrollLeft = carousel.scrollLeft;
};

// 마우스 포인터에 따라 이미지/캐러셀을 왼쪽으로 스크롤
const dragging = (e) => {
  if (!isDragStart) return;
  e.preventDefault();
  isDragging = true;
  carousel.classList.add("dragging");
  positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
  carousel.scrollLeft = prevScrollLeft - positionDiff;
  showHideIcons();
};

const dragStop = () => {
  isDragStart = false;
  carousel.classList.remove("dragging");

  if (!isDragging) return;
  isDragging = false;
  autoSlide();
};

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("touchstart", dragStart);

document.addEventListener("mousemove", dragging);
carousel.addEventListener("touchmove", dragging);

document.addEventListener("mouseup", dragStop);
carousel.addEventListener("touchend", dragStop);


// 모달창
// 'use strict';
const images = document.querySelectorAll(".image");
const closeBtn = document.querySelector(".button-close");
const modal = document.querySelector(".modal-bg");
const embed = document.getElementById("modal-video");
const iframe = document.querySelector(".video");

//각각의 이미지에 모달창 불러오기
for(let i = 0; i < images.length; i++) {
  images[i].addEventListener("click", showModal)
}

// openBtn.addEventListener("click", showModal);
closeBtn.addEventListener("click", closeModal);

//영상 호출
const modalVideo = document.getElementById("img")
for(let i = 0; i < modalVideo.length; i++) {
  modalVideo[i].addEventListener("load", modalVideo)
}

// 모달창 열기
function showModal(e) {
  //iframe의 src를 불러와 key값을 적용해 해당 값의 영상링크를 불러온다.
  iframe.src = `https://www.youtube.com/embed/${e.target.dataset.key}`
    modal.classList.remove("hidden");
    modal.classList.add("visible");
    console.log(e.target.dataset.key)
}

// 모달창 닫기
function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("visible");
}














