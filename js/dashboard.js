// ==========================================
// DASHBOARD.JS
// ==========================================

// CHECK LOGIN
const token = localStorage.getItem("token");
const user = localStorage.getItem("user");

if (!token || !user) {
    window.location.href = "login.html";
}

// ==========================================
// GET HTML ELEMENTS
// ==========================================

const blogContainer =
    document.getElementById("blogContainer");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const logoutBtn =
    document.getElementById("logoutBtn");

const profileName =
    document.getElementById("profileName");

const profileEmail =
    document.getElementById("profileEmail");

// ==========================================
// SHOW PROFILE
// ==========================================

try {

    const userData = JSON.parse(user);

    if (profileName) {
        profileName.textContent =
            userData.name || "User";
    }

    if (profileEmail) {
        profileEmail.textContent =
            userData.email || "";
    }

} catch (error) {

    console.error(
        "Unable to read user information:",
        error
    );
}

// ==========================================
// LOAD ONLY LOGGED-IN USER'S BLOGS
// ==========================================

async function loadBlogs() {

    try {

        const response = await fetch(
            "/api/my-blogs?t=" + Date.now(),
            {
                method: "GET",

                headers: {
                    "Authorization":
                        "Bearer " + token
                },

                cache: "no-store"
            }
        );

        const data = await response.json();

        console.log("MY BLOGS RESPONSE:", data);

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load blogs"
            );
        }

        displayBlogs(data);

        setupFilters(data);

    } catch (error) {

        console.error(
            "Error loading my blogs:",
            error
        );

        blogContainer.innerHTML =
            "<p>Unable to load blogs. Please try again.</p>";
    }
}

// ==========================================
// DISPLAY BLOGS
// ==========================================

function displayBlogs(blogs) {

    blogContainer.innerHTML = "";

    if (!blogs || blogs.length === 0) {

        blogContainer.innerHTML =
            "<p>No blogs found.</p>";

        return;
    }

    blogs.forEach(function (blog) {

        const blogCard =
            document.createElement("div");

        blogCard.className =
            "blog-card";

        blogCard.innerHTML = `
            <h3>${blog.title}</h3>

            <p>
                <strong>Category:</strong>
                ${blog.category || "Other"}
            </p>

            <p>
                ${blog.content}
            </p>

            <p>
                <strong>Author:</strong>
                ${blog.author || "Unknown"}
            </p>

            <div class="blog-actions">

                <button class="edit-btn">
                    Edit
                </button>

                <button class="delete-btn">
                    Delete
                </button>

            </div>
        `;

        // ==================================
        // OPEN BLOG DETAILS
        // ==================================

        blogCard.style.cursor = "pointer";

        blogCard.addEventListener(
            "click",
            function () {

                window.location.href =
                    "blog-details.html?id=" +
                    blog._id;
            }
        );

        // ==================================
        // EDIT BLOG
        // ==================================

        const editButton =
            blogCard.querySelector(".edit-btn");

        editButton.addEventListener(
            "click",
            async function (event) {

                event.stopPropagation();

                const newTitle =
                    prompt(
                        "Enter new title:",
                        blog.title
                    );

                if (newTitle === null) {
                    return;
                }

                const newCategory =
                    prompt(
                        "Enter new category:",
                        blog.category
                    );

                if (newCategory === null) {
                    return;
                }

                const newContent =
                    prompt(
                        "Enter new content:",
                        blog.content
                    );

                if (newContent === null) {
                    return;
                }

                try {

                    const response =
                        await fetch(
                            "/api/blogs/" +
                            blog._id,
                            {
                                method: "PUT",

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
                                            newTitle,

                                        category:
                                            newCategory,

                                        content:
                                            newContent
                                    })
                            }
                        );

                    const data =
                        await response.json();

                    if (response.ok) {

                        alert(
                            "Blog updated successfully!"
                        );

                        loadBlogs();

                    } else {

                        alert(
                            data.message ||
                            "Blog update failed."
                        );
                    }

                } catch (error) {

                    console.error(
                        "Edit error:",
                        error
                    );

                    alert(
                        "Unable to update blog."
                    );
                }
            }
        );

        // ==================================
        // DELETE BLOG
        // ==================================

        const deleteButton =
            blogCard.querySelector(".delete-btn");

        deleteButton.addEventListener(
            "click",
            async function (event) {

                event.stopPropagation();

                const confirmDelete =
                    confirm(
                        "Are you sure you want to delete this blog?"
                    );

                if (!confirmDelete) {
                    return;
                }

                try {

                    const response =
                        await fetch(
                            "/api/blogs/" +
                            blog._id,
                            {
                                method: "DELETE",

                                headers: {
                                    "Authorization":
                                        "Bearer " +
                                        token
                                }
                            }
                        );

                    const data =
                        await response.json();

                    if (response.ok) {

                        alert(
                            "Blog deleted successfully!"
                        );

                        loadBlogs();

                    } else {

                        alert(
                            data.message ||
                            "Blog deletion failed."
                        );
                    }

                } catch (error) {

                    console.error(
                        "Delete error:",
                        error
                    );

                    alert(
                        "Unable to delete blog."
                    );
                }
            }
        );

        blogContainer.appendChild(
            blogCard
        );
    });
}

// ==========================================
// SEARCH + CATEGORY FILTER
// ==========================================

function setupFilters(blogs) {

    function filterBlogs() {

        const searchText =
            searchInput.value
                .toLowerCase()
                .trim();

        const selectedCategory =
            categoryFilter.value;

        const filteredBlogs =
            blogs.filter(function (blog) {

                const title =
                    (blog.title || "")
                        .toLowerCase();

                const content =
                    (blog.content || "")
                        .toLowerCase();

                const matchesSearch =
                    title.includes(searchText) ||
                    content.includes(searchText);

                const matchesCategory =
                    selectedCategory === "all" ||
                    blog.category ===
                    selectedCategory;

                return (
                    matchesSearch &&
                    matchesCategory
                );
            });

        displayBlogs(filteredBlogs);
    }

    if (searchInput) {

        searchInput.oninput =
            filterBlogs;
    }

    if (categoryFilter) {

        categoryFilter.onchange =
            filterBlogs;
    }
}

// ==========================================
// LOGOUT
// ==========================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            localStorage.removeItem("token");

            localStorage.removeItem("user");

            window.location.href =
                "login.html";
        }
    );
}

// ==========================================
// START DASHBOARD
// ==========================================

loadBlogs();