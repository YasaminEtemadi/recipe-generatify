// EventListener for find-new-recipe button in checklist.html, which is supposed to generate recipe when clicked on
document.addEventListener('DOMContentLoaded', function() {
    genRecipe();
});

async function genRecipe(){
    const generateBtn = document.getElementById('generate-recipe');
    if(generateBtn) {
        generateBtn.addEventListener('click', async function() {
            // Checking to see if mealtype selection menu has a value
            const mealSelect = document.getElementById('mealtype');
            if(mealSelect.value !== ""){
                console.log("A meal type has been selected:", mealSelect.value);
                
                try {
                    const response = await fetch('/generate-recipe', { method: 'POST'});
                    if(response.ok) {
                        const result = await response.text();
                        // Redirecting to recipe.html
                        window.location.href = './html/recipe.html';
                    }
                    else {
                        const message = await response.text();
                        alert(message || 'Failed to generate recipe. Check the server terminal for details.');
                    }
                }
                catch(error) {
                    console.error('Error:', error);  
                    alert('An error occurred');
                }
            }
            else {
                event.preventDefault();
                alert("Please select a meal type before generating a recipe.");
            }
        });
    }
    else {
        console.error('Button does not exist');
    }
}