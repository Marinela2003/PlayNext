console.log("PlayNext Loaded Successfully");

/* =========================
   GLOBAL SEARCH
========================= */

const searchInput =
document.getElementById("searchInput");

if(searchInput){

    searchInput.addEventListener("keydown", function(e){

        if(e.key === "Enter"){

            const searchValue =
            this.value.toLowerCase().trim();

            if(searchValue === "mimesis"){

    window.location.href =
    "game-details.html";

}
else if(
    searchValue === "spider-man" ||
    searchValue === "spiderman" ||
    searchValue === "miles morales" ||
    searchValue === "marvel's spider-man: miles morales"
){

    window.location.href =
    "spiderman-details.html";

}

            else{

                alert(
                    "Game not found."
                );

            }

        }

    });

}

/* =========================
   GAME RATING
========================= */

const rateBtn = document.getElementById("rateBtn");

if (rateBtn) {

    let currentRating =
        Number(localStorage.getItem("mimesisRating")) || 8.5;

    const ratingElement =
        document.getElementById("gameRating");

    if (ratingElement) {
        ratingElement.textContent =
            currentRating.toFixed(1);
    }

    rateBtn.addEventListener("click", () => {

        const userRating =
            Number(
                document.getElementById("userRating").value
            );

        currentRating =
            ((currentRating * 100) + userRating) / 101;

        localStorage.setItem(
            "mimesisRating",
            currentRating
        );

        if (ratingElement) {
            ratingElement.textContent =
                currentRating.toFixed(1);
        }

        const currentUser =
    localStorage.getItem("currentUser");
    

let ratedGames =
    JSON.parse(
        localStorage.getItem(
            currentUser + "_ratedGames"
        )
    ) || [];

        const existingGame =
            ratedGames.find(
                game => game.name === "MIMESIS"
            );

        if (existingGame) {

            existingGame.rating = userRating;

        } else {

            ratedGames.push({

                name: "MIMESIS",

                image: "images/game1.png",

                rating: userRating

            });

        }

        localStorage.setItem(
    currentUser + "_ratedGames",
    JSON.stringify(ratedGames)
);

        console.log(ratedGames);

        if(userRating >= 8){

    localStorage.setItem(
        currentUser + "_favoriteGenre",
        "Horror"
    );

}

        alert("Thank you for rating MIMESIS!");

    });

}

/* =========================
   SPIDERMAN RATING
========================= */

const spidermanRateBtn =
document.getElementById("spidermanRateBtn");

if(spidermanRateBtn){

    let currentRating =
    Number(
        localStorage.getItem("spidermanRating")
    ) || 9.2;

    const ratingElement =
    document.getElementById(
        "spidermanRating"
    );

    if(ratingElement){

        ratingElement.textContent =
        currentRating.toFixed(1);

    }

    spidermanRateBtn.addEventListener("click", () => {

        const userRating =
        Number(
            document.getElementById(
                "spidermanUserRating"
            ).value
        );

        currentRating =
        ((currentRating * 100) + userRating)
        / 101;

        localStorage.setItem(
            "spidermanRating",
            currentRating
        );

        ratingElement.textContent =
        currentRating.toFixed(1);

        const currentUser =
        localStorage.getItem(
            "currentUser"
        );

        let ratedGames =
        JSON.parse(
            localStorage.getItem(
                currentUser + "_ratedGames"
            )
        ) || [];

        const existingGame =
        ratedGames.find(
            game =>
            game.name ===
            "Marvel's Spider-Man: Miles Morales"
        );

        if(existingGame){

            existingGame.rating =
            userRating;

        }
        else{

            ratedGames.push({

                name:
                "Marvel's Spider-Man: Miles Morales",

                image:
                "images/game2.png",

                rating:
                userRating

            });

        }

        localStorage.setItem(
            currentUser + "_ratedGames",
            JSON.stringify(
                ratedGames
            )
        );

        if(userRating >= 8){

            localStorage.setItem(
                currentUser +
                "_favoriteGenre",

                "Action"
            );

        }

        alert(
            "Thank you for rating Spider-Man!"
        );

    });

}

/* =========================
   SCREENSHOT GALLERY
========================= */

const galleryImages =
    document.querySelectorAll(".gallery-image");

const lightbox =
    document.getElementById("lightbox");

const lightboxImg =
    document.getElementById("lightbox-img");

const closeBtn =
    document.querySelector(".close-btn");

if (
    galleryImages.length > 0 &&
    lightbox &&
    lightboxImg &&
    closeBtn
) {

    galleryImages.forEach(image => {

        image.addEventListener("click", () => {

            lightbox.style.display = "flex";

            lightboxImg.src = image.src;

        });

    });

    closeBtn.addEventListener("click", () => {

        lightbox.style.display = "none";

    });

    lightbox.addEventListener("click", (event) => {

        if (event.target === lightbox) {

            lightbox.style.display = "none";

        }

    });

}

/* =========================
   PROFILE
========================= */

const saveProfileBtn =
    document.getElementById("saveProfile");

if (saveProfileBtn) {

    const username =
        document.getElementById("username");

    const userDescription =
        document.getElementById("userDescription");

    const profileImage =
        document.getElementById("profileImage");

    const currentUser =
        localStorage.getItem("currentUser");

    const users =
        JSON.parse(localStorage.getItem("users")) || [];

    const registeredUser =
        users.find(user => user.username === currentUser);

    if (registeredUser) {

        username.textContent =
            registeredUser.username;

    }

    userDescription.value =
        localStorage.getItem(
            currentUser + "_description"
        ) || "";

    const savedImage =
        localStorage.getItem(
            currentUser + "_profileImage"
        );

    if (savedImage) {

        profileImage.src = savedImage;

    }

    saveProfileBtn.addEventListener("click", () => {

        localStorage.setItem(
            currentUser + "_description",
            userDescription.value
        );

        alert("Profile saved!");

    });

    const imageUpload =
        document.getElementById("imageUpload");

    if (imageUpload) {

        imageUpload.addEventListener(
            "change",
            function () {

                const file =
                    this.files[0];

                if (file) {

                    const reader =
                        new FileReader();

                    reader.onload = function (e) {

                        profileImage.src =
                            e.target.result;

                        localStorage.setItem(
                            currentUser + "_profileImage",
                            e.target.result
                        );

                    }

                    reader.readAsDataURL(file);

                }

            }
        );

    }

}

/* =========================
   RATED GAMES IN PROFILE
========================= */

const ratedGamesContainer =
    document.getElementById("ratedGamesContainer");

if (ratedGamesContainer) {

    const currentUser =
        localStorage.getItem("currentUser");
        

    const ratedGames =
        JSON.parse(
            localStorage.getItem(
                currentUser + "_ratedGames"
            )
        ) || [];

    ratedGamesContainer.innerHTML = "";

    ratedGames.forEach(game => {

        ratedGamesContainer.innerHTML += `

        <div class="rated-card">

            <img src="${game.image}" alt="${game.name}">

            <p>⭐ ${game.rating}</p>

        </div>

        `;

    });

}
/* =========================
   REGISTER
========================= */

const registerBtn =
document.getElementById("registerBtn");

if(registerBtn){

    registerBtn.addEventListener("click", () => {

        const username =
        document.getElementById("registerUsername").value;

        const email =
        document.getElementById("registerEmail").value;

        const password =
        document.getElementById("registerPassword").value;

        const confirmPassword =
        document.getElementById("confirmPassword").value;

        if(password !== confirmPassword){

            alert("Passwords do not match!");

            return;

        }

        let users =
        JSON.parse(
            localStorage.getItem("users")
        ) || [];

        const userExists =
        users.some(
            user => user.username === username
        );

        if(userExists){

            alert("Username already exists!");

            return;

        }

        users.push({

            username,
            email,
            password

        });

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

        alert("Registration successful!");

        window.location.href =
        "login.html";

    });

}

/* =========================
   LOGIN
========================= */

const loginBtn =
document.getElementById("loginBtn");

if(loginBtn){

    loginBtn.addEventListener("click", () => {

        const username =
        document.getElementById("loginUsername").value;

        const password =
        document.getElementById("loginPassword").value;

        const users =
JSON.parse(
    localStorage.getItem("users")
) || [];

const user =
users.find(
    u =>
    u.username === username &&
    u.password === password
);

        if(
            user &&
            user.username === username &&
            user.password === password
        ){

            localStorage.setItem(
                "loggedIn",
                "true"
            );

            localStorage.setItem(
                "currentUser",
                username
            );

            window.location.href =
            "profile.html";

        }
        else{

            alert(
                "Invalid username or password!"
            );

        }

    });

}

/* =========================
   LOGOUT
========================= */

const logoutBtn =
document.getElementById("logoutBtn");

if(logoutBtn){

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem(
            "loggedIn"
        );

        window.location.href =
        "login.html";

    });

}

/* =========================
   RECOMMENDATIONS
========================= */

const horrorSection =
document.getElementById("horrorSection");

const actionSection =
document.getElementById("actionSection");

if(
    horrorSection &&
    actionSection
){

    const currentUser =
    localStorage.getItem(
        "currentUser"
    );

    const favoriteGenre =
    localStorage.getItem(
        currentUser + "_favoriteGenre"
    );

    if(
        favoriteGenre === "Horror"
    ){

        const parent =
        horrorSection.parentNode;

        parent.insertBefore(
            horrorSection,
            actionSection
        );

    }

}