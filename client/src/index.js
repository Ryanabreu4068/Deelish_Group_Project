const hamMenu = document.querySelectorAll('.hamburger-menu');
const sideMenu = document.getElementById('side-menu');

const postsContainer = document.querySelector('.posts-container');

let isClicked = false;

hamMenu.forEach(menu => {
    menu.addEventListener("click", function (e) {
        isClicked = !isClicked
        // console.log(isClicked)

        isClicked ? sideMenu.style.transform = "translate(50%,0)" : sideMenu.style.transform = "translate(100%,0)";
    })
});
<<<<<<< HEAD
let result

function addPost(title, img, ingredients, instruction) {
    let ingredientList = ingredients.map((ingredient) => {
        return `<li>${ingredient}</li>`;
    }).join('');

    postsContainer.innerHTML +=
        `<div class="post">
                <div class="title">
                    <h1>${title}</h1>
                </div>

                <div class="post-img" style="background-image: url(${img})">
                    
                </div>

                <div class="post-ingredients">
                    <ul>
                        ${ingredientList}
                    </ul>
                </div>

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




console.log(recipes)
=======

const filterByfoodtype = phrase => recipes.filter(recipe => recipe.foodtype.toLowerCase().some(foodtype => foodtypes.includes(phrase)));

module.exports ={filterByfoodtype }
>>>>>>> 0371108db4a1079d22b114a60613c9b261a9f4fa
