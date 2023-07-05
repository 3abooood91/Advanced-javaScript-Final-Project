// =============== Initialization ================= //

const urlParams = new URLSearchParams(window.location.search);
let postId = urlParams.get("postId");
getPost(postId);
getComments(postId);

// // =============== Initialization ================= //

// =============== API Requests ================= //

function getPost(postId = 1) {
  let requestUrl = baseUrl + `/posts/${postId}`;
  token = localStorage.getItem("token");
  user = JSON.parse(localStorage.getItem("user"));
  axios
    .get(requestUrl)
    .then(function (response) {
      let post = response.data.data;
      let postId = post.id;
      let postTitle = "";
      if (post.title != null) {
        postTitle = post.title;
      }
      let author = post.author.username;
      let authorId = post.author.id;
      let profilePic = "";
      if (typeof post.author.profile_image === "string") {
        profilePic = post.author.profile_image;
      } else {
        profilePic = "../assets/default profile picture.jpeg";
      }
      let createdAt = post.created_at;
      let postBody = post.body;
      let img = "";
      if (typeof post.image === "string") {
        img = post.image;
      } else {
        img = "../assets/jk-placeholder-image.jpeg";
      }
      let editAndDeleteContent = "";
      let isMyPost;
      if (user && author === user.username) {
        isMyPost = true;
      } else {
        isMyPost = false;
      }
      if (isMyPost) {
        editAndDeleteContent = `
              <button type="button" data-bs-toggle="modal" data-bs-target="#edit-post-modal" class="btn btn-outline-secondary editDelete" onclick="editPost('${encodeURIComponent(
                JSON.stringify(post)
              )}')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                  </svg>
              </button>
              <button type="button" class="btn btn-outline-danger editDelete" onclick="deletePost(${postId})">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                  </svg>
              </button>
          `;
      }
      document.getElementById("post").innerHTML = "";
      document.getElementById("post").innerHTML += `
      <div class="card-header d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center gap-2" onclick="moveToProfilePage(${authorId})" style="cursor: pointer;">
        <img
        src="${profilePic}"
        alt=""
        class="rounded-circle border border-dark-subtle"
        style="width: 40px; height: 40px;"
        />
        <p class="m-0">@${author}</p>
      </div> 
        <p class="m-0 fw-bold">${postTitle}</p>
        <div>
          ${editAndDeleteContent}
        </div>
    </div>
        <div class="card-body px-0 pb-0">
            <img src="${img}" alt="" style="width: 100%" />
            <div class="px-3">
                <p class="card-title text-black-50">${createdAt}</p>
                <p class="card-text">
                    ${postBody}
                </p>
            </div>
            <div class="d-flex gap-2 ms-auto p-2" id="tagsList${postId}">
            </div>
        </div>
      `;

      let tags = post.tags;
      document.getElementById(`tagsList${postId}`).innerHTML = "";
      for (tag of tags) {
        let tagContent = `
                  <div class="rounded-pill px-2 py-1 shadow-sm" style="background-color: rgb(172, 172, 172, 0.85); color: whitesmoke">${tag.name}</div>
                  `;
        document.getElementById(`tagsList${postId}`).innerHTML += tagContent;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getComments(postId = 1) {
  let requestUrl = baseUrl + `/posts/${postId}`;
  axios
    .get(requestUrl)
    .then(function (response) {
      let post = response.data.data;
      let postId = post.id;
      let comments = post.comments;
      document.getElementById("comments-list").innerHTML = "";
      for (comment of comments) {
        let commentBody = comment.body;
        let userPicture = "";
        let commentAuthorId = comment.author.id;
        if (typeof comment.author.profile_image === "string") {
          userPicture = comment.author.profile_image;
        } else {
          userPicture = "../assets/default profile picture.jpeg";
        }
        let userName = comment.author.username;
        document.getElementById("comments-list").innerHTML += `
        <div class="comment d-flex gap-1">
            <img
            src="${userPicture}"
            alt=""
            class="rounded-circle border border-dark-subtle"
            style="width: 40px; height: 40px; cursor: pointer;"
            onclick="moveToProfilePage(${commentAuthorId})"
            />
            <div class="comment p-2 d-flex flex-column rounded" style="background-color: aliceblue; min-height: 60px;">
                <p style="color: rgb(0, 0, 145); margin-bottom: 0; cursor: pointer;" onclick="moveToProfilePage(${commentAuthorId})">@${userName}</p>
                <p>
                    ${commentBody} 
                </p>
            </div>
        </div>
        `;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function postComment() {
  const comentInput = document.getElementById("new-comment-input");
  let params = {
    body: `${comentInput.value}`,
  };
  let config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  axios
    .post(baseUrl + `/posts/${postId}/comments`, params, config)
    .then(function (response) {
      comentInput.value = "";
      showToast("You've posted a comment", "blue");
      getComments(postId);
    })
    .catch(function (error) {
      showToast(error.response.data.message, "red");
      console.log(error.response.data.message);
    });
}

// // =============== API Requests ================= //

// =============== Misc ================= //

function moveToProfilePage(userId) {
  window.location = `../profile.html?userId=${userId}`;
}

// // =============== Misc ================= // //
