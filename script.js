document.addEventListener("DOMContentLoaded", function () {
  const userID = "545015390020042752";
  const apiUrl = `https://api.lanyard.rest/v1/users/${userID}`;

  fetch(apiUrl)
  .then((response) => {
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
  })
  .then((data) => {
      if (data?.success && data.data?.discord_user?.id) {
          updateDiscordStatus(data.data);

          if (data.data?.activities && data.data.activities.length > 0) {
              updateActivty(data.data, data.data.activities[0]);
          }

          updateSpotifyInfo(data.data);
      } else {
          console.error("Invalid response data structure:", data);
      }
  })
  .catch((error) => {
      console.error("Error fetching data:", error);
  });

function updateActivty(data, activity) {
    console.log(activity )
  if (activity && data?.data?.activities && data.data.activities.length > 0) {
      const firstActivity = data.data.activities[0];
      if (firstActivity?.name && firstActivity?.state) {
          activity.innerHTML = `
              <p>${firstActivity.name}</p>
              <p>${firstActivity.state}</p>
          `;
      } else {
          console.error("Invalid activity structure:", firstActivity);
      }
  }
}

      function updateDiscordStatus(data) {
        const statusContainer = document.querySelector(".discord");
        const activity = document.querySelector(".activity");
        const status = document.querySelector('.status-indicator');
        if (statusContainer) {
            if (`${data.discord_status}` == "idle") {
                status.style.backgroundColor = 'rgba(240,178,50,1)';
            } else if (`${data.discord_status}` == "dnd") {
                status.style.backgroundColor = 'rgba(242,63,67,1)';
            } else if (`${data.discord_status}` == 'offline') {
                status.style.backgroundColor = 'rgba(128,132,142,1)';
            } else if (`${data.discord_status}` == "online") {
                status.style.backgroundColor = 'rgba(35,165,90,1)'
            }
    
            statusContainer.innerHTML = `
                <img draggable="false" class="pfpDiscord" src="https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png" alt="Discord Avatar">
                <p class="username">Noel</p>
                <p class="discriminator">${data.discord_user.username}</p>
            `;
        }
 
    }
    
  function updateSpotifyInfo(data) {
    const playerContainer = document.querySelector(".spotify");

    if (playerContainer) {
        if (data.listening_to_spotify && data.spotify) {
            playerContainer.innerHTML = `
                <h2 class="title">SPOTIFY NOW PLAYING</h2>
                <p>Song: ${data.spotify.song}</p>
                <p>Artist: ${data.spotify.artist}</p>
                <p>Album: ${data.spotify.album}</p>
                <img src="${data.spotify.album_art}" alt="Album Art">
            `;
        } else {
            playerContainer.innerHTML = "<p>Not currently listening to Spotify</p>";
        }
    }
}

});
