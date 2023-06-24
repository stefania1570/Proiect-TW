const queryString2 = window.location.search;
const urlParameters2 = new URLSearchParams(queryString2);
const clickedMovieId = urlParameters2.get('id');

function addToFavorite(clickedMovieId) {
    const url = "http://localhost:5500/add-fav";
    const cookieHeader = document.cookie;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            clickedMovieId,
            cookieHeader
        }),
    }).then(response => {
        if(response.status === 401) {
            window.location.href = "/src/views/login.html"
            window.alert("You must login to add a movie to favorite list!")
        }
        else if(response.status === 204) {
            window.alert("Movie already exists in favorite list!")
        }
        else {
            return response.json();
        }
    }).then(json => {
        console.log(json)
    }).catch(err => {
        console.log(err)
      })
  }
  
  async function removeFromFav(clickedMovieId) {
    //luam id-ul filmului de sters si cautam utilizatorul in cookie header

    const cookieHeader = document.cookie;
    const url = "http://localhost:5500/delete-api-fav";
    await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            clickedMovieId,
            cookieHeader
        })
    }).then(response => {

      return response.text
      }).then(response => {
        window.alert("Removed from favorites.")
      }).catch(err => {
      console.log(err)
      })
}
    
  
  //ADD TO FAVORITES BUTTON
  const button = document.querySelector(".addtofav");
  const done = document.querySelector(".done");
  //TODO ia added din baza de date 
  let added = false;
  
  button.addEventListener('click', () => {
    if (added) {
      done.style.transform = "translate(-110%) skew(-40deg)";
      added = false;
      removeFromFav(clickedMovieId);
    } else {
      done.style.transform = "translate(0px)";
      added = true;
      addToFavorite(clickedMovieId);
    }
  });