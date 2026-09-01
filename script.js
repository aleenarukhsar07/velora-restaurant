/* =====================================
   MOBILE NAVIGATION
===================================== */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", function () {

        navMenu.classList.toggle("show");

        const icon = menuToggle.querySelector("i");

        if (navMenu.classList.contains("show")) {

            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");

        } else {

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        }

    });

}


/* =====================================
   CLOSE MOBILE MENU AFTER CLICKING LINK
===================================== */

const navLinks = document.querySelectorAll("#navMenu a");

navLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        if (navMenu) {
            navMenu.classList.remove("show");
        }

        if (menuToggle) {

            const icon = menuToggle.querySelector("i");

            if (icon) {

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

            }

        }

    });

});


/* =====================================
   ACTIVE NAVIGATION LINK
===================================== */

window.addEventListener("scroll", function () {

    const sections = document.querySelectorAll("section[id]");

    const scrollPosition = window.scrollY + 150;

    sections.forEach(function (section) {

        const sectionTop = section.offsetTop;

        const sectionHeight = section.offsetHeight;

        const sectionId = section.getAttribute("id");


        if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight
        ) {

            navLinks.forEach(function (link) {

                link.classList.remove("active");

            });


            const activeLink = document.querySelector(
                '#navMenu a[href="#' + sectionId + '"]'
            );


            if (activeLink) {

                activeLink.classList.add("active");

            }

        }

    });

});


/* =====================================
   MENU TABS
===================================== */

const tabButtons =
    document.querySelectorAll(".tab-btn");

const menuCards =
    document.querySelectorAll(".menu-card");


tabButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        /* Remove active class from all tabs */

        tabButtons.forEach(function (btn) {

            btn.classList.remove("active");

        });


        /* Add active class to selected tab */

        button.classList.add("active");


        /* Get selected category */

        const category =
            button.getAttribute("data-category");


        /* Filter menu cards */

        menuCards.forEach(function (card) {

            const cardCategory =
                card.getAttribute("data-category");


            if (
                category === "all" ||
                category === cardCategory
            ) {

                card.classList.remove("hidden");

            } else {

                card.classList.add("hidden");

            }

        });

    });

});


/* =====================================
   RESERVATION DATE
===================================== */

const dateInput =
    document.getElementById("date");


if (dateInput) {

    /* Get today's date */

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1).padStart(2, "0");

    const day =
        String(today.getDate()).padStart(2, "0");


    const currentDate =
        `${year}-${month}-${day}`;


    /* Prevent selecting past dates */

    dateInput.setAttribute(
        "min",
        currentDate
    );

}


/* =====================================
   RESERVATION FORM
   MONGODB API CONNECTION
===================================== */

const reservationForm =
    document.getElementById("reservationForm");

const successMessage =
    document.getElementById("successMessage");


if (reservationForm) {

    reservationForm.addEventListener(
        "submit",
        async function (event) {

            /* Prevent normal form submission */

            event.preventDefault();


            /* =====================================
               GET FORM VALUES
            ===================================== */

            const name =
                document.getElementById("name")
                    .value
                    .trim();


            const phone =
                document.getElementById("phone")
                    .value
                    .trim();


            const email =
                document.getElementById("email")
                    .value
                    .trim();


            const guests =
                document.getElementById("guests")
                    .value;


            const date =
                document.getElementById("date")
                    .value;


            const time =
                document.getElementById("time")
                    .value;


            const table =
                document.getElementById("table")
                    .value;


            const message =
                document.getElementById("message")
                    .value
                    .trim();


            /* =====================================
               BASIC VALIDATION
            ===================================== */

            if (
                name === "" ||
                phone === "" ||
                email === "" ||
                guests === "" ||
                date === "" ||
                time === ""
            ) {

                alert(
                    "Please fill all required fields."
                );

                return;

            }


            /* =====================================
               EMAIL VALIDATION
            ===================================== */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                alert(
                    "Please enter a valid email address."
                );

                return;

            }


            /* =====================================
               PHONE VALIDATION
            ===================================== */

            const phonePattern =
                /^[0-9+\-\s()]{10,20}$/;


            if (!phonePattern.test(phone)) {

                alert(
                    "Please enter a valid phone number."
                );

                return;

            }


            /* =====================================
               GET SUBMIT BUTTON
            ===================================== */

            const button =
                reservationForm.querySelector(
                    ".reserve-btn"
                );


            /* Disable button */

            button.disabled = true;


            button.innerHTML =
                '<i class="fas fa-spinner fa-spin"></i> Submitting...';


            try {

                /* =====================================
                   SEND DATA TO NODE.JS API
                ===================================== */

                const response = await fetch(
                    "/api/reservations",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            name: name,

                            phone: phone,

                            email: email,

                            guests: Number(guests),

                            date: date,

                            time: time,

                            table:
                                table ||
                                "No preference",

                            message:
                                message ||
                                ""

                        })

                    }
                );


                /* =====================================
                   GET SERVER RESPONSE
                ===================================== */

                const result =
                    await response.json();


                console.log(
                    "API Response:",
                    result
                );


                /* =====================================
                   CHECK RESPONSE
                ===================================== */

                if (
                    !response.ok ||
                    !result.success
                ) {

                    throw new Error(
                        result.message ||
                        "Reservation failed."
                    );

                }


                /* =====================================
                   RESERVATION SUCCESS
                ===================================== */

                console.log(
                    "Reservation saved successfully."
                );


                console.log(
                    "Reservation ID:",
                    result.reservationId
                );


                /* Show success message */

                successMessage.classList.add("show");


                /* Change button */

                button.innerHTML =
                    '<i class="fas fa-check"></i> Reservation Submitted';


                button.style.background =
                    "#287a45";


                /* Scroll to success message */

                successMessage.scrollIntoView({

                    behavior: "smooth",

                    block: "center"

                });


                /* =====================================
                   RESET FORM AFTER 5 SECONDS
                ===================================== */

                setTimeout(function () {

                    reservationForm.reset();


                    button.disabled = false;


                    button.innerHTML =
                        'Confirm Reservation <i class="fas fa-arrow-right"></i>';


                    button.style.background = "";


                    successMessage.classList.remove(
                        "show"
                    );

                }, 5000);


            } catch (error) {

                /* =====================================
                   ERROR HANDLING
                ===================================== */

                console.error(
                    "Reservation Error:",
                    error
                );


                alert(
                    "Reservation could not be submitted. Please try again."
                );


                /* Enable button again */

                button.disabled = false;


                button.innerHTML =
                    'Confirm Reservation <i class="fas fa-arrow-right"></i>';


                button.style.background = "";

            }

        }
    );

}


/* =====================================
   SCROLL REVEAL EFFECT
===================================== */

const revealElements =
    document.querySelectorAll(
        ".menu-card, .service-card, .stat-box, .about-content, .about-box"
    );


if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.style.opacity =
                                "1";

                            entry.target.style.transform =
                                "translateY(0)";

                        }

                    }
                );

            },
            {
                threshold: 0.1
            }
        );


    revealElements.forEach(
        function (element) {

            element.style.opacity = "0";

            element.style.transform =
                "translateY(25px)";

            element.style.transition =
                "opacity 0.7s ease, transform 0.7s ease";


            revealObserver.observe(element);

        }
    );

} else {

    /* Fallback for older browsers */

    revealElements.forEach(
        function (element) {

            element.style.opacity = "1";

            element.style.transform =
                "translateY(0)";

        }
    );

}