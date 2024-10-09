// const { error } = require("console");

const hamMenu = document.querySelectorAll('.hamburger-menu');
const sideMenu = document.getElementById('side-menu');

const postsContainer = document.querySelector('.posts-container');

let mediaQuery = window.matchMedia("(max-width: 768px)");

let isClicked = false;

hamMenu.forEach(menu => {        
    menu.addEventListener("click", function (e) {
        isClicked = !isClicked
       // console.log(isClicked)
       if(mediaQuery.matches) {
            isClicked ? sideMenu.style.transform = "translate(0%,0)" : sideMenu.style.transform = "translate(100%,0)";
            
        } else {
            isClicked ? sideMenu.style.transform = "translate(100%,0)" : sideMenu.style.transform = "translate(200%,0)";
        }
    });
});
let result

function addPost(title, img, ingredients, instruction) {
    let ingredientList;
    try {
        ingredientList = ingredients.map((ingredient) => {
            return `<li>${ingredient}</li>`;
        }).join('');
    } catch (error) {
        console.error("variable is not an array")
        ingredientList = `<li>${ingredients}<li>`
    }

    postsContainer.innerHTML +=
        `<div class="post">
                <div class="title">
                    <h1>${title}</h1>
                </div>

                <div class="post-img" style="background-image: url(${img})">
                    
                </div>

                
                <h3>Ingredients</h3>
                

                <div class="post-ingredients">
                    <ul>
                        ${ingredientList}
                    </ul>
                </div>

                <h3>Instructions</h3>

                <div class="post-instructions">
                    <p>
                        ${instruction}
                    </p>
                </div>
            </div>`;
}

async function fetchUsers() {
    try {
        const response = await fetch("/users");
        if (!response.ok) {
            throw new Error("Error fetching users. Response not ok");
        }
        // there could be an error getting response/fetching the endpoint
        console.log(response);
        const users = await response.json();
        // there could be an error parsing the response
        // console.log(users);
        return users;
    } catch (error) {
        console.error("There was a problem");
        console.error(error);
    }
}

async function fetchRecipes() {
    try {
        const response = await fetch("/recipes");
        if (!response.ok) {
            throw new Error("Error fetching recipes. Response not ok");
        }
        // there could be an error getting response/fetching the endpoint
        console.log(response);
        const recipes = await response.json();
        // there could be an error parsing the response
        // console.log(recipes);

        return recipes;
    } catch (error) {
        console.error("There was a problem");
        console.error(error);
    }
}

async function renderRecipes() {
    try {
        const recipes = await fetchRecipes();
        console.log(recipes);

        const titles = recipes.map(recipe => recipe.foodname);
        const foodImgs = recipes.map(recipe => recipe.foodimage)
        const ingredients = recipes.map(recipe => recipe.ingredients);
        const instruction = recipes.map(recipe => recipe.instructions)

        for (let i = 0; i < recipes.length; i++) {
            addPost(titles[i], foodImgs[i], ingredients[i], instruction[i])
        }
    } catch (error) {
        console.error("There was a problem");
        console.error(error);
    }
    console.log(postsContainer.innerHTML)
}

renderRecipes()


const filterByfoodtype = phrase => recipes.filter(recipe => recipe.foodtype.toLowerCase().some(foodtype => foodtype.includes(phrase)));



// module.exports = { filterByfoodtype };
