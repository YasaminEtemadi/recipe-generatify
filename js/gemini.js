const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Function that sends a prompt to the AI
async function main(){
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not set');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    const prompt = "Give me a " + readMealType() +
    " recipe using only some or all of the following ingredients: " + getIngredientsArr();
    const result = await model.generateContent(prompt);
    // making sure text is returned
    const generatedText = result.response.text();
    // Changing to a String ignores the \n 
    //const str = JSON.stringify(generatedText);
    console.log(generatedText);
    return generatedText;
}

// Function to read from ingredients.txt and return an array of Strings
function getIngredientsArr(){
    let ingArray = 
    fs
        .readFileSync(path.join(__dirname, '..', 'data', 'ingredients.txt'), 'utf8')
        .split('\n') // converts to array
        .slice(1) // removes first empty line
        .join(); // includes commas in between ingredients

    return ingArray;
}

// Function to read meal type from meal-type.txt and return it
function readMealType(){
    let mealType = fs.readFileSync(path.join(__dirname, '..', 'data', 'meal-type.txt'), 'utf8');
    return mealType;
}

// exporting main to use in generating-recipe.js
module.exports = { main };