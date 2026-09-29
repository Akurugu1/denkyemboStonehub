document.addEventListener("DOMContentLoaded", () => {


    const signupForm = document.getElementById("signupForm");

    const errorMessage = document.getElementById("errorMessage");



    signupForm.addEventListener("submit", async (e)=>{


        e.preventDefault();



        const first_name =
        document.getElementById("first_name").value.trim();


        const last_name =
        document.getElementById("last_name").value.trim();


        const email =
        document.getElementById("email").value.trim();


        const phone_number =
        document.getElementById("phone_number").value.trim();


        const address =
        document.getElementById("address").value.trim();


        const password =
        document.getElementById("password").value;



        const passwordAgain =
        document.getElementById("password_again").value;



        if(password !== passwordAgain){

            errorMessage.textContent =
            "Passwords do not match.";

            return;

        }



        try{


            const response = await fetch(

                "http://localhost:5000/api/auth/register",

                {

                    method:"POST",

                    headers:{

                        "Content-Type":"application/json"

                    },


                    body:JSON.stringify({

                        first_name,
                        last_name,
                        email,
                        phone_number,
                        address,
                        password

                    })

                }

            );



            const data = await response.json();



            console.log(
                "Registration response:",
                data
            );



            if(response.ok){


                alert("Registration successful!");


                window.location.href="login.html";


            }
            else{


                errorMessage.textContent =
                data.message || "Registration failed.";

            }



        }
        catch(error){


            console.error(error);


            errorMessage.textContent =
            "Unable to connect to server.";


        }



    });


});