const hamMenu = document.querySelectorAll('.hamburger-menu');
const sideMenu = document.getElementById('side-menu');


// index.js
// Required modules
const express = require('express');
const path = require('path');
const fs = require('fs').promises;

// Initialize Express application
const app = express();

const clientPath = path.join(__dirname, '..', 'client/src');
const dataPath = path.join(__dirname, 'data', 'users.json');
const fooddataPath = path.join(__dirname, 'data', 'recipes.json');
const serverPublic = path.join(__dirname, 'public');

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: clientPath });
});

app.get('/recipes', async (req, res) => {
    try {
        const data = await fs.readFile(fooddataPath, 'utf8');
        
        const recipes = JSON.parse(data);
        if (!recipes) {
            throw new Error("Error no users available");
        }
        res.status(200).json(recipes);
    } catch (error) {
        console.error("Problem getting users" + error.message);
        res.status(500).json({ error: "Problem reading users" });
    }
});


let isClicked = false;

hamMenu.forEach(menu => {
    menu.addEventListener("click", function (e) {
        isClicked = !isClicked
        // console.log(isClicked)

        isClicked ? sideMenu.style.transform = "translate(50%,0)" : sideMenu.style.transform = "translate(100%,0)";
    })
});

const filterByfoodtype = phrase => recipes.filter(recipe => recipe.foodtype.toLowerCase().some(foodtype => foodtypes.includes(phrase)));

module.exports ={filterByfoodtype }