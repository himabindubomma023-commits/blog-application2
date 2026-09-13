// Fetch all blogs from the backend
fetch("http://localhost:3000/api/blogs")
    .then(response => response.json())
    .then(blogs => {

        const blogContainer = document.getElementById("blogContainer");
        const searchInput = document.getElementById("searchInput");

        // Function to display blogs
        function displayBlogs(blogsToDisplay) {

            // Clear blog container
            blogContainer.innerHTML = "";

            // If no blogs are available
            if (blogsToDisplay.length === 0) {
                blogContainer.innerHTML = "<p>No blogs found.</p>";
                return;
            }

            // Display each blog
            blogsToDisplay.forEach(blog => {

                const blogCard = document.createElement("div");

                blogCard.className = "blog-card";

                blogCard.innerHTML = `
                    <h3>${blog.title}</h3>

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

                    <div class="blog-actions">

                        <button class="edit-btn">
                            Edit
                        </button>

                        <button class="delete-btn">
                            Delete
                        </button>

                    </div>
                `;

                // Make blog clickable
                blogCard.style.cursor = "pointer";

                blogCard.addEventListener("click", function () {

                    window.location.href =
                        "blog-details.html?id=" + blog._id;

                });


                // =========================
                // EDIT BLOG
                // =========================

                const editButton =
                    blogCard.querySelector(".edit-btn");

                editButton.addEventListener("click", async function (event) {

                    // Prevent opening blog details
                    event.stopPropagation();

                    const newTitle = prompt(
                        "Enter new title:",
                        blog.title
                    );

                    if (newTitle === null) {
                        return;
                    }

                    const newCategory = prompt(
                        "Enter new category:",
                        blog.category
                    );

                    if (newCategory === null) {
                        return;
                    }

                    const newContent = prompt(
                        "Enter new content:",
                        blog.content
                    );

                    if (newContent === null) {
                        return;
                    }

                    try {

                        const response = await fetch(
                            "http://localhost:3000/api/blogs/" + blog._id,
                            {
                                method: "PUT",

                                headers: {
                                    "Content-Type": "application/json"
                                },

                                body: JSON.stringify({
                                    title: newTitle,
                                    category: newCategory,
                                    content: newContent
                                })
                            }
                        );

                        const data = await response.json();

                        if (response.ok) {

                            alert("Blog updated successfully!");

                            location.reload();

                        } else {

                            alert(
                                data.message ||
                                "Blog update failed."
                            );

                        }

                    } catch (error) {

                        console.error(error);

                        alert(
                            "Unable to update blog."
                        );
                    }

                });


                // =========================
                // DELETE BLOG
                // =========================

                const deleteButton =
                    blogCard.querySelector(".delete-btn");

                deleteButton.addEventListener("click", async function (event) {

                    // Prevent opening blog details
                    event.stopPropagation();

                    const confirmDelete = confirm(
                        "Are you sure you want to delete this blog?"
                    );

                    if (!confirmDelete) {
                        return;
                    }

                    try {

                        const response = await fetch(
                            "http://localhost:3000/api/blogs/" + blog._id,
                            {
                                method: "DELETE"
                            }
                        );

                        const data = await response.json();

                        if (response.ok) {

                            alert("Blog deleted successfully!");

                            location.reload();

                        } else {

                            alert(
                                data.message ||
                                "Blog deletion failed."
                            );

                        }

                    } catch (error) {

                        console.error(error);

                        alert(
                            "Unable to delete blog."
                        );
                    }

                });


                blogContainer.appendChild(blogCard);

            });
        }


        // Display all blogs initially
        displayBlogs(blogs);


        // =========================
        // SEARCH BLOGS
        // =========================

        searchInput.addEventListener("input", function () {

            const searchText =
                searchInput.value.toLowerCase().trim();

            const filteredBlogs = blogs.filter(blog => {

                const title =
                    (blog.title || "").toLowerCase();

                const content =
                    (blog.content || "").toLowerCase();

                return (
                    title.includes(searchText) ||
                    content.includes(searchText)
                );

            });

            displayBlogs(filteredBlogs);

        });

    })
    .catch(error => {

        console.error(
            "Error fetching blogs:",
            error
        );

        const blogContainer =
            document.getElementById("blogContainer");

        blogContainer.innerHTML =
            "<p>Unable to load blogs. Please try again.</p>";
    });