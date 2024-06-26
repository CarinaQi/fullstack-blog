window.addEventListener("load", function () {

  //Create effect for like button
  displayLikeButton();

  async function displayLikeButton() {
    const likeBtn = document.querySelector(".like-btn");
    const likeIcon = document.getElementById("like-icon");
    const likeCount = document.getElementById("like_count");

    const user_id = document.querySelector("#user_id")
    const article_id = document.querySelector("#article_id")

    let isLiked = await checkIfLiked(user_id.value, article_id.value);

    if (isLiked == 1) {
      likeIcon.classList.add("fa-solid");
      likeIcon.classList.add("liked");
    } else {
      likeIcon.classList.add("fa-regular");
      likeIcon.classList.remove("liked");
    }

    likeBtn.addEventListener("click", () => {
      if(user_id.value){
        if (isLiked == 1) {
          likeIcon.classList.replace("fa-solid", "fa-regular");
          likeIcon.classList.remove("liked");
          removeLike(article_id.value, likeCount)
          isLiked = 0;
        } else {
          likeIcon.classList.replace("fa-regular", "fa-solid");
          likeIcon.classList.add("liked");
          addLike(article_id.value, likeCount);
          isLiked = 1;
        }
      }
    })

  }

  async function checkIfLiked(user_id, article_id) {
    const response = await fetch(`/api/checkIfLiked`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id, article_id }),
    });
    const isLiked = await response.text();
    return isLiked;
  }

  async function removeLike(article_id, likeCount) {
    fetch(`/removeLike?id=${article_id}`)
      .then(response => {
        if (response.status === 200) {
          likeCount.textContent--;
        } else {
          console.error('Error removing like');
        }
      })
      .catch(error => {
        console.error('Network error:', error);
      });
  }

  async function addLike(article_id, likeCount) {
    fetch(`/addLike?id=${article_id}`)
      .then(response => {
        if (response.status === 200) {
          likeCount.textContent++;
        } else {
          console.error('Error adding like');
        }
      })
      .catch(error => {
        console.error('Network error:', error);
      });
  }


})