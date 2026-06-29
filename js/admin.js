let editingGame = null;

const addGameBtn = document.getElementById("addGameBtn");
const gamesList = document.getElementById("gamesList");

if (gamesList) {
    loadGames();
}

if (addGameBtn) {

    addGameBtn.addEventListener("click", async () => {

        const game = {

            title: document.getElementById("gameTitle").value,
            genre: document.getElementById("gameGenre").value,
            releaseDate: document.getElementById("gameRelease").value,
            developer: document.getElementById("gameDeveloper").value,
            publisher: document.getElementById("gamePublisher").value,
            description: document.getElementById("gameDescription").value,
            image: document.getElementById("gameImage").value

        };

        const url = editingGame
            ? "http://localhost:3000/games/" + editingGame
            : "http://localhost:3000/games";

        const method = editingGame
            ? "PUT"
            : "POST";

        const response = await fetch(url, {

            method: method,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(game)

        });

        const data = await response.json();

        alert(data.message || "Saved successfully.");

        if (data.success) {

            editingGame = null;

            document.getElementById("gameTitle").value = "";
            document.getElementById("gameGenre").value = "";
            document.getElementById("gameRelease").value = "";
            document.getElementById("gameDeveloper").value = "";
            document.getElementById("gamePublisher").value = "";
            document.getElementById("gameDescription").value = "";
            document.getElementById("gameImage").value = "";

            loadGames();

        }

    });

}

async function loadGames() {

    const response =
    await fetch("http://localhost:3000/games");

    const games =
    await response.json();

    gamesList.innerHTML = "";

    games.forEach(game => {

        gamesList.innerHTML += `

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

async function editGame(id) {

    const response =
    await fetch("http://localhost:3000/games/" + id);

    const game =
    await response.json();

    document.getElementById("gameTitle").value = game.title;
    document.getElementById("gameGenre").value = game.genre;
    document.getElementById("gameRelease").value = game.releaseDate;
    document.getElementById("gameDeveloper").value = game.developer;
    document.getElementById("gamePublisher").value = game.publisher;
    document.getElementById("gameDescription").value = game.description;
    document.getElementById("gameImage").value = game.image;

    editingGame = id;

}

async function deleteGame(id) {

    const confirmDelete =
    confirm("Delete this game?");

    if (!confirmDelete) {

        return;

    }

    await fetch(

        "http://localhost:3000/games/" + id,

        {

            method: "DELETE"

        }

    );

    loadGames();

}