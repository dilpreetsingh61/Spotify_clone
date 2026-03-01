console.log("this is my javascript")
let currentSong = new Audio();
let songs;
let songsul;
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
        songs = songData[folder].map(song => `/songs/${folder}/${song}`);
    }



    songsul = document.querySelector(".songslist ul");
    playmusic(songs[0].split("songs/")[1].replaceAll("_", " ").split(".")[0], true);
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
            e.querySelector(".play1 img").src = "./svgs/pause.svg"
            playmusic(`${folder}/` + e.querySelector(".info").firstElementChild.innerText)
            // console.log("clicked")
        })
    })
    return songs;

}

function playmusic(trackname, pause = false) {
    console.log("trackname :", trackname)

    let songsrc = "/songs/" + trackname.replaceAll(" ", "_") + ".mp3";

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
        currentSong.play();
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


        }
    })

    currentSong.addEventListener("timeupdate", () => {
        if (currentSong.duration && !isNaN(currentSong.duration)) {
            document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
            document.querySelector(".circle").style.left = `${currentSong.currentTime / currentSong.duration * 99}%`;
            document.querySelector(".seekbar2").style.width = `${currentSong.currentTime / currentSong.duration * 98}%`;
        }
        if (currentSong.currentTime === currentSong.duration) {
            document.querySelector(".circle").style.transform = "translate(10%, 0)";
            play.src = "./svgs/play1.svg";
            Array.from(songsul.getElementsByTagName("li")).forEach(li => {
                if (li.querySelector(".info").firstElementChild.innerText === document.querySelector(".songinfo").innerHTML) {
                    li.querySelector(".play1 img").src = "./svgs/play.svg";
                }
            });
            let currentPath = new URL(currentSong.src).pathname;
            let index = songs.indexOf(currentPath);
            let songname = songs[(index + 1) % songs.length].split("songs/")[1].replaceAll("_", " ").split(".")[0];
            playmusic(songname);

        }
        if (currentSong.currentTime == 0) {
            document.querySelector(".circle").style.transform = "translate(-48%, 0)";

        }

    })

    currentSong.addEventListener("loadedmetadata", () => {
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        console.log(e.target.getBoundingClientRect().width, e.offsetX)
        // total                           clicked
        let percent = (e.offsetX / e.target.getBoundingClientRect().width * 100);
        document.querySelector(".seekbar2").style.width = (e.offsetX / e.target.getBoundingClientRect().width * 98) + "%";
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    })

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

        let currentPath = new URL(currentSong.src).pathname;
        let index = songs.indexOf(currentPath);
        if (index != 0) {

            let songname = songs[(index - 1) % songs.length].split("songs/")[1].replaceAll("_", " ").split(".")[0];
            playmusic(songname);
        }


    })
    next.addEventListener("click", () => {
        let currentPath = new URL(currentSong.src).pathname;
        let index = songs.indexOf(currentPath);
        let songname = songs[(index + 1) % songs.length].split("songs/")[1].replaceAll("_", " ").split(".")[0];
        playmusic(songname);
    })

    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = e.target.value / 100;
    })



    //add dynamic folder songs
    document.querySelectorAll(".card").forEach(e => {
        e.addEventListener("click", async () => {
            songs = await getsongs(`${e.dataset.folder}`)
            play.src = "./svgs/play1.svg"
            console.log(e)

        })
        // console.log(e)
    })
}
main();