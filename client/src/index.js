const hamMenu = document.querySelectorAll('.hamburger-menu');
const sideMenu = document.getElementById('side-menu');

const postsContainer = document.querySelector('.posts-container');

let isClicked = false;

hamMenu.forEach(menu => {
    menu.addEventListener("click", function (e) {
        isClicked = !isClicked
        // console.log(isClicked)

        isClicked ? sideMenu.style.transform = "translate(200%,0)" : sideMenu.style.transform = "translate(100%,0)";
    })
});

const filterByfoodtype = phrase => recipes.filter(recipe => recipe.foodtype.toLowerCase().some(foodtype => foodtypes.includes(phrase)));

module.exports ={filterByfoodtype }
