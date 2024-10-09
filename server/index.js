// index.js
// Required modules
const express = require('express');
const path = require('path');
const fs = require('fs').promises;

// Initialize Express application
const app = express();

// Define paths
const clientPath = path.join(__dirname, '..', 'client/src');
const dataPath = path.join(__dirname, 'data', 'users.json');
const fooddataPath = path.join(__dirname, 'data', 'recipes.json');
const serverPublic = path.join(__dirname, 'public');
// Middleware setup
app.use(express.static(clientPath)); // Serve static files from client directory
app.use(express.static(serverPublic));
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies

// Routes

// Home route
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: clientPath });
});

app.get('/login', (req, res) => {
    res.sendFile('pages/login.html', { root: serverPublic });
});

app.get('/users', async (req, res) => {
    try {
        const data = await fs.readFile(dataPath, 'utf8');

        const users = JSON.parse(data);
        if (!users) {
            throw new Error("Error no users available");
        }
        res.status(200).json(users);
    } catch (error) {
        console.error("Problem getting users" + error.universe);
        res.status(500).json({ error: "Problem reading users" });
    }
});
app.get('/recipes', async (req, res) => {
    try {
        const data = await fs.readFile(fooddataPath, 'utf8');

        const recipes = JSON.parse(data);
        if (!recipes) {
            throw new Error("Error no recipes available");
        }
        res.status(200).json(recipes);
    } catch (error) {
        console.error("Problem getting recipes" + error.universe);
        res.status(500).json({ error: "Problem reading recipes" });
    }
});

// Form route
app.get('/login', async (req, res) => {
    res.sendFile('pages/login.html', { root: serverPublic });
    try {
        const { name, email } = req.body;

        // Read users from the data file
        const data = await fs.readFile(dataPath, 'utf8');
        const users = JSON.parse(data);

        // Find the user
        const user = users.find(u => u.name === name && u.email === email);

        if (user) {
            // Return the user object
            res.status(200).json(user);
        } else {
            // User not found
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// updates user route
app.put('/update-user/:currentName/:currentEmail', async (req, res) => {
    try {
        const { currentName, currentEmail } = req.params;
        const { newName, newEmail } = req.body;
        console.log('Current user:', { currentName, currentEmail });
        console.log('New user data:', { newName, newEmail });
        const data = await fs.readFile(dataPath, 'utf8');
        if (data) {
            let users = JSON.parse(data);
            const userIndex = users.findIndex(user => user.name === currentName && user.email === currentEmail);
            console.log(userIndex);
            if (userIndex === -1) {
                return res.status(404).json({ message: "User not found" })
            }
            users[userIndex] = { ...users[userIndex], name: newName, email: newEmail };
            console.log(users);
            await fs.writeFile(dataPath, JSON.stringify(users, null, 2));

            res.status(200).json({ message: `You sent ${newName} and ${newEmail}` });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('An error occurred while updating the user.');
    }
});

// delete user
app.delete('/user/:name/:email', async (req, res) => {
    try {
        const { name, email } = req.params;
        // initalize an empty array of 'users'
        let users = [];
        // try to read the users.json file and cache as data
        try {
            const data = await fs.readFile(dataPath, 'utf8');
            // parse the data
            users = JSON.parse(data);
        } catch (error) {
            return res.status(404).send('File data not found');
        }
        // cache the userIndex based on a matching name and email
        const userIndex = users.findIndex(user => user.name === name && user.email === email);
        // handle a situation where the index does NOT exist
        if (userIndex === -1) {
            return res.status(404).send('User not found');
        }
        // splice the users array with the intended delete name and email
        users.splice(userIndex, 1);
        console.log(userIndex);
        console.log(users);
        // try to write the users array back to the file
        try {
            await fs.writeFile(dataPath, JSON.stringify(users, null, 2));
        } catch (error) {
            console.error('Failed to write to database');
        }
        res.send('successfully deleted user');
        // send a success deleted message
    } catch (error) {
        res.status(500).send("There was a problem");
    }
});

// Form submission route
app.post('/submit-form', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Read existing users from file
        let users = [];
        try {
            const data = await fs.readFile(dataPath, 'utf8');
            users = JSON.parse(data);
        } catch (error) {
            // If file doesn't exist or is empty, start with an empty array
            console.error('Error reading user data:', error);
            users = [];
        }
        let user;
        // Find or create user
        user = users.find(u => u.username === username && u.email === email && u.password === password);
        if (user) { }
        else {
            user = { username, email, password };
            users.push(user);
        }
        // Save updated users
        await fs.writeFile(dataPath, JSON.stringify(users, null, 2));
        res.redirect('/');
    } catch (error) {
        console.error('Error processing form:', error);
        res.status(500).send('An error occurred while processing your submission.');
    }
});


app.post('/posting-page', async (req, res) => {
    try {
        const { foodname, ingredients, instructions, foodimage, foodtype } = req.body;

        // Read existing recipes from the file
        let recipes = [];
        try {
            const data = await fs.readFile(fooddataPath, 'utf8');
            recipes = JSON.parse(data);
        } catch (error) {
            // If file doesn't exist or is empty, start with an empty array
            console.error('Error reading user data:', error);
            recipes = [];
        }

        // Find or create a recipe
        let recipe = recipes.find(recipe => recipe.foodname === foodname && recipe.ingredients === ingredients && recipe.instructions === instructions && recipe.foodimage === foodimage && recipe.foodtype === foodtype);

        recipe = { foodname, ingredients, instructions, foodimage, foodtype };
        recipes.push(recipe);
        // Save updated recipes
        await fs.writeFile(fooddataPath, JSON.stringify(recipes, null, 2));
        res.redirect('/');
    } catch (error) {
        console.error('Error processing form:', error);
        res.status(500).send('An error occurred while processing your submission.');
    }
});

app.delete('/recipe/:foodname/:ingredients/:instructions/:foodimage/:foodtype', async (req, res) => {
    try {
        // console.log req.params
        // console.log(req.params);
        // then cache returned name and email
        // as destructured variables from params
        // console.log(req.params.name);
        // console.log(req.params.email);
        const { foodname, ingredients, instructions, foodimage, foodtype } = req.params
        // initalize an empty array of 'users'
        let recipes = [];
        // try to read thes users.json file and cache as data
        try {
            const data = await fs.readFile(fooddataPath, 'utf8');
            recipes = JSON.parse(data);
        } catch (error) {
            return res.status(404).send('recipe data not found')
        }
        // cache the userIndex based on a matching name and email
        const recipeIndex = recipes.findIndex(recipe => reicpe.foodname === foodname && recipe.ingredients === ingredients && recipe.instructions === instructions && recipe.foodtype === foodtype && recipe.foodimage === foodimage );
        console.log(recipeIndex);
        if (userIndex === -1) {
            return res.status(404).send(' recipe not found');
        }
        // splice the users array with the intended delete name and email
        recipes.splice(recipeIndex, 1);
        try {
            await fs.writeFile(fooddataPath, JSON.stringify(recipes, null, 2));
        } catch (error) {
            console.error("Failed to write to database");
        }
        // send a success deleted message
        res.send('Recipe has been deleted.');
    } catch (error) {
        res.status(500).send('There was an error deleting the recipe.');
    }
});

// app.put('/update-user/:currentName/:currentPowers', async (req, res) => {
//     try {
//         const { , currentPowers } = req.params;
//         const { newName, newPowers } = req.body;
//         console.log('Current user:', { currentName, currentPowers });
//         console.log('New user data:', { newName, newPowers });
//         const data = await fs.readFile(dataPath, 'utf8');
//         if (data) {
//             let users = JSON.parse(data);
//             const userIndex = users.findIndex(user => user.name === currentName && user.powers === currentPowers);
//             console.log(userIndex);
//             if (userIndex === -1) {
//                 return res.status(404).json({ message: "User not found" })
//             }
//             users[userIndex] = { ...users[userIndex], name: newName, powers: newPowers };
//             console.log(users);
//             await fs.writeFile(dataPath, JSON.stringify(users, null, 2));

//             res.status(200).json({ message: `You sent ${newName} and ${newPowers}` });
//         }
//     } catch (error) {
//         console.error('Error updating user:', error);
//         res.status(500).send('An error occurred while updating the user.');
//     }
// });


// Update user route (currently just logs and sends a response)
// app.put('/update-user/:currentName/:currentPowers', async (req, res) => {
//     try {
//         const { currentName, currentPowers } = req.params;
//         const { newName, newPowers } = req.body;
//         console.log('Current user:', { currentName, currentPowers });
//         console.log('New user data:', { newName, newPowers });
//         const data = await fs.readFile(dataPath, 'utf8');
//         if (data) {
//             let users = JSON.parse(data);
//             const userIndex = users.findIndex(user => user.name === currentName && user.powers === currentPowers);
//             console.log(userIndex);
//             if (userIndex === -1) {
//                 return res.status(404).json({ message: "User not found" })
//             }
//             users[userIndex] = { ...users[userIndex], name: newName, powers: newPowers };
//             console.log(users);
//             await fs.writeFile(dataPath, JSON.stringify(users, null, 2));

//             res.status(200).json({ message: `You sent ${newName} and ${newPowers}` });
//         }
//     } catch (error) {
//         console.error('Error updating user:', error);
//         res.status(500).send('An error occurred while updating the user.');
//     }
// });

// app.delete('/user/:name/:email', async (req, res) => {
//     try {
//         // then cache returned name and email
//         // as destructured variables from params

//         const { name, email, password } = req.params
//         // initalize an empty array of 'users'
//         let users = [];
//         // try to read thes users.json file and cache as data
//         try {
//             const data = await fs.readFile(dataPath, 'utf8');
//             users = JSON.parse(data);
//         } catch (error) {
//             return res.status(404).send('User data not found')
//         }
//         // cache the userIndex based on a matching name and email
//         const userIndex = users.findIndex(user => user.name === name && user.powers === powers);
//         console.log(userIndex);
//         if (userIndex === -1) {
//             return res.status(404).send(' Hero not found');
//         }
//         // splice the users array with the intended delete name and email
//         users.splice(userIndex, 1);
//         try {
//             await fs.writeFile(dataPath, JSON.stringify(users, null, 2));
//         } catch (error) {
//             console.error("Failed to write to database");
//         }
//         // send a success deleted message
//         res.send('Hero has been obliterated.');
//     } catch (error) {
//         res.status(500).send('There was an error obliterating the hero.');
//     }
// });


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});