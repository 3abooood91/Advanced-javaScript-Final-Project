const baseUrl = "https://tarmeezacademy.com/api/v1";
const postsList = document.getElementById("posts-list");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("singup-btn");
const logoutBtn = document.getElementById("logout-btn");
const profileBtn = document.getElementById("profile-btn");
const profilePicture = document.getElementById("fixed-profile-pic");
const newPostBtn = document.getElementById("add-new-post-btn");
const alerts = document.getElementById("alerts");
const addCommentSection = document.getElementById("add-comment-section");
const addCommentImg = document.getElementById("add-comment-img");
const editDeleteBtns = document.getElementsByClassName("editDelete");

// =============== Initialization ================= //

setupUi();

// // =============== Initialization ================= //

// =============== Updating UI ================= //

function setupUi() {
  token = localStorage.getItem("token");
  user = JSON.parse(localStorage.getItem("user"));
  if (token == null) {
    logoutBtnSetup();
  } else {
    loginBtnSetup();
  }
  updateUserName();
  updateProfileImage();
}
function loginBtnSetup() {
  loginBtn.hidden = true;
  signupBtn.hidden = true;
  logoutBtn.hidden = false;
  profileBtn.hidden = false;
  if (newPostBtn) {
    newPostBtn.hidden = false;
  }
  if (addCommentSection) {
    addCommentSection.classList.add("d-flex");
    addCommentSection.hidden = false;
    if (typeof user.profile_image == "string") {
      addCommentImg.setAttribute("src", user.profile_image);
    } else {
      addCommentImg.setAttribute(
        "src",
        "./assets/default profile picture.jpeg"
      );
    }
  }
  for (button of editDeleteBtns) {
    button.hidden = false;
  }
}
function logoutBtnSetup() {
  loginBtn.hidden = false;
  signupBtn.hidden = false;
  logoutBtn.hidden = true;
  profileBtn.hidden = true;
  if (newPostBtn) {
    newPostBtn.hidden = true;
  }
  if (addCommentSection) {
    addCommentSection.classList.remove("d-flex");
    addCommentSection.hidden = true;
  }
  for (button of editDeleteBtns) {
    button.hidden = true;
  }
}
function updateUserName() {
  if (user) {
    document.getElementById("navbar-brand").innerHTML = user.name;
  } else {
    document.getElementById("navbar-brand").innerHTML = "Social";
  }
}
function updateProfileImage() {
  if (token == null) {
    profilePicture.hidden = true;
    profilePicture.removeAttribute("src");
  } else {
    if (typeof user.profile_image === "string") {
      profilePicture.setAttribute("src", user.profile_image);
      profilePicture.hidden = false;
    }
  }
}

// // =============== Updating UI ================= //

// =============== API Requests ================= //

function login() {
  let userName = document.getElementById("username-input").value;
  let password = document.getElementById("password-input").value;
  let params = {
    username: userName,
    password: password,
  };
  axios
    .post(baseUrl + "/login", params)
    .then(function (response) {
      token = response.data.token;
      user = JSON.stringify(response.data.user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", user);
      bootstrap.Modal.getInstance(
        document.getElementById("login-modal")
      ).hide();
      document.getElementById("username-input").value = "";
      document.getElementById("password-input").value = "";
      setupUi();
      if (location.pathname == "/index.html") {
        getPosts();
      } else if (location.pathname == "/post-details.html") {
        getPost(urlParams.get("postId"));
      }
      showToast(
        `Hello ${response.data.user.name}. You have Successfully Logged in`,
        "green"
      );
    })
    .catch(function (error) {
      console.log(error);
      showToast(error.response.data.message, "red");
    });
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  if (location.pathname == "/profile.html") {
    window.location = "../index.html";
  }
  showToast("You Are Logged out", "red");
  setupUi();
}

function createNewUser() {
  let newName = document.getElementById("signup-name-input").value;
  let newUsername = document.getElementById("signup-username-input").value;
  let newPassword = document.getElementById("signup-password-input").value;
  let newImage = document.getElementById("signup-image-input").files[0];
  let formData = new FormData();

  formData.append("username", newUsername);
  formData.append("password", newPassword);
  formData.append("name", newName);
  formData.append("image", newImage);
  let config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  axios
    .post(baseUrl + "/register", formData, config)
    .then(function (response) {
      //   console.log(response);
      token = response.data.token;
      user = JSON.stringify(response.data.user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", user);
      bootstrap.Modal.getInstance(
        document.getElementById("signup-modal")
      ).hide();
      document.getElementById("signup-name-input").value = "";
      document.getElementById("signup-username-input").value = "";
      document.getElementById("signup-password-input").value = "";
      setupUi();
      showToast(
        `Welcome ${response.data.user.name}. You have Successfully craeted a new account`,
        "blue"
      );
    })
    .catch(function (error) {
      showToast(error.response.data.message, "red");
    });
}

function createNewPost() {
  let postTitle = document.getElementById("post-title-input").value;
  let postBody = document.getElementById("post-body-input").value;
  let postImg = document.getElementById("image-input").files[0];
  let formData = new FormData();
  formData.append("body", postBody);
  formData.append("title", postTitle);
  formData.append("image", postImg);
  let config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + token,
    },
  };

  axios
    .post(baseUrl + "/posts", formData, config)
    .then(function (response) {
      bootstrap.Modal.getInstance(
        document.getElementById("add-new-post-modal")
      ).hide();
      showToast("You have created a new post Successfully", "blue");
      getPosts();
    })
    .catch(function (error) {
      showToast(error.response.data.message, "red");
    });
}

function updatePost(postId) {
  let newTitle = document.getElementById("edit-post-title-input").value;
  let newBody = document.getElementById("edit-post-body-input").value;
  console.log(newTitle);
  console.log(newBody);
  let params = {
    title: `${newTitle}`,
    body: `${newBody}`,
  };
  let config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  axios
    .put(baseUrl + "/posts/" + postId, params, config)
    .then((response) => {
      console.log(response);
      bootstrap.Modal.getInstance(
        document.getElementById("edit-post-modal")
      ).hide();
      showToast("You have updated the post Successfully", "blue");
      if (location.pathname == "/index.html") {
        getPosts();
      } else if (location.pathname == "/post-details.html") {
        getPost(urlParams.get("postId"));
      } else if (location.pathname == "/profile.html") {
        getUserPosts();
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

async function deletePost(postId) {
  let config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  await deleteConfirmation();
  if (confirmation) {
    bootstrap.Modal.getInstance(
      document.getElementById("delete-confirm-modal")
    ).hide();
    axios
      .delete(baseUrl + "/posts/" + postId, config)
      .then(function (response) {
        if (location.pathname == "/index.html") {
          getPosts();
        } else if (location.pathname == "/post-details.html") {
          window.location = "/index.html";
        } else if (location.pathname == "/profile.html") {
          getUserPosts(userId);
          getUser(userId);
        }
        showToast("The post has been deleted", "red");
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

// // =============== API Requests ================= //

// =============== Misc ================= //

//  alerts  //

let alertCount = 0;
function showToast(message = "", color = "") {
  let bgColor = () => {
    if (color == "green") {
      return "rgba(159, 252, 159, 0.9)";
    } else if (color == "red") {
      return "rgba(255, 156, 156, 0.9)";
    } else if (color == "blue") {
      return "rgba(179, 205, 254, 0.9)";
    } else {
      return "rgba(234, 234, 234, 0.9)";
    }
  };
  let fontColor = () => {
    if (color == "green") {
      return "rgba(0, 77, 0)";
    } else if (color == "red") {
      return "rgba(124, 0, 0)";
    } else if (color == "blue") {
      return "rgba(0, 0, 106)";
    } else {
      return "rgba(71, 71, 71)";
    }
  };
  var newAlert = document.createElement("div");
  newAlert.setAttribute("id", color + "-alert" + "-" + alertCount);
  newAlert.setAttribute("class", "toast");
  newAlert.setAttribute("role", "alert");
  newAlert.setAttribute("aria-live", "assertive");
  newAlert.setAttribute("aria-atomic", "true");
  newAlert.style.backgroundColor = bgColor();
  newAlert.style.color = fontColor();
  newAlert.innerHTML = `<div class="d-flex">
        <div class="toast-body">
            ${message}
        </div>
        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div> 
    `;
  alerts.appendChild(newAlert);
  const toastLiveExample = document.getElementById(
    `${color}-alert-${alertCount}`
  );
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
  toastBootstrap.show();
  alertCount++;
}

//  pagination //

var currentPage = 1;
let lastPage = 0;
window.addEventListener("scroll", loadMorePosts);

function loadMorePosts() {
  if (
    window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight &&
    currentPage < lastPage
  ) {
    getPosts(false, currentPage + 1);
    currentPage++;
  }
}

// edit post //

function editPost(encodedPost) {
  let post = JSON.parse(decodeURIComponent(encodedPost));
  console.log(post);
  document.getElementById("edit-post-title-input").value = post.title;
  document.getElementById("edit-post-body-input").value = post.body;
  document.getElementById("hidden-post-id").value = post.id;
}

// delete confirmation //

function deleteConfirmation() {
  return new Promise((resolve, reject) => {
    const deleteConirmationModal = new bootstrap.Modal("#delete-confirm-modal");
    deleteConirmationModal.show();
    document
      .getElementById("delete-confirmation-btn")
      .addEventListener("click", () => {
        resolve(true);
      });
    document
      .getElementById("delete-confirmation-dissmis-btn")
      .addEventListener("click", () => {
        resolve(false);
      });
  }).then((resolve) => {
    if (resolve) {
      confirmation = true;
    } else {
      confirmation = false;
    }
  });
}

// // =============== Misc ================= //
