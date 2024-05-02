// 파라미터(id) 가져오기
const urlParams = new URL(location.href).searchParams;
const id = urlParams.get('id');

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZmM4ZTEyN2RiM2FkNjkxYzFmMzhlNmVjMzA4ZDMxMCIsInN1YiI6IjY2Mjc1MTdiN2E5N2FiMDE2MzhkZmNjNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IsdwlMkyp80ZqFcaKlPyhi-w1wlAo0Ppb03ye2tMJRA'
    }
};

fetch(`https://api.themoviedb.org/3/movie/${id}?language=ko-KR`, options)
    .then(response => response.json())
    .then(response => {
        console.log(response);
        const $container = document.createElement('div');
        $container.classList.add('container');
        
        // 장르
        const genre = response.genres.map((genre)=>{
            return genre['name'];
        }).join(", ");

        console.log(genre);
        $container.innerHTML = `
        <div class="poster-container">
            <img src="https://image.tmdb.org/t/p/w500/${response.poster_path}" alt="Movie Poster" class="movie-poster">
        </div>
        <div class="details-container">
            <h1>${response.title}</h1>
            <p>${response.overview}</p>
            <h2>평점</h2>
            <p>${response.vote_average}/10</p>
            <h2>장르</h2>
            <p>${genre}</p>
            <h2>개봉일</h2>
            <p>${response.release_date}</p>
        </div>`;
        document.querySelector('body').append($container);
    })
    .catch(err => console.error(err));

function goBack() {
    console.log("test");
    window.history.back();
}

//     <div class="container">
//     <div class="poster-container">
//         <img src="movie_poster.jpg" alt="Movie Poster" class="movie-poster">
//     </div>
//     <div class="details-container">
//         <h1>영화 제목</h1>
//         <h2>줄거리</h2>
//         <p>영화 줄거리를 여기에 입력하세요.</p>
//         <h2>출연</h2>
//         <ul>
//             <li>배우 1</li>
//             <li>배우 2</li>
//             <li>배우 3</li>
//         </ul>
//         <h2>감독</h2>
//         <p>감독 이름</p>
//         <h2>평점</h2>
//         <p>평균 평점: X.X/10</p>
//         <h2>장르</h2>
//         <p>장르 1, 장르 2, 장르 3</p>
//         <h2>개봉일</h2>
//         <p>YYYY년 MM월 DD일</p>
//     </div>
// </div>

