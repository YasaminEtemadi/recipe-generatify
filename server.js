// Express.js -> server
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
// Used to save user information during session to be able to access it later
const session = require('express-session');
const bodyParser = require('body-parser');
// Used to protect passwords
const bcrypt = require('bcrypt');
// Database code
const db = require('./db.js');

// connecting gemini.js to this script
const { main } = require('./js/gemini.js');
const fs = require('fs').promises;
const path = require('path');

const app = express();

// Used to hash password
const saltRounds = 10;
const port = 8000;

// Saving session info to access user's name
app.use(session({
    secret: 'saving_session_info',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(express.json());

// Serve static files from the project root
app.use(express.static(path.join(__dirname)));

// Serve static files from the html directory
app.use(express.static(path.join(__dirname, 'html')));

// Helper function to read file
async function readFile(filename) {
    return await fs.readFile(path.join(__dirname, 'data', filename), 'utf-8');
}
// Helper function to write file
async function writeFile(filename, data) {
    await fs.writeFile(path.join(__dirname, 'data', filename), data, 'utf-8');
}

// Add ingredient
app.post('/add-ingredient', async (req, res) => {
    try {
        // Ingredient is extracted from request body
        const { ingredient } = req.body;
        const currentData = await readFile('ingredients.txt');
        // Writes ingredient to the file by appending it to existing text
        await writeFile('ingredients.txt', currentData + '\n' + ingredient);
        res.status(200).send('Ingredient added successfully');
    } catch (error) {
        console.error('Error adding ingredient:', error);
        res.status(500).send('Error adding ingredient');
    }
});

// Remove ingredient
app.post('/remove-ingredient', async (req, res) => {
    try {
        // Extracting ingredient from request body
        const { ingredient } = req.body;
        let data = await readFile('ingredients.txt');
        // Converts lines in ingredients.txt to an array
        // Looks for ingredient and cuts it out
        let ingredients = data.split('\n').filter(ing => ing.trim() !== ingredient.trim());
        await writeFile('ingredients.txt', ingredients.join('\n'));
        res.status(200).send('Ingredient removed successfully');
    } catch (error) {
        console.error('Error removing ingredient:', error);
        res.status(500).send('Error removing ingredient');
    }
});

// Save meal type
app.post('/save-meal-type', async (req, res) => {
    try {
        // req.body is used to access the data sent by the client in a POST request
        const { mealType } = req.body;
        await writeFile('meal-type.txt', mealType);
        res.status(200).send('Meal type saved successfully');
    } catch (error) {
        console.error('Error saving meal type:', error);
        res.status(500).send('Error saving meal type');
    }
});

// Delete meal type
app.post('/delete-meal-type', async (req, res) => {
    try {
        await writeFile('meal-type.txt', '');
        res.status(200).send('Meal type has been reset')
    }
    catch (error) {
        console.error('Error resetting meal type:', error);
        res.status(500).send('Error resetting meal type');
    }
});

// Reset ingredient list
app.post('/reset-ingredient-list', async (req, res) => {
    try {
        // Writing an empty String to ingredients.txt
        await writeFile('ingredients.txt', '');
        res.status(200).send('Ingredient list reset successfully');
    } catch (error) {
        console.error('Error resetting ingredient list:', error);
        res.status(500).send('Error resetting ingredient list');
    }
});

// Save generated recipe in generated-recipe.txt
app.post('/generate-recipe', async (req, res) => {
    try {
        // generating recipe by calling main() in gemini.js
        // Look to see how other information, like ingredients, are getting written to files
        // maybe the await keyword is an issue?
        // removing await keyword shows recipe saved successfully alert
        // but writes {} to file
        // FIXED!!!
        const recipe = await main();
        // writing to generated-recipe.txt
        await writeFile('generated-recipe.txt', recipe);
        res.status(200).send('Recipe saved successfully');
    }
    catch (error) {
        console.error('Recipe generation or save failed:', error);
        res.status(500).send('Recipe generation failed. Check the server terminal for details.');
    }
});

// Read from generated-recipe.txt and add it to recipe.html
app.get('/read-recipe', async (req, res) => {
    try {
        let recipe = await readFile('generated-recipe.txt');
        // Sending recipe to readRecipe()
        res.status(200).send(recipe);
    }
    catch (error) {
        console.error('Error reading recipe:', error);
        res.status(500).send('Error reading recipe');
    }
});

// Sign up
// GET
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'signup.html'));
});
// POST
app.post('/signup', (req, res) => {
    // Extracting information from the request
    const { firstname, lastname, email, password } = req.body;
    // Hashing/encrypting password using saltRounds
    // The higher the saltRounds, the more encrypted the password is
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error('Error hashing password: ', err);
            return res.status(500).send('Error during sign up');
        }
        // Inserting the information into the database table userInfo
        db.run('INSERT INTO userinfo (firstname, lastname, email, password) VALUES (?, ?, ?, ?)', [firstname, lastname, email, hash], (err) => {
            if (err) {
                console.error('Database error: ', err);
                return res.status(500).send('Error signing up');
            }
            // Brings you to login page   
            res.redirect('/login');
        });
    });
});

// Login
// GET
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'login.html'));
});
// POST
app.post('/login', (req, res) => {
    // Extracting information from the request
    const { email, password } = req.body;
    // Looking for password where the email matches the email passed in
    db.get('SELECT password FROM userinfo WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error('Database error during login:', err);
            return res.status(500).send('Unable to log in right now');
        }
        if (!row) {
            return res.status(401).send('Invalid email or password');
        }
        // Comparing password entered and password stored in database
        bcrypt.compare(password, row.password, (err, result) => {
            if (err) {
                console.error('Error comparing login password:', err);
                return res.status(500).send('Unable to log in right now');
            }
            if (result) {
                // Saving the email in the session
                req.session.userEmail = email;
                res.redirect('/home.html');
            }
            else {
                res.status(401).send('Invalid email or password');
            }
        });
    });
});

// Home page, to display user's name
app.get('/home', (req, res) => {
    // If the user is logged in
    if (req.session.userEmail) {
        // Looking for the name associated with the user's email
        db.get('SELECT firstname FROM userInfo WHERE email = ?', [req.session.userEmail], (err, row) => {
            if(err) {
                return res.status(500).json({ error: "Database error"});
            }
            if (row) {
                res.json({ firstname: row.firstname });
            }
            else {
                res.status(404).json({ error: 'User not found' });
            }
        });
    }
    else {
        // redirect to login page
        res.redirect('/login');
    }
});

// Logout, clears session 
app.get('/logout', (req, res) => {
    // Removing all information and ending session
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});

// saves recipe as txt file
app.get('/save-as-txt', async (req, res) => {
    try {
        const sourceFilePath = path.join(__dirname, 'data', 'generated-recipe.txt');
        // Creates a unique filename using a timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const newFileName = `recipe-${timestamp}.txt`;
        const content = await fs.readFile(sourceFilePath, 'utf8');

        // Plain text
        res.setHeader('Content-Type', 'text/plain');
        // The response should be downloaded with the attached filename
        res.setHeader('Content-Disposition', `attachment; filename="${newFileName}"`);
        // Triggers download
        res.send(content);
    } catch (error) {
        console.error('Error creating download:', error);
        res.status(500).json({ error: 'Error creating download', details: error.message });
    }
});


app.get('/js/generating-recipe.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'js', 'generating-recipe.js'));
});

// Add a route for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'main.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'home.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
