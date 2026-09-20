// ==========================================
// SCRIPT.JS
// LOGIN + CREATE BLOG + HOME BLOGS
// ==========================================


// ==========================================
// LOGIN
// ==========================================

const loginForm =
    document.getElementById("loginForm");

console.log("LOGIN JS LOADED");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("loginPassword")
                    .value;

            try {

                const response =
                    await fetch(
                        "/api/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    email: email,
                                    password: password
                                })
                        }
                    );

                const data =
                    await response.json();

                console.log(
                    "LOGIN RESPONSE:",
                    data
                );

                if (!response.ok) {

                    alert(
                        data.message ||
                        "Login failed"
                    );

                    return;
                }

                if (!data.token) {

                    alert(
                        "Login successful, but token was not received."
                    );

                    return;
                }

                // Save JWT token
                localStorage.setItem(
                    "token",
                    data.token
                );

                // Save user information
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                console.log(
                    "TOKEN SAVED:",
                    localStorage.getItem("token")
                );

                window.location.href =
                    "dashboard.html";

            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );

                alert(
                    "Unable to connect to server"
                );
            }
        }
    );
}


// ==========================================
// CREATE BLOG
// ==========================================

const blogForm =
    document.getElementById("blogForm");


// ==========================================
// PROTECT CREATE BLOG PAGE
// ==========================================

const createBlogToken =
    localStorage.getItem("token");

const createBlogUser =
    localStorage.getItem("user");

if (
    blogForm &&
    (!createBlogToken || !createBlogUser)
) {

    window.location.href =
        "login.html";
}


// ==========================================
// CREATE BLOG FORM
// ==========================================

if (blogForm) {

    blogForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const token =
                localStorage.getItem("token");

            const user =
                localStorage.getItem("user");

            if (!token || !user) {

                alert(
                    "Please login first."
                );

                window.location.href =
                    "login.html";

                return;
            }

            let userData;

            try {

                userData =
                    JSON.parse(user);

            } catch (error) {

                alert(
                    "User information is invalid. Please login again."
                );

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                window.location.href =
                    "login.html";

                return;
            }

            const title =
                document
                    .getElementById("blogTitle")
                    .value
                    .trim();

            const category =
                document
                    .getElementById("blogCategory")
                    .value;

            const content =
                document
                    .getElementById("blogContent")
                    .value
                    .trim();

            if (!title || !category || !content) {

                alert(
                    "Please fill all required fields."
                );

                return;
            }

            try {

                const response =
                    await fetch(
                        "/api/blogs",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    "Bearer " +
                                    token
                            },

                            body:
                                JSON.stringify({
                                    title:
                                        title,

                                    category:
                                        category,

                                    content:
                                        content,

                                    author:
                                        userData.name
                                })
                        }
                    );

                const data =
                    await response.json();

                console.log(
                    "CREATE BLOG RESPONSE:",
                    data
                );

                if (!response.ok) {

                    alert(
                        data.message ||
                        "Unable to create blog."
                    );

                    return;
                }

                alert(
                    "Blog published successfully!"
                );

                window.location.href =
                    "dashboard.html";

            } catch (error) {

                console.error(
                    "Create blog error:",
                    error
                );

                alert(
                    "Unable to connect to server."
                );
            }
        }
    );
}


// ==========================================
// HOME PAGE - LOAD ALL BLOGS
// ==========================================

const homeBlogContainer =
    document.querySelector(
        ".blog-container"
    );


// Do not run Home-page code on Dashboard
if (
    homeBlogContainer &&
    !document.getElementById("blogContainer")
) {

    fetch("/api/blogs")
        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Unable to fetch blogs"
                );
            }

            return response.json();
        })
        .then(function (blogs) {

            homeBlogContainer.innerHTML = "";

            if (blogs.length === 0) {

                homeBlogContainer.innerHTML =
                    "<p>No blogs available.</p>";

                return;
            }

            blogs.forEach(
                function (blog) {

                    const blogCard =
                        document.createElement(
                            "div"
                        );

                    blogCard.className =
                        "blog-card";

                    blogCard.innerHTML = `
                        <h3>
                            ${blog.title}
                        </h3>

                        <p>
                            <strong>Category:</strong>
                            ${blog.category}
                        </p>

                        <p>
                            ${blog.content}
                        </p>

                        <p>
                            <strong>Author:</strong>
                            ${blog.author || "Unknown"}
                        </p>
                    `;

                    homeBlogContainer.appendChild(
                        blogCard
                    );
                }
            );
        })
        .catch(function (error) {

            console.error(
                "Error fetching blogs:",
                error
            );

            homeBlogContainer.innerHTML =
                "<p>Unable to load blogs.</p>";
        });
}