// API that I was going to use for recipe generation (is not used in project)
// https://rapidapi.com/andero-VDilSNebN/api/recipe-generator-create-custom-recipes-from-your-ingredients/playground/apiendpoint_e8bef54d-2c47-4939-8f28-52098ee74b58
const http = require('https');

const options = {
	method: 'POST',
	hostname: 'recipe-generator-create-custom-recipes-from-your-ingredients.p.rapidapi.com',
	port: null,
	path: '/recipe',
	headers: {
		'x-rapidapi-key': '3adda61ac7msh306c7f75b2c2385p17ed81jsn7e295a31585b',
		'x-rapidapi-host': 'recipe-generator-create-custom-recipes-from-your-ingredients.p.rapidapi.com',
		'Content-Type': 'application/json'
	}
};

const req = http.request(options, function (res) {
	const chunks = [];

	res.on('data', function (chunk) {
		chunks.push(chunk);
	});

	res.on('end', function () {
		const body = Buffer.concat(chunks);
		console.log(body.toString());
	});
});

req.write(JSON.stringify({
  ingredients: 'fish, potatoes',
  strict: 1
}));
req.end();