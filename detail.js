const commentList = document.querySelector(".comment-list");
const URLSearch = new URLSearchParams(location.search);
const movieId = URLSearch.get("id"); //type: string, URL(query)로 영화 id를 받아옴

document.addEventListener("DOMContentLoaded", () => {
  if (!movieId) {
    return;
  }
  let commentArr = localStorage.getItem(movieId);
  if (!commentArr) {
    localStorage.setItem(movieId, "[]");
    location.reload();
  }
});

let dataArr = JSON.parse(localStorage.getItem(movieId));

//form submit 이벤트, 유저에게 입력받은 값을 localstorage에 저장
document.addEventListener("submit", (e) => {
  e.preventDefault();
  const writer = document.querySelector("#writer").value; //writer 입력값
  const password = document.querySelector("#password").value; //password 입력값
  const comment = document.querySelector("#comment").value; //comment 입력값 (댓글내용)

  // 입력값 없으면 alert
  if (!writer) {
    return alert("작성자를 입력해주세요");
  } else if (!password) {
    return alert("비밀번호를 입력해주세요");
  } else if (!comment) {
    return alert("글내용을 입력해주세요");
  }
  // let dataArr = [...JSON.parse(localStorage.getItem(movieId))];
  dataArr.push({
    writer: writer,
    password: password,
    comment: comment,
  });

  // localstorage에 저장
  localStorage.setItem(movieId, JSON.stringify(dataArr));

  alert("작성 완료!");
  window.location.reload();
});

//localstrage에서 Item을 가져와서 댓글형태로 화면에 뿌림
dataArr.forEach((e, i) => {
  const li = document.createElement("li");
  li.className = "comment-item";
  li.id = "comment" + i;
  li.innerHTML = `
        <div class="comment-button-area">
        <h4>${e.writer}</h4> <button class=edit-btn id=edit${i}>수정</button> <button class=delete-btn id=del${i}>🗑️</button>
        </div>
        <p>${e.comment}</p>
  `;
  commentList.append(li);

  //수정버튼 클릭시 발생하는 이벤트(수정 양식 모달창 띄움)
  document.querySelector(`#edit${i}`).addEventListener("click", () => {
    //비밀번호 검증
    let inputPassword = prompt("비밀번호");
    if (typeof inputPassword == "object") {
      return;
    }
    if (inputPassword !== e.password) {
      return alert("비밀번호가 다릅니다!");
    }

    //모달창 띄우고 배경 블러처리
    document.querySelector(".modal-overlay").className = "modal-overlay";

    let modal = document.querySelector(".modal");
    modal.className = "modal";

    modal.querySelector("#edit-writer").value = e.writer;
    modal.querySelector("#edit-password").value = e.password;
    modal.querySelector("#edit-comment").value = e.comment;

    document.querySelector("#modal-edit-btn").addEventListener("click", () => {
      const newWriter = modal.querySelector("#edit-writer").value;
      const newPassword = modal.querySelector("#edit-password").value;
      const newComment = modal.querySelector("#edit-comment").value;

      e.writer = newWriter;
      e.password = newPassword;
      e.comment = newComment;
      dataArr[i] = e;
      localStorage.setItem(movieId, JSON.stringify(dataArr));

      alert("수정완료!");
      document.querySelector(".modal-overlay").className =
        "modal-overlay hidden";
      document.querySelector(".modal").className = "modal hidden";
      location.reload();
    });
  });

  //🗑️버튼(삭제버튼)클릭시 발생하는 이벤트
  document.querySelector(`#del${i}`).addEventListener("click", () => {
    let inputPassword = prompt("비밀번호");
    if (typeof inputPassword == "object") {
      return;
    }
    if (inputPassword !== e.password) {
      return alert("비밀번호가 다릅니다!");
    }
    dataArr.splice(i, 1);
    localStorage.setItem(movieId, JSON.stringify(dataArr));
    li.remove();
    alert("삭제완료!");
  });
});

//모달창에서 취소버튼 클릭시 모달을 닫고 전체 블러를 없애는 이벤트
document.querySelector("#modal-cancel-btn").addEventListener("click", () => {
  if (confirm("취소하시겠습니까?")) {
    document.querySelector(".modal-overlay").className = "modal-overlay hidden";
    document.querySelector(".modal").className = "modal hidden";
  }
});
