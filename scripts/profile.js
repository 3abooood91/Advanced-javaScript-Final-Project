// =============== Initialization ================= //

const urlParams = new URLSearchParams(window.location.search);
let userId = urlParams.get("userId");
if (userId == null) {
  userId = user.id;
}
getUser(userId);
getUserPosts(userId);

// // =============== Initialization ================= //

// =============== API Requests ================= //

function getUser(userId) {
  axios
    .get(baseUrl + "/users/" + userId)
    .then((response) => {
      console.log(response);
      let userInfo = response.data.data;
      console.log(userInfo.username);
      console.log(userInfo.name);
      console.log(userInfo.profile_image);
      let profilePic = "";
      if (typeof userInfo.profile_image === "string") {
        profilePic = userInfo.profile_image;
      } else {
        profilePic = "../assets/default profile picture.jpeg";
      }
      document.getElementById("user-info").innerHTML = `
        <div class="personalInfo d-flex gap-5">
            <img src="${profilePic}" alt="" style="width: 100px; height: 100px;" class="rounded">
            <div>
                <p>${userInfo.username}</p>
                <p>${userInfo.name}</p>
                <p>${userInfo.email}</p>
            </div>
        </div>
        <div class="postCommentsCount">
            <p>${userInfo.comments_count} <span>Comments</span></p>
            <p>${userInfo.posts_count} <span>Posts</span></p>
        </div>
      `;
      document.getElementById(
        "userNamePosts"
      ).innerHTML = `${userInfo.name}'s Posts`;
    })
    .catch((error) => {
      console.log(error);
    });
}

function getUserPosts(userId) {
  let requestUrl = baseUrl + "/users/" + userId + "/posts";
  postsList.innerHTML = `<div class="loader"></div>`;
  axios
    .get(requestUrl)
    .then(function (response) {
      let posts = response.data.data;
      postsList.innerHTML = "";
      for (post of posts) {
        let postId = post.id;
        let postTitle = "";
        if (post.title != null) {
          postTitle = post.title;
        }
        let author = post.author.username;
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
        let commentNumber = post.comments_count;
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
        postsList.innerHTML += `
                  <div class="card shadow-sm" id="${postId}">
                      <div class="card-header d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center gap-2">
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
                      <div class="card-body px-0 pb-0" onclick="moveToPostPage(${postId})" style="cursor: pointer">
                          <img src="${img}" alt="" style="width: 100%; max-height: 700px;" />
                          <div class="px-3">
                          <p class="card-title text-black-50">${createdAt}</p>
                          <p class="card-text">
                              ${postBody}
                          </p>
                          <hr />
                          </div>
                      </div>
                      <div class="d-flex p-3 pt-3">
                          <div>
                              <a style="color: blue">
                              <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  fill="currentColor"
                                  class="bi bi-chat-right-dots"
                                  viewBox="0 0 16 16"
                              >
                                  <path
                                  d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"
                                  />
                                  <path
                                  d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
                                  />
                              </svg>
                              <span>(${commentNumber}) Comments</span>
                              </a>
                          </div>
                          <div class="d-flex gap-2 ms-auto" id="tagsList${postId}">
                          </div>
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
      }
      setupUi();
    })
    .catch(function (error) {
      console.log(error);
    });
}
// // =============== API Requests ================= //

// =============== Misc ================= //

function moveToPostPage(postId) {
  window.location = `../post-details.html?postId=${postId}`;
}

// // =============== Misc ================= // //
