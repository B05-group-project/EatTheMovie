// 요소가 없거나 애니메이션이 진행 중인 경우 슬라이드를 실행하지 않습니다.
var isAnimating = false;

function scrollLeftAnimate(elem, unit) {
    if (!elem || isAnimating) {
        return;
    }

    var time = 300; // 애니메이션 지속 시간 (밀리초), 작을수록 빨라집니다.
    var from = elem.scrollLeft; // 프레임 위치를 유지하기 위해
    var aframe = 1; // 프레임 간격, 부드러운 애니메이션의 경우 1로 설정 ~ 낮은 FPS의 경우 10++ (CPU 사용량 감소)
    isAnimating = true; // 애니메이션 중일 때 중복 트리거 애니메이션을 방지합니다.

    var start = new Date().getTime(), // 애니메이션 시작 시간을 기록합니다.
        timer = setInterval(function () {
            var step = Math.min(1, (new Date().getTime() - start) / time); // 현재 애니메이션 진행률을 계산합니다. 최대값은 1입니다.
            elem.scrollLeft = step * unit + from; // 애니메이션 진행률에 따라 요소의 가로 스크롤 위치를 업데이트합니다.
            if (step === 1) {
                // 만약 애니메이션의 진행률이 1에 도달하면(애니메이션이 완료되었을 때),
                clearInterval(timer); // 인터벌을 종료합니다.
                isAnimating = false; // 애니메이션이 끝났음을 나타내는 변수를 false로 설정합니다.
            }
        }, aframe); // 일정한 간격(`aframe`)으로 애니메이션 프레임을 업데이트합니다.

    // 애니메이션 종료 후 재생성을 위해 변수를 다시 false로 설정
    timer.addEventListener('finish', function () {
        isAnimating = false;
    });
}

// 좌측 버튼 클릭 시 왼쪽으로 스크롤 애니메이션
document.querySelector('.deals-scroll-left').addEventListener('click', function () {
    var container = document.getElementById('movie-container');
    var unit = 700; // 한 번에 이동할 거리
    scrollLeftAnimate(container, -unit);
});

// 우측 버튼 클릭 시 오른쪽으로 스크롤 애니메이션
document.querySelector('.deals-scroll-right').addEventListener('click', function () {
    var container = document.getElementById('movie-container');
    var unit = 700; // 한 번에 이동할 거리
    scrollLeftAnimate(container, unit);
});

// 초기 영화 목록 표시
fetchMovies();

// 영화 카드 클릭 시 id 나오기
document.addEventListener('click', function (event) {
    const movieCard = event.target.closest('.movie');
    if (movieCard) {
        const movieId = movieCard.dataset.movieId;
        if (movieId) {
            alert(`클릭한 영화의 ID는 ${movieId} 입니다.`);
        }
    }
});

// 영화 가져와서 화면에 표시하는 함수
function fetchMovies() {
    let apiKey = '657ffd22014acc1e3761178b24efa6fe';
    let page = 1;
    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=ko-KR&page=${page}`;
    displayMovies(url);
}

function displayMovies(url) {
    document.getElementById('movie-container').innerHTML = ''; // 이전에 표시된 영화 목록 제거
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const movies = data.results;
            movies.forEach((movie) => {
                const { poster_path, title } = movie;
                const moviePosterPath = `https://image.tmdb.org/t/p/w500${poster_path}`;
                const movieCard = `
          <div class="slider-card">
            <img src="${moviePosterPath}">
          </div>
      `;
                document.getElementById('movie-container').innerHTML += movieCard;
            });
        })
        .catch((error) => console.error('Error fetching movies:', error));
}
