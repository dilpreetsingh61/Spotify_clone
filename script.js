console.log("this is my javascript")
let currentSong = new Audio();
let songs;
let songsul;
let currentPlaylistFolder = null; // Track which playlist is currently playing

function formatTime(totalSeconds) {
    if (isNaN(totalSeconds) || totalSeconds === undefined) {
        return "00:00";
    }

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    // pad with leading zero if less than 10
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {

    let songs = [];
    // Fetch song list from JSON manifest
    let response = await fetch('/songs/songs.json');
    let songData = await response.json();
    
    // Get songs for the specified folder
    if (songData[folder]) {
        songs = songData[folder].map(song => `/songs/${encodeURIComponent(folder)}/${song}`);
    }

    // Update current playlist tracking
    currentPlaylistFolder = folder;
    
    // Reset all card play buttons
    document.querySelectorAll(".card").forEach(card => {
        card.querySelector(".play img").src = "./svgs/play.svg";
        card.querySelector(".play").classList.remove("playing");
    });
    
    // Set current playlist card to pause
    document.querySelectorAll(".card").forEach(card => {
        if (card.dataset.folder === folder) {
            card.querySelector(".play img").src = "./svgs/pause.svg";
            card.querySelector(".play").classList.add("playing");
        }
    });



    songsul = document.querySelector(".songslist ul");
    console.log("songs: " + songs)
    songsul.innerHTML = "";
    for (const element of songs) {
        let songname = element.split("songs/")[1].replaceAll("_", " ").split(".")[0];
        let newli = `<li class=" m2 songlis">
                        <img class="invert music" src="./svgs/music.svg" alt="">
                        <div class="info">
                            <div>${songname.split("/")[1]}</div>
                            <div> : by Dilpreet</div>
                        </div>
                        <div class="playnow">
                            <div class="play1">

                                <img src="./svgs/play.svg" alt="">
                            </div>
                        </div>
                    </li>`;

        songsul.innerHTML += newli;
    }


    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", Element => {
            const clickedSongName = e.querySelector(".info").firstElementChild.innerText;
            const currentSongName = document.querySelector(".songinfo").innerHTML;
            
            // Check if clicking on the currently playing song
            if (clickedSongName === currentSongName && !currentSong.paused) {
                // Pause the song
                currentSong.pause();
                e.querySelector(".play1 img").src = "./svgs/play.svg";
                play.src = "./svgs/play1.svg";
            } else if (clickedSongName === currentSongName && currentSong.paused) {
                // Resume the same song
                currentSong.play();
                e.querySelector(".play1 img").src = "./svgs/pause.svg";
                play.src = "./svgs/pause1.svg";
            } else {
                // Play a different song
                playmusic(`${folder}/` + clickedSongName);
            }
        })
    })
    
    // Play first song after sidebar is populated
    let firstSongPath = decodeURIComponent(songs[0].split("songs/")[1]);
    let firstSongName = firstSongPath.replaceAll("_", " ").split(".")[0];
    playmusic(firstSongName, false);
    
    return songs;

}

function playmusic(trackname, pause = false) {
    console.log("trackname :", trackname)

    // Split folder and song name, handle them separately
    let parts = trackname.split("/");
    let folder = parts[0];
    let songname = parts[1].replaceAll(" ", "_");
    
    // Construct path with proper URL encoding for spaces
    let songsrc = `/songs/${encodeURIComponent(folder)}/${songname}.mp3`;
    
    currentSong.src = songsrc;

    // Reset all song buttons to play icon
    Array.from(songsul.getElementsByTagName("li")).forEach(li => {
        // li.querySelector(".play1 img");
        li.querySelector(".play1 img").src = "./svgs/play.svg";
    });

    if (!pause) {
        // Find the current song in the list and change its button to pause
        Array.from(songsul.getElementsByTagName("li")).forEach(li => {
            const liTrackName = li.querySelector(".info").firstElementChild.innerText.replaceAll(" ", "_");
            const compareTrackName = trackname.split("/")[1]?.replaceAll(" ", "_");
            if (liTrackName === compareTrackName) {
                li.querySelector(".play1 img").src = "./svgs/pause.svg";
            }
        });


        play.src = "./svgs/pause1.svg";
        currentSong.play().catch(() => {
            // If autoplay is blocked, reset to play button
            play.src = "./svgs/play1.svg";
            Array.from(songsul.getElementsByTagName("li")).forEach(li => {
                const liTrackName = li.querySelector(".info").firstElementChild.innerText.replaceAll(" ", "_");
                const compareTrackName = trackname.split("/")[1]?.replaceAll(" ", "_");
                if (liTrackName === compareTrackName) {
                    li.querySelector(".play1 img").src = "./svgs/play.svg";
                }
            });
            // Reset current playlist card button
            document.querySelectorAll(".card").forEach(card => {
                if (card.dataset.folder === currentPlaylistFolder) {
                    card.querySelector(".play img").src = "./svgs/play.svg";
                    card.querySelector(".play").classList.remove("playing");
                }
            });
        });
    }
    console.log(currentSong.src)
    // console.log(currentSong.currentTime," : ",currentSong.duration);
    document.querySelector(".songinfo").innerHTML = trackname.split("/")[1];

}
async function main() {


    // songs = await getsongs("waheguru")


    // getsongs("waheguru")
    window.addEventListener("load", async () => {
        await getsongs("waheguru");
    });


    play.addEventListener("click", () => {
        if (currentSong.paused) {
            play.src = "./svgs/pause1.svg";
            Array.from(songsul.getElementsByTagName("li")).forEach(li => {
                if (li.querySelector(".info").firstElementChild.innerText === document.querySelector(".songinfo").innerHTML) {
                    li.querySelector(".play1 img").src = "./svgs/pause.svg";

                }
            });
            
            // Update current playlist card
            document.querySelectorAll(".card").forEach(card => {
                if (card.dataset.folder === currentPlaylistFolder) {
                    card.querySelector(".play img").src = "./svgs/pause.svg";
                    card.querySelector(".play").classList.add("playing");
                }
            });

            currentSong.play();

        }
        else {
            play.src = "./svgs/play1.svg";
            currentSong.pause();
            Array.from(songsul.getElementsByTagName("li")).forEach(li => {
                if (li.querySelector(".info").firstElementChild.innerText === document.querySelector(".songinfo").innerHTML) {
                    li.querySelector(".play1 img").src = "./svgs/play.svg";
                }
            });
            
            // Update current playlist card
            document.querySelectorAll(".card").forEach(card => {
                if (card.dataset.folder === currentPlaylistFolder) {
                    card.querySelector(".play img").src = "./svgs/play.svg";
                    card.querySelector(".play").classList.remove("playing");
                }
            });


        }
    })

    currentSong.addEventListener("timeupdate", () => {
        if (currentSong.duration && !isNaN(currentSong.duration)) {
            document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
            document.querySelector(".circle").style.left = `${currentSong.currentTime / currentSong.duration * 99}%`;
            document.querySelector(".seekbar2").style.width = `${currentSong.currentTime / currentSong.duration * 98}%`;
        }
        if (currentSong.currentTime == 0) {
            document.querySelector(".circle").style.transform = "translate(-48%, 0)";

        }

    })

    // Auto-play next song when current song ends
    currentSong.addEventListener("ended", () => {
        let currentPath = decodeURIComponent(new URL(currentSong.src).pathname);
        let index = songs.indexOf(currentPath);
        if (index === -1) {
            // Fallback: try to find by comparing song names
            const currentSongName = document.querySelector(".songinfo").innerHTML;
            index = songs.findIndex(s => {
                const sPath = decodeURIComponent(s.split("songs/")[1]).replaceAll("_", " ").split(".")[0];
                return sPath.split("/")[1] === currentSongName;
            });
        }
        let nextSongPath = decodeURIComponent(songs[(index + 1) % songs.length].split("songs/")[1]);
        let songname = nextSongPath.replaceAll("_", " ").split(".")[0];
        playmusic(songname);
    })

    currentSong.addEventListener("loadedmetadata", () => {
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
    })

    // Seekbar click functionality
    document.querySelector(".seekbar").addEventListener("click", e => {
        console.log(e.target.getBoundingClientRect().width, e.offsetX)
        // total                           clicked
        let percent = (e.offsetX / e.target.getBoundingClientRect().width * 100);
        document.querySelector(".seekbar2").style.width = (e.offsetX / e.target.getBoundingClientRect().width * 98) + "%";
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    })

    // Seekbar drag functionality
    let isDragging = false;
    const seekbar = document.querySelector(".seekbar");
    const circle = document.querySelector(".circle");

    circle.addEventListener("mousedown", (e) => {
        isDragging = true;
        e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            const seekbarRect = seekbar.getBoundingClientRect();
            let offsetX = e.clientX - seekbarRect.left;
            
            // Constrain within seekbar bounds
            if (offsetX < 0) offsetX = 0;
            if (offsetX > seekbarRect.width) offsetX = seekbarRect.width;
            
            let percent = (offsetX / seekbarRect.width * 100);
            document.querySelector(".seekbar2").style.width = (offsetX / seekbarRect.width * 98) + "%";
            circle.style.left = percent + "%";
            currentSong.currentTime = (currentSong.duration * percent) / 100;
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    document.querySelector(".playlist1").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0%";
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%";
    })
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".menubar").style.top = "0%"
    })
    document.querySelector(".close1").addEventListener("click", () => {
        document.querySelector(".menubar").style.top = "-100%";
    })
    previous.addEventListener("click", () => {

        let currentPath = decodeURIComponent(new URL(currentSong.src).pathname);
        let index = songs.indexOf(currentPath);
        if (index === -1) {
            // Fallback: try to find by comparing song names
            const currentSongName = document.querySelector(".songinfo").innerHTML;
            index = songs.findIndex(s => {
                const sPath = decodeURIComponent(s.split("songs/")[1]).replaceAll("_", " ").split(".")[0];
                return sPath.split("/")[1] === currentSongName;
            });
        }
        if (index != 0 && index != -1) {
            let prevSongPath = decodeURIComponent(songs[(index - 1) % songs.length].split("songs/")[1]);
            let songname = prevSongPath.replaceAll("_", " ").split(".")[0];
            playmusic(songname);
        }


    })
    next.addEventListener("click", () => {
        let currentPath = decodeURIComponent(new URL(currentSong.src).pathname);
        let index = songs.indexOf(currentPath);
        if (index === -1) {
            // Fallback: try to find by comparing song names
            const currentSongName = document.querySelector(".songinfo").innerHTML;
            index = songs.findIndex(s => {
                const sPath = decodeURIComponent(s.split("songs/")[1]).replaceAll("_", " ").split(".")[0];
                return sPath.split("/")[1] === currentSongName;
            });
        }
        let nextSongPath = decodeURIComponent(songs[(index + 1) % songs.length].split("songs/")[1]);
        let songname = nextSongPath.replaceAll("_", " ").split(".")[0];
        playmusic(songname);
    })

    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = e.target.value / 100;
    })



    //add dynamic folder songs
    document.querySelectorAll(".card").forEach(e => {
        e.addEventListener("click", async () => {
            const clickedFolder = e.dataset.folder;
            
            // If clicking the same playlist that's already loaded
            if (clickedFolder === currentPlaylistFolder) {
                // Toggle play/pause
                if (currentSong.paused) {
                    currentSong.play();
                    play.src = "./svgs/pause1.svg";
                    e.querySelector(".play img").src = "./svgs/pause.svg";
                    e.querySelector(".play").classList.add("playing");
                    
                    // Update sidebar song button
                    Array.from(songsul.getElementsByTagName("li")).forEach(li => {
                        if (li.querySelector(".info").firstElementChild.innerText === document.querySelector(".songinfo").innerHTML) {
                            li.querySelector(".play1 img").src = "./svgs/pause.svg";
                        }
                    });
                } else {
                    currentSong.pause();
                    play.src = "./svgs/play1.svg";
                    e.querySelector(".play img").src = "./svgs/play.svg";
                    e.querySelector(".play").classList.remove("playing");
                    
                    // Update sidebar song button
                    Array.from(songsul.getElementsByTagName("li")).forEach(li => {
                        if (li.querySelector(".info").firstElementChild.innerText === document.querySelector(".songinfo").innerHTML) {
                            li.querySelector(".play1 img").src = "./svgs/play.svg";
                        }
                    });
                }
            } else {
                // Load new playlist
                songs = await getsongs(clickedFolder);
            }
            console.log(e)

        })
        // console.log(e)
    })
}
main();