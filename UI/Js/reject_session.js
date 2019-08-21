var modal = document.getElementById("login_myModal");
var btn_reject = document.getElementsByClassName("rej_review"); // reject button
var closebtn = document.getElementsByClassName("login_close")[0];


btn_reject[0].onclick = function() { // click event on reject button
  modal.style.display = "block";
}
 btn_reject[1].onclick = function() { // click event on reject button
  modal.style.display = "block";
}

closebtn.onclick = function() {
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}