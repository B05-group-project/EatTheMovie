// 파라미터(id) 가져오기
const urlParams = new URL(location.href).searchParams;
const id = urlParams.get("id");

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZmM4ZTEyN2RiM2FkNjkxYzFmMzhlNmVjMzA4ZDMxMCIsInN1YiI6IjY2Mjc1MTdiN2E5N2FiMDE2MzhkZmNjNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IsdwlMkyp80ZqFcaKlPyhi-w1wlAo0Ppb03ye2tMJRA",
  },
};

fetch(`https://api.themoviedb.org/3/movie/${id}?language=ko-KR`, options)
  .then((response) => response.json())
  .then((response) => {
    const $container = document.createElement("div");
    $container.classList.add("all-container");

    // 장르
    const genre = response.genres
      .map((genre) => {
        return genre["name"];
      })
      .join(", ");

    $container.innerHTML = `
        <div class="poster-container">
            <img src="https://image.tmdb.org/t/p/w500/${response.poster_path}" alt="Movie Poster" class="movie-poster">
        </div>
        <div class="details-container">
            <h1>${response.title}</h1>
            <p>${response.overview}</p>
            <br>
            <p>평점 : ${response.vote_average}/10</p>
            <p>장르 : ${genre}</p>
            <p>런타임 : ${response.runtime}분</p>
            <p>개봉일 : ${response.release_date}</p>
        </div>`;
    document.querySelector(".detail-space").append($container);
  })
  .catch((err) => console.error(err));
