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
