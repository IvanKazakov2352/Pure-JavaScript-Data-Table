const tableBody = document.querySelector("#table-body");
const preloader = document.querySelector("#preloader");
const table = document.querySelector("#table");
const modal = document.querySelector("#my-modal");
const closeModal = document.querySelector("#close");
const modalBody = document.querySelector("#modal-body");
const modalTitle = document.querySelector("#modal-title");
const buttonReload = document.querySelector("#button-reload");
const sortByTitle = document.querySelector("#sort-by-title");
const sortByDate = document.querySelector("#sort-by-date");

class Posts {
  constructor() {
    this.posts = [];
    this.post = {};
    this.elemID = 1;
    this.isSortByTitle = false;
    this.isSortByDate = false;
  }
  async getPosts() {
    buttonReload.classList.add("display");

    const response = await fetch("/news", {
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
          "beforeend", `
            <tr id="${post.id}">
              <td>${post.title._text}</td>
              <td>${post.description?._cdata ? post.description?._cdata : "Описание новости отсутствует"}</td>
              <td><a href="${post.link._text}" target="_blank">${post.link._text}</a></td>
              <td>${new Date(post.pubDate._text).toLocaleString()}</td>
              <td><img src="${post.enclosure._attributes.url}" class="table-image"></td>
            </tr>
          `
        );
      });
    }
  }

  getOnePost(id) {
     this.post = this.posts.find((post) => post.id === id);
     modal.style.display = "block";

    const html = `
      <p>${this.post.description?._cdata ? this.post.description?._cdata : "Описание новости отсутствует"}</p>
      <p>Дата публикации новости: ${new Date(this.post.pubDate._text).toLocaleString()}</p>
      <img class="modal-image" src="${this.post.enclosure._attributes.url}">
    `;

    modalBody.innerHTML = html;
    modalTitle.innerText = `${this.post.title._text}`; 
  }

  async getNewPosts() {
    buttonReload.classList.add("display");
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

      this.posts = await response.json();

      this.iterationAnPosts()
    }
  }

  iterationAnPosts() {
    while (tableBody.firstChild) {
      tableBody.removeChild(tableBody.firstChild);
    }
    return this.posts.forEach((post) => {

      tableBody.insertAdjacentHTML(
        "beforeend", `
          <tr id="${post.id}">
            <td>${post.title._text}</td>
            <td>${post.description?._cdata ? post.description?._cdata : "Описания для поста нет"}</td>
            <td><a href="${post.link._text}" target="_blank">${post.link._text}</a></td>
            <td>${new Date(post.pubDate._text).toLocaleString()}</td>
            <td><img src="${post.enclosure._attributes.url}" class="table-image"></td>
          </tr>
        `
      );
    });
  }

  sortingByTitle() {
    this.isSortByTitle = !this.isSortByTitle;
    if (this.isSortByTitle) {
      if(sortByTitle.classList.contains('mdi-arrow-collapse-up')) {
        sortByTitle.classList.add("mdi-arrow-collapse-down")
        sortByTitle.classList.remove("mdi-arrow-collapse-up")
      } else {
        sortByTitle.classList.remove("mdi-arrow-collapse-down")
        sortByTitle.classList.add("mdi-arrow-collapse-up")
      }
      this.posts = [...this.posts].sort((a, b) => a.title._text.toLowerCase() > b.title._text.toLowerCase() ? 1 : -1);
    } else {
      if(sortByTitle.classList.contains('mdi-arrow-collapse-up')) {
        sortByTitle.classList.remove("mdi-arrow-collapse-up")
        sortByTitle.classList.add("mdi-arrow-collapse-down")
      } else {
        sortByTitle.classList.remove("mdi-arrow-collapse-down")
        sortByTitle.classList.add("mdi-arrow-collapse-up")
      }
      this.posts = [...this.posts].sort((a, b) => a.title._text.toLowerCase() > b.title._text.toLowerCase() ? -1 : 1);
    }
    this.iterationAnPosts();
  }

  sortingByDate() {
    this.isSortByDate = !this.isSortByDate;
    if(this.isSortByDate) {
      if(sortByDate.classList.contains('mdi-arrow-collapse-up')) {
        sortByDate.classList.add("mdi-arrow-collapse-down")
        sortByDate.classList.remove("mdi-arrow-collapse-up")
      } else {
        sortByDate.classList.remove("mdi-arrow-collapse-down")
        sortByDate.classList.add("mdi-arrow-collapse-up")
      }
      this.posts = [...this.posts].sort((a, b) => new Date(a.pubDate._text).toLocaleString() > new Date(b.pubDate._text).toLocaleString() ? 1 : -1);
    } else {
      if(sortByDate.classList.contains('mdi-arrow-collapse-up')) {
        sortByDate.classList.remove("mdi-arrow-collapse-up")
        sortByDate.classList.add("mdi-arrow-collapse-down")
      } else {
        sortByDate.classList.remove("mdi-arrow-collapse-down")
        sortByDate.classList.add("mdi-arrow-collapse-up")
      }
      this.posts = [...this.posts].sort((a, b) => new Date(a.pubDate._text).toLocaleString() > new Date(b.pubDate._text).toLocaleString() ? -1 : 1);
    }
    this.iterationAnPosts();
  }
}
const posts = new Posts();
posts.getPosts();


tableBody.addEventListener("click", (e) => {
  posts.getOnePost(+e.target.childNodes[0].parentNode.parentNode.id);
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
sortByTitle.addEventListener("click", () => posts.sortingByTitle());
sortByDate.addEventListener("click", () => posts.sortingByDate());
