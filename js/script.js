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

const rateBtn =
document.getElementById("rateBtn");

if(rateBtn){

    loadRating();

    rateBtn.addEventListener("click", async () => {

        const loggedUser =
        JSON.parse(
            localStorage.getItem("loggedUser")
        );

        if(!loggedUser){

            alert("Please login first.");

            return;

        }

        const gameId =
        new URLSearchParams(window.location.search)
        .get("id");

        const rating =
        Number(
            document.getElementById("userRating").value
        );

        await fetch(

            "http://localhost:3000/ratings",

            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    userId:loggedUser.id,
                    gameId:gameId,
                    rating:rating

                })

            }

        );

        alert("Rating saved!");

        loadRating();

    });

}

async function loadRating(){

    const gameId =
    new URLSearchParams(window.location.search)
    .get("id");

    const response =
    await fetch(

        "http://localhost:3000/ratings/" + gameId

    );

    const data =
    await response.json();

    document.getElementById("gameRating").textContent =

    data.averageRating
    ?

    Number(data.averageRating).toFixed(1)

    :

    "No ratings";

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


        alert(
            "Thank you for rating Spider-Man!"
        );

    });

}

/* =========================
   SCREENSHOT GALLERY
========================= */

const lightbox =
document.getElementById("lightbox");

const lightboxImg =
document.getElementById("lightbox-img");

const closeBtn =
document.querySelector(".close-btn");

function initializeGallery(){

    const galleryImages =
    document.querySelectorAll(".gallery-image");

    galleryImages.forEach(image=>{

        image.addEventListener("click",()=>{

            lightbox.style.display="flex";

            lightboxImg.src=image.src;

        });

    });

}

if(closeBtn){

    closeBtn.addEventListener("click",()=>{

        lightbox.style.display="none";

    });

}

if(lightbox){

    lightbox.addEventListener("click",(e)=>{

        if(e.target===lightbox){

            lightbox.style.display="none";

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

if(ratedGamesContainer){

    loadRatedGames();

}

async function loadRatedGames(){

    const loggedUser =
    JSON.parse(
        localStorage.getItem("loggedUser")
    );

    const response =
    await fetch(

        "http://localhost:3000/ratings/user/" +
        loggedUser.id

    );

    const games =
    await response.json();

    ratedGamesContainer.innerHTML="";

    games.forEach(game=>{

        ratedGamesContainer.innerHTML+=`

        <div class="rated-card">

            <img src="${game.image}">

            <h4>${game.title}</h4>

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

    registerBtn.addEventListener("click", async () => {

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

        const response = await fetch(

            "http://localhost:3000/register",

            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    username,
                    email,
                    password

                })

            }

        );

        const data =
        await response.json();

        alert(data.message);

        if(data.success){

            window.location.href =
            "login.html";

        }

    });

}

/* =========================
   LOGIN
========================= */

const loginBtn =
document.getElementById("loginBtn");

if(loginBtn){

    loginBtn.addEventListener("click", async () => {

        const username =
        document.getElementById("loginUsername").value;

        const password =
        document.getElementById("loginPassword").value;

        const response = await fetch(

            "http://localhost:3000/login",

            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    username,
                    password

                })

            }

        );

        const data =
        await response.json();

        if(data.success){

            localStorage.setItem(

                "loggedUser",

                JSON.stringify(data.user)

            );

            localStorage.setItem("loggedIn","true");

localStorage.setItem(
    "currentUser",
    data.user.username
);

            if(data.user.role === "admin"){

                window.location.href =
                "admin.html";

            }

            else{

                window.location.href =
                "profile.html";

            }

        }

        else{

            alert(data.message);

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

       localStorage.removeItem("loggedIn");
localStorage.removeItem("loggedUser");
localStorage.removeItem("currentUser");

window.location.href="login.html";

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

/* =========================
   LOAD GAMES
========================= */

const catalogGrid =
document.getElementById("catalogGrid");

if(catalogGrid){

    loadGames();

}

async function loadGames(){

    const response =
    await fetch(

        "http://localhost:3000/games"

    );

    const games =
    await response.json();

    catalogGrid.innerHTML = "";

    games.forEach(game => {

        catalogGrid.innerHTML += `

        <a href="game-details.html?id=${game.id}"
class="game-link">

<div class="catalog-card">

<img src="${game.image}">

<h3>${game.title}</h3>

<p>${game.genre}</p>

</div>

</a>

        `;

    });

}

/* =========================
   GAME DETAILS
========================= */

const gameTitle =
document.getElementById("gameTitle");

if(gameTitle){

    loadGame();

}

async function loadGame(){

    const params =
    new URLSearchParams(window.location.search);

    const gameId =
    params.get("id");

    if(!gameId){

        return;

    }

    const response =
    await fetch(

        "http://localhost:3000/games/" + gameId

    );

    const game =
    await response.json();

    document.title =
    "PlayNext - " + game.title;

    document.getElementById("gameTitle").textContent =
    game.title;

    document.getElementById("gameImage").src =
    game.image;

    document.getElementById("gameDescription").textContent =
    game.description;

    document.getElementById("releaseDate").textContent =
    game.releaseDate;

    document.getElementById("developer").textContent =
    game.developer;

    document.getElementById("publisher").textContent =
    game.publisher;

    document.getElementById("genre").textContent =
    game.genre;

    document.getElementById("gameRating").textContent =
    "9.5";

    loadScreenshots(gameId);

}

async function loadScreenshots(gameId){

    const response =
    await fetch(

        "http://localhost:3000/games/" +
        gameId +
        "/screenshots"

    );

    const screenshots =
    await response.json();

    const grid =
    document.getElementById("screenshotsGrid");

    grid.innerHTML = "";

    screenshots.forEach(screen => {

        grid.innerHTML += `

        <img
            src="${screen.image}"
            class="gallery-image">

        `;

    });

    initializeGallery();

}

/* =========================
   ADMIN GAME LIST
========================= */

const gamesList =
document.getElementById("gamesList");

if(gamesList){

    loadAdminGames();

}

async function loadAdminGames(){

    const response =
    await fetch(

        "http://localhost:3000/games"

    );

    const games =
    await response.json();

    gamesList.innerHTML="";

    games.forEach(game=>{

        gamesList.innerHTML+=`

        <div class="admin-game">

            <strong>${game.title}</strong>

            <button onclick="editGame(${game.id})">

            Edit

            </button>

            <button onclick="deleteGame(${game.id})">

            Delete

            </button>

        </div>

        `;

    });

}

async function deleteGame(id){

    if(!confirm("Delete this game?")){

        return;

    }

    await fetch(

        "http://localhost:3000/games/"+id,

        {

            method:"DELETE"

        }

    );

    loadAdminGames();

}

async function editGame(id){

    const response=

    await fetch(

        "http://localhost:3000/games/"+id

    );

    const game=

    await response.json();

    document.getElementById("title").value=
    game.title;

    document.getElementById("genre").value=
    game.genre;

    document.getElementById("releaseDate").value=
    game.releaseDate;

    document.getElementById("developer").value=
    game.developer;

    document.getElementById("publisher").value=
    game.publisher;

    document.getElementById("description").value=
    game.description;

    document.getElementById("image").value=
    game.image;

    window.editingGame=id;

}