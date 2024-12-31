const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Middleware
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
app.get('/', async (req, res) => {
    try {
        // Render the main page without any cocktail data initially
        res.render('index', { cocktail: null, error: null });
    } catch (error) {
        console.error('Error:', error);
        res.render('index', { cocktail: null, error: 'An error occurred' });
    }
});

app.get('/random', async (req, res) => {
    try {
        // Make API request to get a random cocktail
        const response = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php');
        const cocktail = response.data.drinks[0];

        // Process ingredients and measurements
        const ingredients = [];
        for (let i = 1; i <= 15; i++) {
            const ingredient = cocktail[`strIngredient${i}`];
            const measure = cocktail[`strMeasure${i}`];
            if (ingredient) {
                ingredients.push({
                    name: ingredient,
                    measure: measure || 'To taste'
                });
            }
        }

        // Create formatted cocktail data
        const formattedCocktail = {
            name: cocktail.strDrink,
            image: cocktail.strDrinkThumb,
            category: cocktail.strCategory,
            glass: cocktail.strGlass,
            instructions: cocktail.strInstructions,
            ingredients: ingredients
        };

        res.render('index', { cocktail: formattedCocktail, error: null });
    } catch (error) {
        console.error('Error fetching cocktail:', error);
        res.render('index', { 
            cocktail: null, 
            error: 'Failed to fetch cocktail recipe. Please try again.' 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('index', { 
        cocktail: null, 
        error: 'Something went wrong! Please try again.' 
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
