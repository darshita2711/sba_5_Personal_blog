const postForm = document.getElementById("postForm");
const titleInput = document.getElementById("titleInput");
const contentInput = document.getElementById("contentInput");

const titleerr = document.getElementById("titleError");
const contenterr = document.getElementById("contentError");
const postcontainer = document.getElementById("postContainer");

let posts =[];
let editingPostId = null;

const savePosts = localStorage.getItem("posts");

if(savePosts){
    posts = JSON.parse(savePosts);
    allPosts();
}

function allPosts(){
    postcontainer.innerHTML = "";
    for(let i=0;i<posts.length;i++){
        const postDiv = document.createElement("div");
        postDiv.className ="post";

        postDiv.innerHTML = `
            <h3>${posts[i].title}</h3>
            <p>${posts[i].content}</p>
            <small>${posts[i].timestamp}</small>
        `;
        const editButton = createEditButton(i);
        const deleteButton = createDeleteButton(i);
    
        postDiv.appendChild(editButton);
        postDiv.appendChild(deleteButton);
        postcontainer.appendChild(postDiv);
    }
}

function createDeleteButton(i) {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "deleteBtn";

    deleteButton.addEventListener("click", function() {
        posts.splice(i, 1);
        localStorage.setItem("posts", JSON.stringify(posts));
        allPosts();
    });
    return deleteButton;
}

function createEditButton(i) {
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";

    editButton.addEventListener("click", function() {
        titleInput.value = posts[i].title;
        contentInput.value = posts[i].content;
        editingPostId = posts[i].id;
    });
    return editButton;
}

function updatePost(title, content) {
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === editingPostId) {
            posts[i].title = title;
            posts[i].content = content;
        }
    }

    editingPostId = null;
}

function createPost(title, content) {
    const newPost = {
        id: Date.now(),
        title: title,
        content: content,
        timestamp: new Date().toLocaleString()
    };

    posts.push(newPost);
}
postForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    // Clear errors
    titleerr.textContent = "";
    contenterr.textContent = "";

    // Validate title and content
    if (title === "" || content === "") {
        titleerr.textContent = "Please fill in all required fields!";
        return;
    }
    
    if (editingPostId !== null) {
        updatePost(title, content);
    } else {
        createPost(title, content);
    }
    localStorage.setItem("posts", JSON.stringify(posts))
    allPosts();
    postForm.reset();
});