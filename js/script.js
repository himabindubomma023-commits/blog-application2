// ===============================
// HOME PAGE BLOGS
// ===============================

const homeBlogContainer = document.querySelector(".blog-container");

if (homeBlogContainer) {

    fetch("/api/blogs")
        .then(response => {

            if (!response.ok) {
                throw new Error("Unable to fetch blogs");
            }

            return response.json();
        })

        .then(blogs => {

            homeBlogContainer.innerHTML = "";

            if (blogs.length === 0) {

                homeBlogContainer.innerHTML =
                    "<p>No blogs available.</p>";

                return;
            }

            blogs.forEach(blog => {

                const card = document.createElement("div");

                card.className = "blog-card";

                card.innerHTML = `
                    <div class="blog-content">

                        <h3>${blog.title}</h3>

                        <p>
                            <strong>Category:</strong>
                            ${blog.category}
                        </p>

                        <p>${blog.content}</p>

                        <p>
                            <strong>Author:</strong>
                            ${blog.author}
                        </p>

                        <a
                            href="blog-details.html?id=${blog._id}"
                            class="read-more"
                        >
                            Read More
                        </a>

                    </div>
                `;

                homeBlogContainer.appendChild(card);
            });
        })

        .catch(error => {

            console.error("Error loading blogs:", error);

            homeBlogContainer.innerHTML =
                "<p>Unable to load blogs.</p>";
        });
}


// ===============================
// LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        try {

            const response = await fetch("/api/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {

                alert(data.message || "Login failed");

                return;
            }

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            alert("Login successful!");

            window.location.href = "dashboard.html";

        } catch (error) {

            console.error("Login error:", error);

            alert("Unable to connect to server");
        }
    });
}