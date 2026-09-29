async function loadAdminProfile() {

    const profileContainer =
        document.getElementById("adminProfile");

    if (!profileContainer) {
        return;
    }


    // =====================================================
    // GET ADMIN TOKEN
    // =====================================================

    const adminToken =
        localStorage.getItem("adminToken");


    // No token means the admin is not logged in
    if (!adminToken) {

        console.error("No admin token found.");

        return;
    }


    // =====================================================
    // CREATE PROFILE HTML
    // =====================================================

    profileContainer.innerHTML = `

        <!-- Admin Profile -->
        <div class="admin-profile-container">

            <button
                class="admin-profile"
                id="adminProfileButton"
                type="button"
            >

                <div
                    class="profile-picture"
                    id="profileInitials"
                >
                    ...
                </div>

                <div class="profile-info">

                    <strong id="profileName">
                        Loading...
                    </strong>

                    <span id="profileRole">
                        Loading...
                    </span>

                </div>

                <span class="profile-arrow">
                    âŒ„
                </span>

            </button>


            <!-- Profile Dropdown -->
            <div
                class="profile-dropdown"
                id="profileDropdown"
            >

                <!-- User information -->

                <div class="dropdown-header">

                    <div
                        class="profile-picture large"
                        id="dropdownInitials"
                    >
                        ...
                    </div>

                    <div class="dropdown-user-info">

                        <strong id="dropdownName">
                            Loading...
                        </strong>

                        <span id="dropdownRole">
                            Loading...
                        </span>

                    </div>

                </div>


                <div class="dropdown-divider"></div>


                <!-- My Profile -->

                <a
                    href="#"
                    class="dropdown-item"
                    id="myProfileButton"
                >
                    <span>ðŸ‘¤</span>
                    <span>My Profile</span>
                </a>


                <!-- Account Settings -->

                <a
                    href="pages/settings.html"
                    class="dropdown-item"
                >
                    <span>âš™ï¸</span>
                    <span>Account Settings</span>
                </a>


                <div class="dropdown-divider"></div>


                <!-- Logout -->

                <a
                    href="#"
                    class="dropdown-item logout-item"
                    id="logoutButton"
                >
                    <span>ðŸšª</span>
                    <span>Logout</span>
                </a>

            </div>

        </div>


        <!-- Profile Modal -->

        <div
            class="profile-modal"
            id="profileModal"
        >

            <div class="profile-modal-content">

                <div class="profile-modal-header">

                    <h3>
                        My Profile
                    </h3>

                    <button
                        class="close-profile-modal"
                        id="closeProfileModal"
                        type="button"
                    >
                        Ã—
                    </button>

                </div>


                <div class="profile-modal-body">

                    <div
                        class="profile-modal-picture"
                        id="modalInitials"
                    >
                        ...
                    </div>


                    <div class="profile-detail">

                        <span>
                            Full Name
                        </span>

                        <strong id="modalName">
                            Loading...
                        </strong>

                    </div>


                    <div class="profile-detail">

                        <span>
                            Email
                        </span>

                        <strong id="modalEmail">
                            Loading...
                        </strong>

                    </div>


                    <div class="profile-detail">

                        <span>
                            Role
                        </span>

                        <strong id="modalRole">
                            Loading...
                        </strong>

                    </div>

                </div>


                <div class="profile-modal-footer">

                    <button
                        class="secondary-button"
                        id="closeProfileModalButton"
                        type="button"
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>

    `;


    // =====================================================
    // GET ELEMENTS
    // =====================================================

    const profileButton =
        document.getElementById("adminProfileButton");

    const profileDropdown =
        document.getElementById("profileDropdown");

    const myProfileButton =
        document.getElementById("myProfileButton");

    const profileModal =
        document.getElementById("profileModal");

    const closeProfileModal =
        document.getElementById("closeProfileModal");

    const closeProfileModalButton =
        document.getElementById(
            "closeProfileModalButton"
        );

    const logoutButton =
        document.getElementById("logoutButton");


    // =====================================================
    // GET PROFILE DATA FROM BACKEND
    // =====================================================

    try {

        const response = await fetch(
            "http://localhost:5000/api/admin/profile",
            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${adminToken}`
                }
            }
        );


        const data = await response.json();


        // -------------------------------------------------
        // Authentication failed
        // -------------------------------------------------

        if (!response.ok) {

            console.error(
                "Profile request failed:",
                data.message
            );

            return;
        }


        // -------------------------------------------------
        // REAL ADMIN DATA
        // -------------------------------------------------

        const admin = data;


        console.log(
            "Admin profile loaded:",
            admin
        );


        // =================================================
        // CREATE INITIALS
        // =================================================

        const nameParts =
            admin.full_name.trim().split(" ");


        let initials = "";


        if (nameParts.length === 1) {

            initials =
                nameParts[0].substring(0, 2);

        } else {

            initials =
                nameParts[0].charAt(0) +
                nameParts[nameParts.length - 1].charAt(0);

        }


        initials = initials.toUpperCase();


        // =================================================
        // UPDATE PROFILE
        // =================================================

        document.getElementById(
            "profileInitials"
        ).textContent = initials;


        document.getElementById(
            "profileName"
        ).textContent = admin.full_name;


        document.getElementById(
            "profileRole"
        ).textContent = admin.role;


        // =================================================
        // UPDATE DROPDOWN
        // =================================================

        document.getElementById(
            "dropdownInitials"
        ).textContent = initials;


        document.getElementById(
            "dropdownName"
        ).textContent = admin.full_name;


        document.getElementById(
            "dropdownRole"
        ).textContent = admin.role;


        // =================================================
        // UPDATE PROFILE MODAL
        // =================================================

        document.getElementById(
            "modalInitials"
        ).textContent = initials;


        document.getElementById(
            "modalName"
        ).textContent = admin.full_name;


        document.getElementById(
            "modalEmail"
        ).textContent = admin.email;


        document.getElementById(
            "modalRole"
        ).textContent = admin.role;


    } catch (error) {

        console.error(
            "Unable to load admin profile:",
            error
        );

    }


    // =====================================================
    // PROFILE DROPDOWN
    // =====================================================

    profileButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            profileDropdown.classList.toggle("show");

        }
    );


    // Close dropdown when clicking outside

    document.addEventListener(
        "click",
        function (event) {

            if (
                !profileButton.contains(event.target) &&
                !profileDropdown.contains(event.target)
            ) {

                profileDropdown.classList.remove("show");

            }

        }
    );


    // =====================================================
    // MY PROFILE MODAL
    // =====================================================

    myProfileButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            profileDropdown.classList.remove("show");

            profileModal.classList.add("show");

        }
    );


    // Close modal with X

    closeProfileModal.addEventListener(
        "click",
        function () {

            profileModal.classList.remove("show");

        }
    );


    // Close modal with Close button

    closeProfileModalButton.addEventListener(
        "click",
        function () {

            profileModal.classList.remove("show");

        }
    );


    // Close modal when clicking outside

    profileModal.addEventListener(
        "click",
        function (event) {

            if (event.target === profileModal) {

                profileModal.classList.remove("show");

            }

        }
    );


    // =====================================================
    // LOGOUT
    // =====================================================

    logoutButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            profileDropdown.classList.remove("show");

            localStorage.removeItem("adminToken");

            window.location.href =
                "../mainpage/customerRegistration/admin-login.html";

        }
    );

}