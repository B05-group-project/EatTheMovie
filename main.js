const carousel = document.querySelector(".carousel"),
  firstImg = carousel.querySelectorAll("img")[0],
  arrowIcons = document.querySelectorAll(".wrapper i");

const word = new URL(location.href).searchParams.get("word");  
const language = localStorage.getItem("language");

const $headerTitle = document.getElementById("header-title");
const $magnifier = document.querySelector(".magnifier");
const $searchBar = document.querySelector("#search-input");
const $searchBtn = document.getElementById("search-button");
const $cancleBtn = document.querySelector("#cancle-button");

let isDragStart = false,
  isDragging = false,
  prevPageX,
  prevScrollLeft,
  positionDiff;

function addHeaderFunction() {
  setHeaderTitleClick();
  setSearchInputValue();
  setSearchBtnFunction();
  setSearchBarAnimation();
}

function setHeaderTitleClick() {
  $headerTitle.addEventListener("click", () => {
    window.location.href = `index.html`;
  });
}

function setSearchInputValue() {
  $searchBar.value = word;
}

function setSearchBtnFunction() {
  //클릭으로 검색
  $searchBtn.addEventListener("click", () => {
    handleSearch();
  });

  //엔터 키로 검색
  $searchBar.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      $searchBtn.click();
      e.preventDefault();
    }
  });
}

function handleSearch() {
  const searchTerm = $searchBar.value;
  if (searchTerm) {
    window.location.href = `searchResult.html?word=${searchTerm}`;
  } else {
    alert("검색어를 입력해주세요!");
  }
}

function setSearchBarAnimation() {
  $magnifier.addEventListener("mouseover", () => {
    $searchBar.classList.add("expand");
    $magnifier.classList.add("expand");
    $cancleBtn.style.visibility = "visible";
  });

  $cancleBtn.addEventListener("click", () => {
    $searchBar.classList.remove("expand");
    $magnifier.classList.remove("expand");
    $cancleBtn.style.visibility = "hidden";
  });
}

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
  if (
    carousel.scrollLeft - (carousel.scrollWidth - carousel.clientWidth) > -1 ||
    carousel.scrollLeft <= 0
  )
    return;

  positionDiff = Math.abs(positionDiff); // positionDiff을 양수로 만들어준다
  let firstImgWidth = firstImg.clientWidth + 14;
  // 중간 이미지 중심을 가져오기 위해 캐러셀 왼쪽에서 더하거나 줄여야 하는 차이 값을 얻는다
  let valDifference = firstImgWidth - positionDiff;

  if (carousel.scrollLeft > prevScrollLeft) {
    // 사용자가 오른쪽으로 스크롤하는 경우
    return (carousel.scrollLeft +=
      positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff);
  }
  // 사용자가 왼쪽으로 스크롤하는 경우
  carousel.scrollLeft -=
    positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
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
for (let i = 0; i < images.length; i++) {
  images[i].addEventListener("click", showModal);
}

// openBtn.addEventListener("click", showModal);
closeBtn.addEventListener("click", closeModal);

//영상 호출
const modalVideo = document.getElementById("img");
for (let i = 0; i < modalVideo.length; i++) {
  modalVideo[i].addEventListener("load", modalVideo);
}

// 모달창 열기
function showModal(e) {
  //iframe의 src를 불러와 key값을 적용해 해당 값의 영상링크를 불러온다.
  iframe.src = `https://www.youtube.com/embed/${e.target.dataset.key}`;
  modal.classList.remove("hidden");
  modal.classList.add("visible");
  console.log(e.target.dataset.key);
}

// 모달창 닫기
function closeModal() {
  modal.classList.add("hidden");
  modal.classList.remove("visible");
}

addHeaderFunction();



let apiKey = '657ffd22014acc1e3761178b24efa6fe';
let page = {
    'top-rated': 1,
    'now-playing': 1,
    popular: 1,
};
let total_pages = {
    'top-rated': 2,
    'now-playing': 2,
    popular: 2,
};

// TopRated
scrollLeft('top-rated-container', 'top-rated-left', 'top-rated-right', 'top-rated');

// NowPlaying
scrollLeft('now-playing-container', 'now-playing-left', 'now-playing-right', 'now-playing');

// Popular
scrollLeft('popular-container', 'popular-left', 'popular-right');

function scrollLeft(containerId, leftButtonId, rightButtonId) {
    const container = document.getElementById(containerId);
    const unit = 700; // 한 번에 이동할 거리
    //왼쪽에있는 버튼
    document.getElementById(leftButtonId).addEventListener('click', function () {
        // 스크롤이 맨 앞에 도달하면 뒤로 이동
        if (container.scrollLeft === 0) {
            container.scrollLeft = container.scrollWidth - container.clientWidth - 1;
        } else {
            container.scrollLeft -= unit;
        }
    });
    //오른쪽에있는버튼
    document.getElementById(rightButtonId).addEventListener('click', function () {
        container.scrollLeft += unit;
    });

    container.addEventListener('scroll', function () {
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
            // 첫 번째 카드의 위치로 스크롤을 이동합니다.
            container.scrollLeft = 0;
        }
    });
}

// 영화 가져와서 화면에 표시하는 함수
function TopRated() {
    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=ko-KR&page=${page['top-rated']}`;
    displayMovies(url, 'top-rated-container', 'top-rated');
}
function NowPlaying() {
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ko-KR&page=${page['now-playing']}`;
    displayMovies(url, 'now-playing-container', 'now-playing');
}
function Popular() {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${page['popular']}`;
    displayMovies(url, 'popular-container', 'popular');
}

// 초기 영화 목록 표시
TopRated();
NowPlaying();
Popular();

function displayMovies(url, containerId, category) {
    const container = document.getElementById(containerId); // 해당하는 섹션의 컨테이너를 가져옵니다.
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const movies = data.results;
            movies.forEach((movie) => {
                const { id, poster_path } = movie;
                const movieId = id;
                const moviePosterPath = `https://image.tmdb.org/t/p/w500${poster_path}`;
                const movieCard = `
                <div class="slider-card" data-movie-id=${movieId}>
                        <img src="${moviePosterPath}">
                    </div>
                `;
                container.innerHTML += movieCard; // 해당하는 섹션의 컨테이너에 영화 카드를 추가합니다.
            });

            container.querySelectorAll('.slider-card').forEach((card) => {
                card.addEventListener('click', function () {
                    const movieId = this.dataset.movieId;
                    window.location.href = `detail.html?id=${movieId}`;
                });
            });

            page[category]++; // 페이지 증가
            if (page[category] <= total_pages[category]) {
                // 페이지가 총 페이지 수를 넘지 않으면 다음 페이지 불러오기
                switch (category) {
                    case 'top-rated':
                        TopRated();
                        break;
                    case 'now-playing':
                        NowPlaying();
                        break;
                    case 'popular':
                        Popular();
                        break;
                    default:
                        break;
                }
            }
        })
        .catch((error) => console.error('Error fetching movies:', error));
}
