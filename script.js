
/* ============================================================
   CONFIGURATION
============================================================ */

// Your deployed Google Apps Script Web App URL
const RSVP_GOOGLE_SCRIPT_URL =
    "YOUR_GOOGLE_APPS_SCRIPT_EXEC_URL";


/* ============================================================
   DOM
============================================================ */

const introScreen =
    document.getElementById("introScreen");

const enterInvitation =
    document.getElementById("enterInvitation");

const mainContent =
    document.getElementById("mainContent");

const weddingMusic =
    document.getElementById("weddingMusic");

const musicToggle =
    document.getElementById("musicToggle");

const rsvpForm =
    document.getElementById("rsvpForm");

const formStatus =
    document.getElementById("formStatus");

const toast =
    document.getElementById("toast");

/* ============================================================
   MUSIC VISIBILITY CONTROL
============================================================ */

let musicWasPlaying = false;
let pausedBecauseHidden = false;


/* ============================================================
   TRACK MUSIC STATE
============================================================ */

weddingMusic.addEventListener("play", () => {

    musicWasPlaying = true;

});


weddingMusic.addEventListener("pause", () => {

    /*
       Don't change musicWasPlaying when the pause
       was caused by the website becoming hidden.
    */

    if (!pausedBecauseHidden) {
        musicWasPlaying = false;
    }

});


/* ============================================================
   WEBSITE VISIBILITY
============================================================ */

document.addEventListener("visibilitychange", () => {


    /* --------------------------------------------------------
       USER LEFT THE WEBSITE
    -------------------------------------------------------- */

    if (document.hidden) {

        if (!weddingMusic.paused) {

            musicWasPlaying = true;

            pausedBecauseHidden = true;

            weddingMusic.pause();

        }

    }


    /* --------------------------------------------------------
       USER RETURNED TO THE WEBSITE
    -------------------------------------------------------- */

    else {

        if (pausedBecauseHidden && musicWasPlaying) {

            pausedBecauseHidden = false;

            weddingMusic.play().catch(() => {

                console.log(
                    "Browser requires user interaction to play music."
                );

            });

        }

    }

});
/* ============================================================
   GUEST PERSONALIZATION
============================================================ */

function getGuestName() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const guest =
        params.get("guest");

    if (!guest) {
        return "";
    }

    return decodeURIComponent(guest)
        .replace(/\+/g, " ")
        .trim();
}


function initializePersonalization() {

    const guestName =
        getGuestName();

    const displayName =
        guestName || "Guest";

    const introGuest =
        document.getElementById(
            "introGuestName"
        );

    const heroGuest =
        document.getElementById(
            "heroGuestName"
        );

    const guestInput =
        document.getElementById(
            "guestName"
        );

    if (introGuest) {
        introGuest.textContent =
            displayName;
    }

    if (heroGuest) {
        heroGuest.textContent =
            displayName;
    }

    if (guestInput && guestName) {
        guestInput.value =
            guestName;
    }
}


/* ============================================================
   ENTER INVITATION
============================================================ */

if (enterInvitation) {

    enterInvitation.addEventListener(
        "click",
        async function () {

            introScreen.classList.add(
                "hidden"
            );

            mainContent.classList.add(
                "visible"
            );

            try {

                weddingMusic.volume = 0.30;

                await weddingMusic.play();

                musicToggle.textContent =
                    "♫";

            } catch (error) {

                console.log(
                    "Music autoplay was blocked."
                );

            }

        }
    );
}


/* ============================================================
   MUSIC
============================================================ */

if (musicToggle) {

    musicToggle.addEventListener(
        "click",
        async function () {

            if (
                weddingMusic.paused
            ) {

                try {

                    await weddingMusic.play();

                    musicToggle.textContent =
                        "♫";

                } catch (error) {

                    console.error(error);

                }

            } else {

                weddingMusic.pause();

                musicToggle.textContent =
                    "♪";
            }

        }
    );
}
/* ============================================================
   GUEST NAME FROM URL
   Example:
   yourwebsite.com/?guest=Arjun
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    const guestName = params.get("to");

    const guestElement = document.getElementById("introGuestName");

    if (guestName && guestElement) {

        const name = decodeURIComponent(guestName)
            .trim()
            .replace(/\s+/g, " ");

        if (name) {
            guestElement.textContent = name;
        }
    }

});

/* ============================================================
   SCROLL REVEAL
============================================================ */

function initializeRevealAnimations() {

    const elements =
        document.querySelectorAll(
            ".reveal"
        );

    if (
        !("IntersectionObserver" in window)
    ) {

        elements.forEach(
            element => {
                element.classList.add(
                    "visible"
                );
            }
        );

        return;
    }

    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );
                        }

                    }
                );

            },
            {
                threshold: 0.15
            }
        );

    elements.forEach(
        element => {
            observer.observe(element);
        }
    );
}


/* ============================================================
   COUNTDOWN
============================================================ */

const receptionDate =
    new Date(
        "December 7, 2026 17:30:00"
    ).getTime();


function updateCountdown() {

    const now =
        new Date().getTime();

    const distance =
        receptionDate - now;

    const days =
        Math.floor(
            distance /
            (1000 * 60 * 60 * 24)
        );

    const hours =
        Math.floor(
            (distance %
                (1000 * 60 * 60 * 24)) /
                (1000 * 60 * 60)
        );

    const minutes =
        Math.floor(
            (distance %
                (1000 * 60 * 60)) /
                (1000 * 60)
        );

    const seconds =
        Math.floor(
            (distance %
                (1000 * 60)) /
                1000
        );

    const daysElement =
        document.getElementById(
            "days"
        );

    const hoursElement =
        document.getElementById(
            "hours"
        );

    const minutesElement =
        document.getElementById(
            "minutes"
        );

    const secondsElement =
        document.getElementById(
            "seconds"
        );

    if (distance > 0) {

        daysElement.textContent =
            String(days).padStart(2, "0");

        hoursElement.textContent =
            String(hours).padStart(2, "0");

        minutesElement.textContent =
            String(minutes).padStart(2, "0");

        secondsElement.textContent =
            String(seconds).padStart(2, "0");

    } else {

        daysElement.textContent =
            "00";

        hoursElement.textContent =
            "00";

        minutesElement.textContent =
            "00";

        secondsElement.textContent =
            "00";
    }
}


updateCountdown();

setInterval(
    updateCountdown,
    1000
);


/* ============================================================
   GOOGLE APPS SCRIPT RSVP
============================================================ */

async function submitRSVP(data) {

    if (
        !RSVP_GOOGLE_SCRIPT_URL ||
        RSVP_GOOGLE_SCRIPT_URL.includes(
            "YOUR_GOOGLE"
        )
    ) {

        throw new Error(
            "Google Apps Script URL is not configured."
        );
    }

    console.log(
        "Submitting RSVP:",
        data
    );

    console.log(
        "Sending to:",
        RSVP_GOOGLE_SCRIPT_URL
    );

    const formData =
        new URLSearchParams();

    formData.append(
        "name",
        data.name || ""
    );

    formData.append(
        "attendance",
        data.attendance || ""
    );

    formData.append(
        "guests",
        data.guests || "1"
    );

    formData.append(
        "message",
        data.message || ""
    );


    /*
     * no-cors is intentionally used because
     * Google Apps Script Web Apps do not provide
     * normal browser CORS handling for this request.
     */

    await fetch(
        RSVP_GOOGLE_SCRIPT_URL,
        {
            method: "POST",

            mode: "no-cors",

            body:
                formData.toString(),

            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8"
            }
        }
    );

    return {
        success: true
    };
}


/* ============================================================
   RSVP FORM
============================================================ */

function initializeRSVP() {

    if (!rsvpForm) {

        console.warn(
            "RSVP form not found."
        );

        return;
    }


    rsvpForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            event.stopPropagation();


            const savedScrollPosition =
                window.scrollY;


            const formData =
                new FormData(
                    rsvpForm
                );


            const data = {

                name:
                    String(
                        formData.get(
                            "guestName"
                        ) || ""
                    ).trim(),

                attendance:
                    String(
                        formData.get(
                            "attendance"
                        ) || ""
                    ),

                guests:
                    String(
                        formData.get(
                            "guests"
                        ) || "1"
                    ),

                message:
                    String(
                        formData.get(
                            "message"
                        ) || ""
                    ).trim()

            };


            if (!data.name) {

                formStatus.textContent =
                    "Please enter your name.";

                return;
            }


            if (!data.attendance) {

                formStatus.textContent =
                    "Please select your attendance.";

                return;
            }


            formStatus.textContent =
                "Sending your RSVP…";


            const submitButton =
                rsvpForm.querySelector(
                    ".submit-button"
                );


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Sending…";
            }


            try {

                await submitRSVP(
                    data
                );


                formStatus.textContent =
                    `Thank you, ${data.name}. Your RSVP has been received.`;

                showToast(
                    "RSVP received. Thank you!"
                );


                /*
                 * Reset form
                 */

                rsvpForm.reset();


                /*
                 * Restore personalized
                 * guest name
                 */

                const guestName =
                    getGuestName();

                const guestInput =
                    document.getElementById(
                        "guestName"
                    );

                if (
                    guestInput &&
                    guestName
                ) {

                    guestInput.value =
                        guestName;
                }


                /*
                 * Restore scroll
                 */

                requestAnimationFrame(
                    function () {

                        window.scrollTo({
                            top:
                                savedScrollPosition,
                            left: 0,
                            behavior:
                                "instant"
                        });

                    }
                );


            } catch (error) {

                console.error(
                    "RSVP submission failed:",
                    error
                );


                formStatus.textContent =
                    "We couldn't save your RSVP. Please try again.";


            } finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Send My Response";
                }

            }

        }
    );
}


/* ============================================================
   TOAST
============================================================ */

function showToast(message) {

    if (!toast) {
        return;
    }

    toast.textContent =
        message;

    toast.classList.add(
        "show"
    );

    setTimeout(
        function () {

            toast.classList.remove(
                "show"
            );

        },
        3500
    );
}


/* ============================================================
   WEATHER
============================================================ */

/*
 * December 2026 is too far away for a reliable
 * daily weather forecast.
 *
 * Connect your preferred weather API here closer
 * to the event date.
 */

function initializeWeather() {

    const temperature =
        document.getElementById(
            "weatherTemperature"
        );

    const description =
        document.getElementById(
            "weatherDescription"
        );

    if (!temperature || !description) {
        return;
    }

    /*
     * Placeholder until a reliable forecast
     * becomes available.
     */

    temperature.textContent =
        "—";

    description.textContent =
        "Live weather will appear closer to the celebration.";
}


/* ============================================================
   INITIALIZE
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializePersonalization();

        initializeRevealAnimations();

        initializeRSVP();

        initializeWeather();

    }
);
