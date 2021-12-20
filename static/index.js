const tableBody = document.querySelector("#table-body");
const preloader = document.querySelector("#preloader");
const table = document.querySelector("#table");
const modal = document.querySelector("#myModal");
const closeModal = document.querySelector("#close");
const modalBody = document.querySelector("#modal-body");
const modalTitle = document.querySelector("#modal-title");
const buttonReload = document.querySelector("#button-reload");

class Posts {
  constructor() {
    this.posts = [];
    this.post = {};
    this.elemID = 1;
  }
  async getPosts() {
    buttonReload.classList.add("display")
    const response = await fetch("http://localhost:5000/news/", {
      method: "GET",
    });
    if (response) {
      if (!preloader.classList.contains("hide")) {
        preloader.classList.add("hide");
      }
      if (buttonReload.classList.contains("display")) {
        buttonReload.classList.remove("display");
      }
      if (table.classList.contains("table-body")) {
        table.classList.remove("table-body");
      }
      this.posts = await response.json();
      this.posts.forEach((post) => {
        Object.assign(post, { id: this.elemID++ });
        tableBody.insertAdjacentHTML(
          "beforeend",
          `
          <tr>
            <td>${post.title._text}</td>
            <td>${post.description._cdata}</td>
            <td><a href="${post.link._text}" target="_blank">${
            post.link._text
          }</a></td>
            <td>${new Date(post.pubDate._text).toLocaleString()}</td>
            <td><img src="${
              post.enclosure._attributes.url
            }" class="table-image"></td>
          </tr>
          `
        );
      });
    }
  }

  getOnePost(id) {
    this.post = this.posts.find(
      (post) => post.id === id[0].parentNode.parentNode.rowIndex
    );
    modal.style.display = "block";
    const html = `
      <p>${this.post.description._cdata}</p>
      <p>Дата публикации новости: ${new Date(
        this.post.pubDate._text
      ).toLocaleString()}</p>
      <img class="modal-image" src="${this.post.enclosure._attributes.url}">
    `;
    modalBody.innerHTML = html;
    modalTitle.innerText = `${this.post.title._text}`;
  }

  async getNewPosts() {
    buttonReload.classList.add("display")
    table.classList.add("table-body");
    preloader.classList.remove("hide");
    const response = await fetch("http://localhost:5000/news/", {
      method: "GET",
    });
    if (response) {
      if (!preloader.classList.contains("hide")) {
        preloader.classList.add("hide");
      }
      if (table.classList.contains("table-body")) {
        table.classList.remove("table-body");
      }
      if (buttonReload.classList.contains("display")) {
        buttonReload.classList.remove("display");
      }
      const data = await response.json();
      this.posts = data;
    }
  }
}

const posts = new Posts();
posts.getPosts();

tableBody.addEventListener("click", (e) => {
  posts.getOnePost(e.target.childNodes);
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});

buttonReload.addEventListener("click", () => posts.getNewPosts());
