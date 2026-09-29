// =====================================================
// SETTINGS.JS
// StoneHub Admin Settings
// =====================================================


// =====================================================
// PROFILE FORM
// =====================================================

const profileForm =
    document.getElementById("profileForm");


profileForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const name =
            document.getElementById("adminName").value.trim();

        const email =
            document.getElementById("adminEmail").value.trim();

        const phone =
            document.getElementById("adminPhone").value.trim();


        if (!name || !email) {

            alert("Please fill in your name and email.");

            return;

        }


        alert("Profile changes are ready to be saved.");

    }
);


// =====================================================
// PASSWORD FORM
// =====================================================

const passwordForm =
    document.getElementById("passwordForm");


passwordForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const currentPassword =
            document.getElementById("currentPassword").value;

        const newPassword =
            document.getElementById("newPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        if (!currentPassword ||
            !newPassword ||
            !confirmPassword) {

            alert("Please complete all password fields.");

            return;

        }


        if (newPassword.length < 8) {

            alert(
                "Your new password must be at least 8 characters long."
            );

            return;

        }


        if (newPassword !== confirmPassword) {

            alert(
                "The new passwords do not match."
            );

            return;

        }


        alert(
            "Password change is ready to be processed."
        );


        passwordForm.reset();

    }
);


// =====================================================
// NOTIFICATION SETTINGS
// =====================================================

const notificationInputs = [

    document.getElementById(
        "orderNotifications"
    ),

    document.getElementById(
        "reviewNotifications"
    ),

    document.getElementById(
        "paymentNotifications"
    )

];


notificationInputs.forEach(
    function (input) {

        input.addEventListener(
            "change",
            function () {

                if (this.checked) {

                    console.log(
                        `${this.id} enabled`
                    );

                } else {

                    console.log(
                        `${this.id} disabled`
                    );

                }

            }
        );

    }
);


// =====================================================
// STORE SETTINGS
// =====================================================

const storeForm =
    document.getElementById("storeForm");


storeForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const storeName =
            document.getElementById("storeName")
                .value
                .trim();

        const storeEmail =
            document.getElementById("storeEmail")
                .value
                .trim();

        const storePhone =
            document.getElementById("storePhone")
                .value
                .trim();

        const currency =
            document.getElementById("currency")
                .value;


        if (!storeName || !storeEmail) {

            alert(
                "Please enter the store name and email."
            );

            return;

        }


        console.log({
            storeName,
            storeEmail,
            storePhone,
            currency
        });


        alert(
            "Store settings are ready to be saved."
        );

    }
);


// =====================================================
// PASSWORD VISIBILITY HELPER
// =====================================================

function createPasswordToggle(inputId) {

    const input =
        document.getElementById(inputId);


    if (!input) {
        return;
    }


    const button =
        document.createElement("button");


    button.type = "button";

    button.textContent = "Show";

    button.className =
        "password-toggle";


    input.parentElement.appendChild(button);


    button.addEventListener(
        "click",
        function () {

            if (input.type === "password") {

                input.type = "text";

                button.textContent = "Hide";

            } else {

                input.type = "password";

                button.textContent = "Show";

            }

        }
    );

}


createPasswordToggle("currentPassword");

createPasswordToggle("newPassword");

createPasswordToggle("confirmPassword");