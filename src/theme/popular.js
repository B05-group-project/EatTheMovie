const apiKey = '657ffd22014acc1e3761178b24efa6fe';

let page = 1;
const options = {
    root: null, // 뷰포트를 기준으로 타켓의 가시성 검사
    rootMargin: '200px', // 확장 또는 축소 X
    threshold: 0, // 타켓의 가시성 0%일 때 옵저버 실행
};
const word = new URL(location.href).searchParams.get('word');
const language = localStorage.getItem('language');

const $headerTitle = document.getElementById('header-title');
const $magnifier = document.querySelector('.magnifier');
const $searchBar = document.querySelector('#search-input');
const $searchBtn = document.getElementById('search-button');
const $cancleBtn = document.querySelector('#cancle-button');
const $wordWrapper = document.getElementById('search-word-wrapper');
const $languageFilter = document.getElementById('language-filter');
const $movieContainer = document.getElementById('movie-container');
const $listEnd = document.getElementById('movie-end');

function addHeaderFunction() {
    setHeaderTitleClick();
    setSearchInputValue();
    setSearchBtnFunction();
    setSearchBarAnimation();
}

function addMainFunction() {
    const observer = new IntersectionObserver(onIntersect, options);

    showSearchWord();
    setLanguageDefault();
    setLanguageFilterFunction();
    observer.observe($listEnd);
    setMovieClick();
}

function setHeaderTitleClick() {
    $headerTitle.addEventListener('click', () => {
        window.location.href = `../index.html`;
    });
}

function setSearchInputValue() {
    $searchBar.value = word;
}

function setSearchBtnFunction() {
    //클릭으로 검색
    $searchBtn.addEventListener('click', () => {
        handleSearch();
    });

    //엔터 키로 검색
    $searchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
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
        alert('검색어를 입력해주세요!');
    }
}

function setSearchBarAnimation() {
    $magnifier.addEventListener('mouseover', () => {
        $searchBar.classList.add('expand');
        $magnifier.classList.add('expand');
        $cancleBtn.style.visibility = 'visible';
    });

    $cancleBtn.addEventListener('click', () => {
        $searchBar.classList.remove('expand');
        $magnifier.classList.remove('expand');
        $cancleBtn.style.visibility = 'hidden';
    });
}

function showSearchWord() {
    // "word" 변수가 없는 경우
    // 한글인 경우
    if (language === 'ko-KR') {
        $wordWrapper.innerHTML = `
                <div id="search-word">인기순</div>
            `;
    } else {
        // 그 외의 경우, 즉 영어인 경우
        $wordWrapper.innerHTML = `
                <div id="search-word">Popular</div>
            `;
    }
}

function setLanguageDefault() {
    $languageFilter.value = language;
}

function setLanguageFilterFunction() {
    $languageFilter.addEventListener('change', () => {
        const value = $languageFilter.options[$languageFilter.selectedIndex].value;
        localStorage.setItem('language', value);
        window.location.reload();
    });
}

function setMovieClick() {
    document.addEventListener('click', (event) => {
        const movieCard = event.target.closest('.movie');
        if (movieCard) {
            const movieId = movieCard.dataset.movieId;
            if (movieId) {
                window.location.href = `detail.html?id=${movieId}`;
            } else {
                alert('다른 영화를 클릭해주세요!');
            }
        }
    });
}

async function fetchGetData(url) {
    let APIData = await fetch(url)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            alert('해당하는 데이터가 없습니다!');
            throw new Error('에러 발생');
        })
        .catch((error) => {
            throw new Error(error);
        });
    return APIData;
}

function onIntersect(entries, observer) {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=${
        language ? language : `ko-KR`
    }&page=${page}`;
    entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
            const data = await fetchGetData(url);
            const movies = data.results;

            //탈출 조건
            if (movies.length < 1) {
                observer.unobserve($listEnd);
                return;
            }

            //영화 카드 구현
            $movieContainer.insertAdjacentHTML(
                'beforeend',
                movies.map((movieInfo) => makeMovieCard(movieInfo)).join('')
            );

            //scroll시 fadeIn 애니메이션
            ScrollOut({
                once: true,
            });
            page++;
        }
    });
}

function makeMovieCard(movieInfo) {
    const { id, poster_path, title, popularity } = movieInfo;
    const moviePosterPath = `https://image.tmdb.org/t/p/w500${poster_path}`;

    return `
    <div class="movie" data-movie-id="${id}" data-popularity="${popularity}" ${page !== 1 ? `data-scroll` : ``}>
        <img src="${
            poster_path ? moviePosterPath : '../image/replaceMovie.png'
        }" onerror="this.onerror=null; this.src='../image/replaceMovie.png';">
        ${poster_path ? `` : `<div id="movie-title">${title}</div>`}
    </div>
    `;
}

addHeaderFunction();
addMainFunction();
