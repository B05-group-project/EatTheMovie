const commentList = document.querySelector(".comment-list");
const URLSearch = new URLSearchParams(location.search);
const movieId = URLSearch.get("id");
const $commentBtn = document.querySelector(".add-comment-btn");

document.addEventListener("DOMContentLoaded", () => {
  JSON.parse(localStorage.getItem(movieId)).length === 0
    ? localStorage.removeItem(movieId)
    : null;
});

//리뷰남기기 버튼 클릭 시 댓글 작성 모달창 띄우는 이벤트
$commentBtn.addEventListener("click", () => {
  //모달창 띄우고 배경 블러처리
  document.querySelector(".modal-overlay").className = "modal-overlay";
  const $modal = document.querySelector("#write-modal");
  $modal.className = "modal";
});

//form submit 이벤트, 유저에게 입력받은 값을 localstorage에 저장
document.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!movieId) return;

  const writer = document.querySelector("#writer").value;
  const password = document.querySelector("#password").value;
  //comment 입력값을 담은 변수(댓글내용), textarea에서 엔터키 입력(\n)을 br태그로 변경하여 줄바꿈 구현
  const comment = document
    .querySelector("#comment")
    .value.replaceAll(`\n`, `<br>`);
  const date = new Date();
  const hour =
    (date.getHours() < 12 ? "오전 " : "오후 ") +
    (date.getHours() <= 12 ? date.getHours() : date.getHours() - 12);
  const minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  const preDate = `${date.getFullYear()}/${
    date.getMonth() + 1
  }/${date.getDate()} ${hour}:${minutes}`;

  // 입력값 없으면 alert
  if (!writer) {
    return alert("작성자를 입력해주세요");
  } else if (!password) {
    return alert("비밀번호를 입력해주세요");
  } else if (!comment) {
    return alert("글내용을 입력해주세요");
  }

  //movieId가 key인 item을 가져옴, 없으면 새 배열안에 댓글 객체를 담아 저장
  const commentArr = JSON.parse(localStorage.getItem(movieId))
    ? JSON.parse(localStorage.getItem(movieId))
    : [];

  commentArr.push({
    writer: writer,
    password: password,
    comment: comment,
    date: preDate,
  });

  localStorage.setItem(movieId, JSON.stringify(commentArr));
  alert("작성 완료!");
  window.location.reload();
});

//로컬스토리지에서 movieId에 맞는 item을 가져오고, 존재하지 않으면 빈배열을 변수에 담는 코드.
const dataArr = JSON.parse(localStorage.getItem(movieId))
  ? JSON.parse(localStorage.getItem(movieId))
  : [];

//localstrage에서 movieId에 맞는 Item을 가져와서 댓글형태로 화면에 뿌리는 코드
dataArr.forEach((e, i) => {
  const $li = document.createElement("li");
  const editStatus = e.editDate ? "수정됨" : "";
  const tempDate = e.editDate ? e.editDate : e.date;
  $li.className = "comment-item";
  $li.id = "comment" + i;
  $li.innerHTML = `
        <div class="comment-title-area">
        <span class=comment-num>${i}</span><h4>${e.writer}</h4> <span class=pre-date><span class=edit-status>${editStatus}</span>${tempDate}</span><button class=edit-btn id=edit${i}>수정</button> <button class=delete-btn id=del${i}>🗑️</button>
        </div>
        <p>${e.comment}</p>
  `;

  commentList.prepend($li);

  //수정버튼 클릭시 발생하는 이벤트(수정 양식 모달창 띄움)
  document.querySelector(`#edit${i}`).addEventListener("click", () => {
    //비밀번호 검증
    const inputPassword = prompt("비밀번호");
    if (typeof inputPassword == "object") {
      return;
    }
    if (inputPassword !== e.password) {
      return alert("비밀번호가 다릅니다!");
    }

    //모달창 띄우고 배경 블러처리
    document.querySelector(".modal-overlay").className = "modal-overlay";
    const $modal = document.querySelector("#edit-modal");
    $modal.className = "modal";

    $modal.querySelector("#edit-writer").value = e.writer;
    $modal.querySelector("#edit-password").value = e.password;
    $modal.querySelector("#edit-comment").value = e.comment.replaceAll(
      `<br/>`,
      `\n`
    );

    //수정버튼 클릭시 localStorage에서 댓글을 찾아서 데이터 수정
    document.querySelector("#modal-edit-btn").addEventListener("click", () => {
      const newWriter = $modal.querySelector("#edit-writer").value;
      const newPassword = $modal.querySelector("#edit-password").value;
      const newComment = $modal
        .querySelector("#edit-comment")
        .value.replaceAll(`\n`, `<br/>`);

      const date = new Date();
      const hour =
        (date.getHours() < 12 ? "오전 " : "오후 ") +
        (date.getHours() <= 12 ? date.getHours() : date.getHours() - 12);
      const minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
      const preDate = `${date.getFullYear()}/${
        date.getMonth() + 1
      }/${date.getDate()} ${hour}:${minutes}`;

      e.writer = newWriter;
      e.password = newPassword;
      e.comment = newComment;
      e.editDate = preDate;

      dataArr[i] = e;
      localStorage.setItem(movieId, JSON.stringify(dataArr));

      alert("수정완료!");
      document.querySelector(".modal-overlay").className =
        "modal-overlay hidden";
      document.querySelector(".modal").className = "modal hidden";
      location.reload();
    });
  });

  //🗑️버튼 클릭시 삭제 이벤트
  document.querySelector(`#del${i}`).addEventListener("click", () => {
    const inputPassword = prompt("비밀번호");
    if (typeof inputPassword == "object") {
      return;
    }
    if (inputPassword !== e.password) {
      return alert("비밀번호가 다릅니다!");
    }

    dataArr.splice(i, 1);
    localStorage.setItem(movieId, JSON.stringify(dataArr));
    $li.remove();
    alert("삭제완료!");
    location.reload();
  });
});

//모달창에서 취소버튼 클릭시 모달을 닫고 전체 블러를 없애는 이벤트
document.querySelectorAll(".modal-cancel-btn").forEach((e) => {
  e.addEventListener("click", () => {
    if (confirm("취소하시겠습니까?")) {
      document.querySelector(".modal-overlay").className =
        "modal-overlay hidden";
      e.parentElement.parentElement.className = "modal hidden";
    }
  });
});

//댓글을 글번호순으로 정렬하는 버튼이벤트
document.querySelector(".sort-number-btn").addEventListener("click", () => {
  const liNodesRev = [...document.querySelectorAll(".comment-item")].reverse();
  const liNodes = document.querySelectorAll(".comment-item");
  const liList = document.querySelector(".comment-list");
  liNodes.forEach((e) => {
    e.remove();
  });
  liNodesRev.forEach((e) => {
    liList.append(e);
  });
});

//모달창이 화면에 표시됐을때 모달창 외부 클릭시 모달창을 닫고 블러를 없애는 이벤트
document.querySelector(".modal-overlay").addEventListener("click", () => {
  document.querySelector(".modal-overlay").className = "modal-overlay hidden";
  document.querySelector("#write-modal").className = "modal hidden";
  document.querySelector("#edit-modal").className = "modal hidden";
});
