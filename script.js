let currSong = new Audio()

function convertToMinutesSecondsFormat(totalSeconds) {
    if (typeof totalSeconds !== 'number' || isNaN(totalSeconds) || totalSeconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(){
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response
    let as = div.getElementsByTagName("a");
    let songs = [];
    for(let i=0; i<as.length; i++){
        const element = as[i];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs
}

const playMusic = (track)=>{
    currSong.src = "/songs/" + track;
    currSong.play()
    play.src = "pause.svg"
    document.querySelector(".songName").innerHTML = track;
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
    
}

async function main(){
    //Get the list of all songs
    let songs = await getSongs()

    let songOL = document.querySelector(".songlist").getElementsByTagName("ol")[0];
    // console.log(songUL)
    for (const song of songs) {
        songOL.innerHTML = songOL.innerHTML + `<li>
        <img class="invert" src="music.svg" alt="">
        <div class="info">
        <div>${song.replaceAll("%20", " ")}</div>
        <div>ArtistName</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
        <img class="invert" src="playsong.svg" alt="">
        </div>
    </li>`
    }

    playMusic(songs[0]);

    //Attach event listener to each song in playlist
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            playMusic( e.querySelector(".info").firstElementChild.innerHTML)
        })
    })

    //Add event listener to play,next and prev svgs
    play.addEventListener("click", ()=>{
        if(currSong.paused){
            currSong.play()
            play.src = "pause.svg"
        } else{
            currSong.pause()
            play.src = "playsong.svg"
        }
    })

    currSong.addEventListener("timeupdate",()=>{
        // console.log(convertToMinutesSecondsFormat(currSong.currentTime))
        document.querySelector(".songTime").innerHTML = `${convertToMinutesSecondsFormat(currSong.currentTime)}/${convertToMinutesSecondsFormat(currSong.duration)}`
        document.querySelector(".circle").style.left = (currSong.currentTime / currSong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", (e)=>{
        // console.log(e.target.getBoundingClientRect().width, e.offsetX)
        document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
        currSong.currentTime = (e.offsetX / e.target.getBoundingClientRect().width)*currSong.duration
    })

    //Add event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = 0;
    })

    //Add event listener for close
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = -90 + "%";
    })

    //Add event listener for prev and next
    prev.addEventListener("click", ()=>{
        // console.log(songs)
        // console.log(currSong.src.split("/songs/")[1])
        // console.log(index)
        let index = songs.indexOf(currSong.src.split("/songs/")[1])
        if(index-1>=0)
            playMusic(songs[index-1]);
    })

    next.addEventListener("click", ()=>{
        // console.log(songs)
        // console.log(currSong.src.split("/songs/")[1])
        // console.log(index)
        let index = songs.indexOf(currSong.src.split("/songs/")[1])
        if(index+1<songs.length)
            playMusic(songs[index+1]);
    })

}

main();
