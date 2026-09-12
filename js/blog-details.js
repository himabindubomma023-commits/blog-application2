// Get the blog ID from the URL
const params = new URLSearchParams(window.location.search);
const blogId = params.get("id");

const blogDetails = document.getElementById("blogDetails");

if (!blogId) {
    blogDetails.innerHTML = "<p>Blog not found.</p>";
} else {

    // Fetch the selected blog
    fetch(`http://localhost:3000/api/blogs/${blogId}`)
        .then(response => {

            if (!response.ok) {
                throw new Error("Blog not found");
            }

            return response.json();
        })
        .then(blog => {

            blogDetails.innerHTML = `
                <h1>${blog.title}</h1>

                <p>
                    <strong>Category:</strong>
                    ${blog.category}
                </p>

                <p>
                    <strong>Author:</strong>
                    ${blog.author || "Unknown"}
                </p>

                <hr>

                <p>
                    ${blog.content}
                </p>

                <br>

                <a href="dashboard.html" class="btn">
                    ← Back to Dashboard
                </a>
            `;
        })
        .catch(error => {

            console.error("Error:", error);

            blogDetails.innerHTML =
                "<p>Unable to load this blog.</p>";
        });
}