// Function to add ingredient
async function addIngredient(ing) {
    // Fetches /add-ingredient endpoint
    try {
        const response = await fetch('/add-ingredient', {
            method: 'POST',
            // Tells the server that the content of the request body is in JSON format, so that it can be read properly
            headers: {
                'Content-Type': 'application/json',
            },
            // Converts the data being passed (ing) to JSON format
            body: JSON.stringify({ ingredient: ing }),
        });
        if (response.ok) {
            console.log("Ingredient has been added");
        } else {
            console.error("Failed to add ingredient");
        }
    } catch (error) {
        console.error("Error adding ingredient:", error);
    }
}

// Function to remove ingredient
async function removeIngredient(ing) {
    try {
        // Fetches /remove-ingredient endpoint
        const response = await fetch('/remove-ingredient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ingredient: ing }),
        });
        if (response.ok) {
            console.log("Ingredient has been removed");
        } else {
            console.error("Failed to remove ingredient");
        }
    } catch (error) {
        console.error("Error removing ingredient:", error);
    }
}

// Function to save meal type
async function saveMealType(meal) {
    try {
        // Fetches /save-meal-type endpoint
        const response = await fetch('/save-meal-type', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mealType: meal }),
        });
        if (response.ok) {
            console.log("Meal type has been saved");
        } else {
            console.error("Failed to save meal type");
        }
    } catch (error) {
        console.error("Error saving meal type:", error);
    }
}

// Function to reset meal type
async function deleteMealType(){
    try {
        // Fetches /delete-meal-type endpoint
        const response = await fetch('/delete-meal-type', {
            method: 'POST',
        });
        if (response.ok) {
            console.log("Meal type has been reset");
        } else {
            console.error("Failed to reset meal type");
        }
    }
    catch (error) {
        console.error("Error resetting meal type:", error);
    }
}

// Function to reset ingredient list
async function resetIngList() {
    try {
        // Fetches /reset-ingredient-list endpoint
        const response = await fetch('/reset-ingredient-list', {
            method: 'POST',
        });
        if (response.ok) {
            console.log("Ingredient list has been reset");
        } else {
            console.error("Failed to reset ingredient list");
        }
    } catch (error) {
        console.error("Error resetting ingredient list:", error);
    }
}

// Function to save generated recipe in generated-recipe.txt
async function saveRecipe() {
    try {
        // Fetches /generate-recipe endpoint
        const response = await fetch('/generate-recipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if(response.ok) {
            console.log('Recipe has been saved');
        }
        else {
            console.error("Failed to save recipe");
        }
    }
    catch(error) {
        console.error("Error saving recipe ", error);
    }
}

// Function to read recipe from generated-recipe.txt and display it in HTML
async function readRecipe() {
    try {
        console.log('Attempting to fetch recipe...');
        // Getting recipe from /read-recipe endpoint
        let response = await fetch('/read-recipe', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', 
            },
        });
        console.log('Fetch response received:', response);

        if(response.ok) {
            // Getting text from response from endpoint
            let recipeText = await response.text();
            console.log('Recipe text:', recipeText);

            // Getting recipe-container div from recipe.html to set its text content to the recipe
            let divContainer = document.getElementById('recipe-container');
            console.log('Recipe container:', divContainer);

            if(divContainer) {
                // Making sure there is no text in divContainer already, if so clearing it
                divContainer.innerHTML = '';

                // Create a pre element to save formatting like in generated-recipe.txt
                let preElement = document.createElement('pre');
                preElement.id = 'recipe';
                preElement.style.whiteSpace = 'pre-wrap';// This allows text to wrap
                preElement.style.wordWrap = 'break-word';// This breaks long words if necessary

                // Escape HTML to prevent XSS
                // Converts potentially dangerous characters in recipeText
                let escapedText = recipeText
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");

                preElement.innerHTML = escapedText;

                divContainer.appendChild(preElement);
                console.log('Recipe appended to container');
            } 
            else {
                console.error('recipe-container not found');
            }
        } 
        else {
            console.error('Failed to read recipe. Status:', response.status);
            const errorText = await response.text();
            console.error('Error response:', errorText);
        }
    } 
    catch(error) {
        console.error('Error reading recipe:', error);
    }
}

// Saves recipe as .txt file in user's downloads
async function saveAsTxt() {
    // Fetches /save-as-txt endpoint
    try {
        const response = await fetch('/save-as-txt');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Extracting filename from Content-Disposition header
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'recipe.txt'; // Default filename
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
            if (filenameMatch) {
                filename = filenameMatch[1];
            }
        }
        // Extracts the response body as a binary large object (BLOB)
        const blob = await response.blob();
        // Create a url for the BLOB
        const url = window.URL.createObjectURL(blob);
        // Creates a temporary anchor element that is clicked to trigger the download
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    } 
    catch (error) {
        console.error('Error downloading file:', error);
        alert('Error downloading file. Please try again.');
    }
}


// Call readRecipe when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');

    // Checking to see if we're on recipe.html by trying to access recipe-container
    if(document.getElementById('recipe-container')){
        console.log('On recipe page, reading recipe...');
        readRecipe();
    }
    else {
        console.log('Not on recipe.html, not reading recipe');
    }
});