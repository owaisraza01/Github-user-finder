const userInput = document.getElementById("userInput");
const userDetails = document.getElementById("userDetails");

const searchUserData = async () => {
    userDetails.innerHTML = `
        <div class="d-flex justify-content-center">
            <div class="spinner-grow text-dark" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>`;
    const API_URL = `https://api.github.com/users/${userInput.value}`;
    try {
        const fetchData = await fetch(API_URL);
        const response = await fetchData.json();
        if (fetchData.status === 404) {
            Swal.fire({
                icon: 'error',
                title: `${response.message}`,
                confirmButtonText: 'OK',
                confirmButtonColor: '#000000' // Sets the button color to black
            });

            userDetails.innerHTML = ""; // Clear the spinner if user not found
        } else {
            showData(response);
        }
    } catch (error) {
        userDetails.innerHTML = `<p class="text-danger text-center">Failed to fetch user data.</p>`;
    }
};

const showData = (data) => {
    userDetails.innerHTML = `
        <div
    class="col-4 text-white p-3 d-flex flex-column justify-content-center align-items-center border border-2 border-black animate__fadeInUp shadow-lg rounded-start-5 bg-dark bg-gradient">
    <div class="text-center">
        <img src="${data.avatar_url}" alt="Profile Picture" class="w-50 mb-3 rounded-circle border border-3 border-black shadow-lg">
    </div>
    <div class="text-center">
        <p style="font-family: 'Cutive', serif;" class="fw-bold">Name: <b style="font-family: 'Lexend', serif; color:#a2bac4">${data.name}</b></p>
        <p style="font-family: 'Cutive', serif;" class="fw-bold">Joined: <b style="font-family: 'Lexend', serif; color:#a2bac4">${new Date(
        data.created_at
    ).toDateString()}</b></p>
        <p style="font-family: 'Cutive', serif;" class="fw-bold">Username: <b style="font-family: 'Lexend', serif; color:#a2bac4"">@${data.login}</b></p>
    </div>
    <div class="container">
        <div class="d-flex justify-content-around align-items-center text-white p-2 rounded-pill">
            <div class="text-center">
                <p style="font-family: 'Cutive', serif;" class="fw-bold">Followers</p>
                <h5 style="font-family: 'Lexend', serif; color:#a2bac4"">${data.followers}</h5>
            </div>
            <div class="text-center">
                <p style="font-family: 'Cutive', serif;" class="fw-bold">Following</p>
                <h5 style="font-family: 'Lexend', serif; color:#a2bac4"">${data.following}</h5>
            </div>
            <div class="text-center">
                <p style="font-family: 'Cutive', serif;" class="fw-bold">Repos</p>
                <h5 style="font-family: 'Lexend', serif; color:#a2bac4"">${data.public_repos}</h5>
            </div>
        </div>
    </div>
</div>

<div
    class="col-8 bg-light bg-gradient p-3 border border-2 border-black shadow-lg rounded-end-5"
    style="background-color: #8f93a6;">
    <div class="mx-3">
        <h5 style="font-family: 'Cutive', serif;" class="fw-bold">Bio Data</h5>
        <p style="font-family: 'Lexend', serif; color: #555555">${data.bio || "No bio available."}</p>
    </div>
    <div>
        <h5 style="font-family: 'Cutive', serif;" class="fw-bold mx-3">Repositories</h5>
        <div id="reposContainer" class="row"></div>
    </div>
</div>
`;

    // Fetch and display repositories
    fetchRepos(data.login);
};

// Fetch and display repositories
const fetchRepos = async (username) => {
    const reposContainer = document.getElementById("reposContainer");
    reposContainer.innerHTML = `
      <div class="d-flex justify-content-center">
          <div class="spinner-border text-dark" role="status">
              <span class="visually-hidden">Loading...</span>
          </div>
      </div>`; // Show a spinner while loading

    try {
        const API_URL = `https://api.github.com/users/${username}/repos`;
        const response = await fetch(API_URL);
        const repos = await response.json();

        reposContainer.innerHTML = ""; // Clear loading spinner

        if (!repos || repos.length === 0) {
            reposContainer.innerHTML = `<p class="text-center">No repositories available.</p>`;
            return;
        }

        repos.slice(0, 6).forEach((repo) => {
            reposContainer.innerHTML += `
                <div class="card bg-light bg-gradient border border-black mx-4 mb-3 col-md-5 border border-black shadow-lg">
                    <div class="card-body p-1">
                        <h6 class="card-title mb-1 text-truncate" style="font-family: 'Lexend', serif; color: #555555">${repo.name}</h6>
                        <p class="card-text mb-1 small">
                            <span class="badge bg-secondary" style="font-family: 'Lexend', serif;">${repo.language || "N/A"}</span>
                            <span class="text-muted" style="font-family: 'Lexend', serif;">⭐ ${repo.stargazers_count}</span>
                            <span class="text-muted" style="font-family: 'Lexend', serif;">🍴 ${repo.forks_count}</span>
                        

                            
                        </p>
                        <p style="font-family: 'Lexend', serif;"><b>Created at:</b> ${new Date(
                            repo.created_at
                        ).toDateString()}</p>
                        <a href="${repo.html_url}" target="_blank" class="btn btn-sm btn-dark" style="font-family: 'Lexend', serif;" >View Repo</a>
                    </div>
                </div>`;
        });
    } catch (error) {
        reposContainer.innerHTML = `<p class="text-danger text-center">Unable to load repositories.</p>`;
    }
};
