// Image slideshow
let slideIndex = 0;

// Setting the width of the sidenav when it's opened
function openNav(event){
    // prevents page from returning back to top when sidenav is opened
    if(event) { 
        event.preventDefault();
    }
    if(window.scrollY > 10){
        document.getElementById('navbar').style.opacity = "0.8";
        console.log("in if")
    }
    console.log("in opennav")
    document.getElementById('navbar').style.opacity = "0.8";
    document.getElementById('mySidenav').style.opacity = "1";
    document.getElementById('mySidenav').style.width = "15rem";
}
// Sidenav when it's closed
function closeNav(){
    document.getElementById('mySidenav').style.width = "0";
    document.getElementById('mySidenav').style.opacity = "0.8";
    if(window.scrollY == 0){
        document.getElementById('navbar').style.opacity = "1";
    }
    else {
        document.getElementById('navbar').style.opacity = "0.8";
    }
}

// Changing opacity of navbar on scroll
function scrollDown(){
    if(window.scrollY > 0){
        document.getElementById('navbar').style.opacity = "0.8";
    }
    else {
        document.getElementById('navbar').style.opacity = "1";
    }
}

// Checkboxes shown when category is clicked on
function showCheckboxes(id){
    let checkboxes = document.getElementById(id);

    if(show){
        checkboxes.style.display = "block";
        show = false;
    }
    else {
        checkboxes.style.display = "none";
        show = true;
    }
}
// checks to see if a checkbox is checked
function isChecked(element){
    // if it's checked, the ingredient is added to ingArray
    if(document.getElementById(element).checked){
        console.log("true");
        addIngredient(element);
        return true;
    }
    // if not, the item is removed from ingArray
    console.log("false");
    removeIngredient(element);
    return false;
}

// Toggles password
function togglePassword() {
    var passwordField = document.getElementById('password');
    if (passwordField.type == "password") {
        passwordField.type = "text";
    }
    else {
        passwordField.type = "password";
    }
}

// Slideshow on main page
function showSlides() {
    let slides = document.getElementsByClassName("myslides");
    let dots = document.getElementsByClassName("dot");

    if (slides.length == 0) {
        console.error("myslides not found");
        return;
    }

    // Hide all the slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    // Move to the next slide
    slideIndex++;
    // Go back to first slide if reached end
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    // Show current slide and activate current dot
    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].style.display = "block";
    }
    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].className += " active";
    }

    // Change picture every 5 secs
    setTimeout(showSlides, 5000);
}