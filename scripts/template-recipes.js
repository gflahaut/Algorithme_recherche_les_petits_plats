import { recipes } from './recipes.js';

console.log(recipes);


function renderRecipe(recipe) {
    const recipeContainer = document.getElementById('recipe-container');
    const imagePath = `assets/Recipes/${recipe.image}`;
    const ingredientsHTML = recipe.ingredients.map(ingredient => {
        return `<ul>
                    <li class="recipe-composant">${ingredient.ingredient}</li>
                    <br>
                    <li class="recipe-composant-quantity">${ingredient.quantity}${ingredient.unit || ''}</li>
                </ul>`;
    }).join('');

    const recipeHTML = `
        <div class="recipe">
            <article>
                <span class="time">${recipe.time} min</span>
                <figure>
                    <img class="card-img" src="${imagePath}"  alt="${recipe.name}" data-label="${recipe.id}">
                    <figcaption>
                        <h2 id="name">${recipe.name}</h2>
                        <h3 id="recipe">recette</h3>
                        <p id="description">${recipe.description}</p>
                        <h3 id="ingredients">Ingrédients</h3>
                        <span class="list-ingredients">${ingredientsHTML}</span>
                    </figcaption>
                </figure>
            </article>
        </div>
    `;

    recipeContainer.innerHTML += recipeHTML;
}
// Appel de la fonction pour chaque recette
recipes.forEach(renderRecipe);