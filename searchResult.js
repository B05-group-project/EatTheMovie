//import apiKey from './key.js'; // API 키를 가져옵니다. (노력했는데 실패했어요..)
const apiKey = "657ffd22014acc1e3761178b24efa6fe";

let page = 1;
const word = new URL(location.href).searchParams.get("word");

// 초기 영화 목록 표시
fetchMovies();

//검색어를 처리하고 영화를 검색하거나 가져옴
function handleSearch() {
  const searchTerm = document.getElementById("search-input").value; // 검색어 가져오기
  if (searchTerm) {
    searchMovies(searchTerm);
  } else {
    fetchMovies();
  }
}

document.getElementById("search-input").value = word;

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
  cancleBtn.style.visibility = 'visible';
});

cancleBtn.addEventListener("click", () => {
  searchBar.classList.remove("expand");
  magnifier.classList.remove("expand");
  cancleBtn.style.visibility = "hidden";
})


// 영화 카드 클릭 시 id 나오기
document.addEventListener("click", function (event) {
  const movieCard = event.target.closest(".movie");
  if (movieCard) {
    const movieId = movieCard.dataset.movieId;
    if (movieId) {
      alert(`클릭한 영화의 ID는 ${movieId} 입니다.`);
    }
  }
});

// 영화 가져와서 화면에 표시하는 함수
function fetchMovies() {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=ko-KR&query=${word}&page=${page}`;
  displayMovies(url);
}

// 영화 검색해서 화면에 표시하는 함수
function searchMovies(searchTerm) {
  window.location.href = `searchResult.html?word=${searchTerm}`;
}

// 영화를 가져와서 화면에 표시하는 공통 함수
async function displayMovies(url) {
  document.getElementById("movie-container").innerHTML = ""; // 이전에 표시된 영화 목록 제거
  const data = await fetchGetData(url);
  const movies = data.results;
  movies.forEach((movie) => {
    const { id, poster_path, title, overview, vote_average } = movie;
    const moviePosterPath = `https://image.tmdb.org/t/p/w500${poster_path}`;
    const movieCard = `
            <div class="movie" data-movie-id="${id}">
              <img src="${moviePosterPath}">
              <h2>${title}</h2>
              <p>${overview}</p>
              <p>평점: ${vote_average}</p>
            </div>
          `;
    document.getElementById("movie-container").innerHTML += movieCard;
  });
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
