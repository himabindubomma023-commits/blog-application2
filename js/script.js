// ===============================
// HOME PAGE BLOGS
// ===============================

const homeBlogContainer =
    document.querySelector(".blog-container");


if (homeBlogContainer) {

    fetch("/api/blogs")

        .then(response => {

            if (!response.ok) {
                throw new Error("Unable to fetch blogs");
            }

            return response.json();

        })

        .then(blogs => {

            // Remove the old sample blogs
            homeBlogContainer.innerHTML = "";


            // Check if there are no blogs
            if (blogs.length === 0) {

                homeBlogContainer.innerHTML =
                    "<p>No blogs available.</p>";

                return;
            }


            // Display every blog
            blogs.forEach(blog => {

                const card =
                    document.createElement("div");


                card.className =
                    "blog-card";


                card.innerHTML = `

                    <div class="blog-content">

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

            console.error(
                "Error loading blogs:",
                error
            );


            homeBlogContainer.innerHTML =
                "<p>Unable to load blogs.</p>";

        });

}