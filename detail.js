const commentList = document.querySelector(".comment-list");

//form submit 이벤트, 유저에게 입력받은 값을 localstorage에 저장
document.addEventListener("submit", (e) => {
  e.preventDefault();
  const writer = e.target[0].value; //writer 입력값
  const password = e.target[1].value; //password 입력값
  const comment = e.target[3].value; //comment 입력값 (댓글내용)

  // 입력값 없으면 alert
  if (!writer) {
    return alert("작성자를 입력해주세요");
  } else if (!password) {
    return alert("비밀번호를 입력해주세요");
  } else if (!comment) {
    return alert("글내용을 입력해주세요");
  }

  // localstorage에 저장
  localStorage.setItem(
    localStorage.length,
    JSON.stringify({ writer: writer, password: password, comment: comment })
  );

  alert("작성 완료!");
  window.location.reload();
});

let arr = [];
for (let key in localStorage) {
  if (!localStorage.hasOwnProperty(key)) {
    continue; // setItem, getItem 등의 키를 건너뜁니다.
  }
  arr.push(key);
}
arr.sort((a, b) => {
  return a - b;
});

//localstrage에서 Item을 가져와서 댓글형태로 화면에 뿌림
arr.forEach((e, i) => {
  let item = JSON.parse(localStorage.getItem(e));

  const li = document.createElement("li");
  li.className = "comment-item";
  li.id = "comment" + i;
  li.innerHTML = `
        <div class="comment-button-area">
        <h4>${item.writer}</h4> <button class=edit-btn id=edit${i}>수정</button> <button class=delete-btn id=del${i}>🗑️</button>
        </div>
        <p>${item.comment}</p>
  `;
  commentList.append(li);

  //수정버튼 클릭시 발생하는 이벤트(수정 양식 모달창 띄움)
  document.querySelector(`#edit${i}`).addEventListener("click", () => {
    //비밀번호 검증
    let inputPassword = prompt("비밀번호");
    if (typeof inputPassword == "object") {
      return;
    }
    if (inputPassword !== item.password) {
      return alert("비밀번호가 다릅니다!");
    }

    //모달창 띄우고 배경 블러처리
    document.querySelector(".modal-overlay").className = "modal-overlay";

    let modal = document.querySelector(".modal");
    modal.className = "modal";

    modal.querySelector("#edit-writer").value = item.writer;
    modal.querySelector("#edit-password").value = item.password;
    modal.querySelector("#edit-comment").value = item.comment;

    document.querySelector("#modal-edit-btn").addEventListener("click", () => {
      const newWriter = modal.querySelector("#edit-writer").value;
      const newPassword = modal.querySelector("#edit-password").value;
      const newComment = modal.querySelector("#edit-comment").value;

      localStorage.setItem(
        e,
        JSON.stringify({
          writer: newWriter,
          password: newPassword,
          comment: newComment,
        })
      );
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
    if (inputPassword !== item.password) {
      return alert("비밀번호가 다릅니다!");
    }
    localStorage.removeItem(i);
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
