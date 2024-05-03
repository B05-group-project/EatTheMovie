//import apiKey from './key.js'; // API 키를 가져옵니다. (노력했는데 실패했어요..)
const apiKey = "657ffd22014acc1e3761178b24efa6fe";

let page = 1;
const word = new URL(location.href).searchParams.get("word");

//검색어를 처리하고 영화를 검색하거나 가져옴
function handleSearch() {
  const searchTerm = document.getElementById("search-input").value; // 검색어 가져오기
  if (searchTerm) {
    searchMovies(searchTerm);
  } else {
    alert("검색어를 입력해주세요!");
  }
}

document.getElementById("search-input").value = word;

// 헤더 EatTheMovie 클릭 시 메인 페이지로 이동
document.getElementById("header-title").addEventListener("click", function () {
  window.location.href = `index.html`;
});

// 검색 버튼 클릭 시 검색어 가져와서 영화 검색
document.getElementById("search-button").addEventListener("click", function () {
  handleSearch();
});

// 엔터 키로 검색 가능하게 하기
document
  .getElementById("search-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      document.getElementById("search-button").click();
      e.preventDefault(); // 폼 제출 방지
    }
  });

// 검색창 애니메이션
const magnifier = document.querySelector(".magnifier");
const searchBar = document.querySelector("#search-input");
const cancleBtn = document.querySelector("#cancle-button");

magnifier.addEventListener("mouseover", () => {
  searchBar.classList.add("expand");
  magnifier.classList.add("expand");
  cancleBtn.style.visibility = "visible";
});

cancleBtn.addEventListener("click", () => {
  searchBar.classList.remove("expand");
  magnifier.classList.remove("expand");
  cancleBtn.style.visibility = "hidden";
});

// 검색어를 화면에 표시
document.getElementById("search-word-wrapper").innerHTML = `
  <div id="search-word">"${word}"</div>의 검색 결과
`;

// 영화 카드 클릭 시 id 나오기
document.addEventListener("click", function (event) {
  const movieCard = event.target.closest(".movie");
  if (movieCard) {
    const movieId = movieCard.dataset.movieId;
    if (movieId) {
      window.location.href = `detail.html?id=${movieId}`;
    }
  }
});

// 영화 검색해서 화면에 표시하는 함수
function searchMovies(searchTerm) {
  window.location.href = `searchResult.html?word=${searchTerm}`;
}

async function fetchGetData(url) {
  let APIData = await fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      alert("해당하는 데이터가 없습니다!");
      throw new Error("에러 발생");
    })
    .catch((error) => {
      throw new Error(error);
    });
  return APIData;
}

const listEnd = document.getElementById("movie-end");
const movieContainer = document.getElementById("movie-container");

const options = {
  root: null, // 뷰포트를 기준으로 타켓의 가시성 검사
  rootMargin: "0px 0px 0px 0px", // 확장 또는 축소 X
  threshold: 0, // 타켓의 가시성 0%일 때 옵저버 실행
};

const onIntersect = (entries, observer) => {
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=ko-KR&query=${word}&page=${page}`;
  entries.forEach(async (entry) => {
    if (entry.isIntersecting) {
      page++;
      console.log("page: " + page);
      const data = await fetchGetData(url);
      const movies = data.results;
      if (movies.length < 1) {
        if (page === 1)
          document.getElementById("movie-container").innerHTML = "";
        observer.unobserve(listEnd); // 특정 대상(요소)에 대한 관찰 중단
        return;
      }

      movieContainer.insertAdjacentHTML(
        "beforeend",
        movies
          .map((movie) => {
            const { id, poster_path, title } = movie;
            const moviePosterPath = `https://image.tmdb.org/t/p/w500${poster_path}`;
            return `
            <div class="movie" data-movie-id="${id}">
              <img src="${
                poster_path ? moviePosterPath : "icons/replaceMovie.png"
              }" onerror="this.onerror=null; this.src='icons/replaceMovie.png';">
              ${poster_path ? `` : `<div id="movie-title">${title}</div>`}
            </div>
          `;
          })
          .join("")
      );

      ScrollOut({
        targets: ".movie",
        once: true,
      });
    }
  });
};

const observer = new IntersectionObserver(onIntersect, options);
observer.observe(listEnd);
