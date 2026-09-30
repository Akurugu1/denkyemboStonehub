/* =========================================================
   STONEHUB REVIEWS
   ========================================================= */


/* =========================================================
   1. REVIEW DATA
   ========================================================= */

let reviews = [];


/* =========================================================
   2. GET HTML ELEMENTS
   ========================================================= */

const tableBody =
    document.getElementById("reviewsTableBody");


const reviewModal =
    document.getElementById("reviewModal");


const reviewDetails =
    document.getElementById("reviewDetails");


const closeReviewModal =
    document.getElementById("closeReviewModal");

const averageRating =
    document.getElementById("averageRating");


const totalReviews =
    document.getElementById("totalReviews");


const positiveReviews =
    document.getElementById("positiveReviews");


const pendingReviews =
    document.getElementById("pendingReviews");


function updateReviewStats() {

    const total =
        reviews.length;


    /*
     * TOTAL REVIEWS
     */

    totalReviews.textContent =
        total;


    /*
     * If there are no reviews,
     * reset the other cards.
     */

    if (total === 0) {

        averageRating.textContent =
            "0 / 5";

        positiveReviews.textContent =
            "0%";

        pendingReviews.textContent =
            "0";

        return;

    }


    /*
     * AVERAGE RATING
     */

    const totalRating =
        reviews.reduce(
            function (sum, review) {

                return sum + review.rating;

            },
            0
        );


    const average =
        totalRating / total;


    averageRating.textContent =
        `${average.toFixed(1)} / 5`;


    /*
     * POSITIVE REVIEWS
     *
     * We consider ratings of 4 or 5
     * to be positive.
     */

    const positiveCount =
        reviews.filter(
            function (review) {

                return review.rating >= 4;

            }
        ).length;


    const positivePercentage =
        (positiveCount / total) * 100;


    positiveReviews.textContent =
        `${Math.round(positivePercentage)}%`;


    /*
     * PENDING REVIEWS
     */

    const pendingCount =
        reviews.filter(
            function (review) {

                return review.status === "Pending";

            }
        ).length;


    pendingReviews.textContent =
        pendingCount;

}
/* =========================================================
   3. LOAD REVIEWS FROM DATABASE
   ========================================================= */

async function loadReviews() {

    try {

        const response = await fetch(
            "https://stonehub-backend-service.onrender.com/api/admin/reviews"
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load reviews"
            );

        }


        reviews = await response.json();

        updateReviewStats();
        displayReviews();


    } catch (error) {

        console.error(
            "Reviews loading error:",
            error
        );

    }

}


/* =========================================================
   4. DISPLAY REVIEWS
   ========================================================= */

function displayReviews() {

    tableBody.innerHTML = "";


    /*
     * If there are no reviews.
     */

    if (reviews.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="text-align:center; padding:30px;"
                >
                    No reviews found.
                </td>

            </tr>

        `;

        return;

    }


    /*
     * Create a row for every review.
     */

    reviews.forEach(function (review) {

        const row =
            document.createElement("tr");


        /*
         * Create the star rating.
         */

        const stars =
            "â­".repeat(review.rating);


        /*
         * Format the date.
         */

        const formattedDate =
            new Date(
                review.date_created
            ).toLocaleDateString();


        row.innerHTML = `

            <td>
                ${review.customer_name}
            </td>


            <td>
                ${stars}
            </td>


            <td>
                ${review.review_text}
            </td>


            <td>
                ${formattedDate}
            </td>


            <td>
                ${review.status}
            </td>


            <td class="review-actions">

                <button
                    type="button"
                    class="view-review"
                    data-id="${review.review_id}"
                >
                    View
                </button>


                <button
                    type="button"
                    class="approve-review"
                    data-id="${review.review_id}"
                >
                    Approve
                </button>


                <button
                    type="button"
                    class="flag-review"
                    data-id="${review.review_id}"
                >
                    Flag
                </button>


                <button
                    type="button"
                    class="delete-review"
                    data-id="${review.review_id}"
                >
                    Delete
                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


/* =========================================================
   5. VIEW REVIEW
   ========================================================= */

tableBody.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(".view-review");


        if (!button) {
            return;
        }


        const reviewId =
            Number(button.dataset.id);


        const review =
            reviews.find(function (review) {

                return review.review_id === reviewId;

            });


        if (!review) {
            return;
        }


        const stars =
            "â­".repeat(review.rating);


        const formattedDate =
            new Date(
                review.date_created
            ).toLocaleDateString();


        reviewDetails.innerHTML = `

            <p>

                <strong>
                    Customer:
                </strong>

                ${review.customer_name}

            </p>


            <p>

                <strong>
                    Product:
                </strong>

                ${review.product_name}

            </p>


            <p>

                <strong>
                    Rating:
                </strong>

                ${stars}

            </p>


            <p>

                <strong>
                    Date:
                </strong>

                ${formattedDate}

            </p>


            <p>

                <strong>
                    Status:
                </strong>

                ${review.status}

            </p>


            <p>

                <strong>
                    Review:
                </strong>

                ${review.review_text}

            </p>

        `;


        reviewModal.classList.add("active");

    }
);


/* =========================================================
   6. CLOSE REVIEW MODAL
   ========================================================= */

closeReviewModal.addEventListener(
    "click",
    function () {

        reviewModal.classList.remove("active");

    }
);


/* =========================================================
   7. CLOSE MODAL WHEN CLICKING OUTSIDE
   ========================================================= */

reviewModal.addEventListener(
    "click",
    function (event) {

        if (event.target === reviewModal) {

            reviewModal.classList.remove("active");

        }

    }
);


/* =========================================================
   8. REVIEW ADMIN ACTIONS
   ========================================================= */
    // =====================================================
// REVIEW ADMIN ACTIONS
// =====================================================

tableBody.addEventListener(
    "click",
    async function (event) {

        const button =
            event.target.closest("button");


        if (!button) {
            return;
        }


        const reviewId =
            Number(button.dataset.id);


        const review =
            reviews.find(function (review) {

                return review.review_id === reviewId;

            });


        if (!review) {
            return;
        }


        /* =================================================
           APPROVE REVIEW
           ================================================= */

        if (
            button.classList.contains(
                "approve-review"
            )
        ) {

            try {

                const response = await fetch(
                    `https://stonehub-backend-service.onrender.com/api/admin/reviews/${reviewId}/status`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            status: "Published"
                        })
                    }
                );


                if (!response.ok) {

                    throw new Error(
                        "Failed to approve review"
                    );

                }


                console.log(
                    "Review approved successfully"
                );


                await loadReviews();


            } catch (error) {

                console.error(
                    "Approve review error:",
                    error
                );


                alert(
                    "Failed to approve review."
                );

            }


            return;

        }


        /* =================================================
           FLAG REVIEW
           ================================================= */

        if (
            button.classList.contains(
                "flag-review"
            )
        ) {

            try {

                const response = await fetch(
                    `https://stonehub-backend-service.onrender.com/api/admin/reviews/${reviewId}/status`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            status: "Flagged"
                        })
                    }
                );


                if (!response.ok) {

                    throw new Error(
                        "Failed to flag review"
                    );

                }


                console.log(
                    "Review flagged successfully"
                );


                await loadReviews();


            } catch (error) {

                console.error(
                    "Flag review error:",
                    error
                );


                alert(
                    "Failed to flag review."
                );

            }


            return;

        }


        /* =================================================
           DELETE REVIEW
           ================================================= */

        if (
            button.classList.contains(
                "delete-review"
            )
        ) {

            const confirmed =
                confirm(
                    "Are you sure you want to delete this review?"
                );


            if (!confirmed) {
                return;
            }


            try {

                const response = await fetch(
                    `https://stonehub-backend-service.onrender.com/api/admin/reviews/${reviewId}`,
                    {
                        method: "DELETE"
                    }
                );


                if (!response.ok) {

                    throw new Error(
                        "Failed to delete review"
                    );

                }


                console.log(
                    "Review deleted successfully"
                );


                await loadReviews();


            } catch (error) {

                console.error(
                    "Delete review error:",
                    error
                );


                alert(
                    "Failed to delete review."
                );

            }

        }

    }
);



/* =========================================================
   9. INITIAL LOAD
   ========================================================= */

loadReviews();
