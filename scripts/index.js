import { recipes } from './recipes.js';
console.log(recipes);

const recipeContainer = document.getElementById('recipe-container');

recipes.forEach(renderRecipe);
let listOfAllIngredients =  [];
let listOfAllAppliances =  [];
let listOfAllUstensils =  [];
fillFilter();

function updateRecipeCount(count) {
    const numberSpan = document.querySelector('.number');
    numberSpan.innerHTML = count + ' recettes';
}

updateRecipeCount(recipes.length);

function animateDropdownIcons(button, chevron){
    button.addEventListener('shown.bs.dropdown', function () {
        chevron.classList.remove('bi-chevron-down');
        chevron.classList.add('bi-chevron-up');
    });

    button.addEventListener('hidden.bs.dropdown', function () {
        chevron.classList.remove('bi-chevron-up');
        chevron.classList.add('bi-chevron-down');
    });
}


document.addEventListener('DOMContentLoaded', function () {

    const ingredientsDropDownButton = document.querySelector('#dropdownButton-ingrédients');
    const appliancesDropDownButton = document.querySelector('#dropdownButton-appliances');
    const ustensilsDropDownButton = document.querySelector('#dropdownButton-ustensils');
    const ingredientsChevron = document.querySelector('#chevron-ingrédients');
    const appliancesChevron = document.querySelector('#chevron-appliances');
    const ustensilsChevron = document.querySelector('#chevron-ustensils');

    animateDropdownIcons(ingredientsDropDownButton, ingredientsChevron);
    animateDropdownIcons(appliancesDropDownButton, appliancesChevron);
    animateDropdownIcons(ustensilsDropDownButton, ustensilsChevron);

    const appliancesList = document.querySelector('.dropdown-menu-appliances');
    const activeAppliancesList = document.querySelector('.active-appliances');

    const ingredientsList = document.querySelector('.dropdown-menu-ingredients');
    const activeIngredientsList = document.querySelector('.active-ingredients');

    const ustensilsList = document.querySelector('.dropdown-menu-ustensils');
    const activeUstensilsList = document.querySelector('.active-ustensils');

    appliancesList.addEventListener('click', function (event) {
        fillFilterActivated(event, activeAppliancesList, appliancesList)
    });
    ingredientsList.addEventListener('click', function (event) {
        fillFilterActivated(event,  activeIngredientsList, ingredientsList)
    });
    ustensilsList.addEventListener('click', function (event) {
        fillFilterActivated(event,  activeUstensilsList, ustensilsList);
    });
});

function fillFilterActivated(event, arrayEnabled, arrayDisabled) {
    if (event.target.tagName === 'A') {
        const selectedItemText = event.target.textContent;

        if (!isItemAlreadySelected(arrayEnabled, selectedItemText)) {

            let listElement = document.createElement('li');
            let buttonElement = document.createElement('button');
            let closeIcon = document.createElement('i');

            buttonElement.classList.add('btn', 'btn-warning', 'm-1');
            buttonElement.setAttribute('type', 'button');
            buttonElement.textContent = selectedItemText;

            closeIcon.classList.add('bi', 'bi-x');

            closeIcon.addEventListener('click', function () {
                removeSelectedItem(listElement, arrayEnabled, arrayDisabled, selectedItemText);
            });

            buttonElement.append(closeIcon);
            listElement.append(buttonElement);
            arrayEnabled.append(listElement);

            arrayDisabled.removeChild(event.target.parentNode);
        }
    }
}

function isItemAlreadySelected(arrayEnabled, selectedItemText) {
    return Array.from(arrayEnabled.children).some(element => {
        return element.textContent.includes(selectedItemText);
    });
}

function removeSelectedItem(listElement, arrayEnabled, arrayDisabled, selectedItemText) {
    arrayEnabled.removeChild(listElement);
    let listItem = document.createElement('li');
    let linkItem = document.createElement('a');
    linkItem.setAttribute('class', 'dropdown-item');
    linkItem.textContent = selectedItemText;
    listItem.append(linkItem);
    arrayDisabled.append(listItem);
}


function fillFilter(){
    let ingredientsSet = new Set();
                for (let recipe of recipes) {
                    for (let ingredient of recipe.ingredients) {
                        ingredientsSet.add(ingredient.ingredient);
                    }
                }
                listOfAllIngredients = Array.from(ingredientsSet);
                let ingredientContainer = document.querySelector('.dropdown-menu-ingredients');
                let ingredientsHTML = listOfAllIngredients.map((ingredient, index) => `<li><a class="dropdown-item ingredients" href="#">${ingredient}</a></li>`).join('')
                ingredientContainer.innerHTML = '';
                ingredientContainer.innerHTML = ingredientsHTML;
    let appliancesSet = new Set();
                for (let recipe of recipes) {
                    appliancesSet.add(recipe.appliance);
                }
                listOfAllAppliances = Array.from(appliancesSet);
                let applianceContainer = document.querySelector('.dropdown-menu-appliances');
                let appliancesHTML = listOfAllAppliances.map(appliance => `<li><aclass="dropdown-item appliances" href="#">${appliance}</a></li>`).join('');
                applianceContainer.innerHTML = '';
                applianceContainer.innerHTML = appliancesHTML;
    let ustensilsSet = new Set();
                    for (let recipe of recipes) {
                        for (let ustensil of recipe.ustensils) {
                            ustensilsSet.add(ustensil);
                        }
                    }
                    listOfAllUstensils = Array.from(ustensilsSet);
                    let ustensilsContainer = document.querySelector('.dropdown-menu-ustensils');
                    let ustensilsHTML = listOfAllUstensils.map(ustensil => `<li><a class="dropdown-item ustensils" href="#">${ustensil}</a></li>`).join('');
                    ustensilsContainer.innerHTML = '';
                    ustensilsContainer.innerHTML = ustensilsHTML;

}


function highlight(text, term) {
    if (typeof text === 'string') {
        return term ? text.replace(new RegExp(`(${term})`, 'gi'), '<span class="highlight">$1</span>') : text;
    } else {
        return text;
    }
}

function renderRecipe(recipe, searchTerm) {

    const imagePath = `assets/Recipes/${recipe.image}`;

    const ingredientPairsHTML = recipe.ingredients.reduce((html, ingredient, index) => {
        html += `
            <div class="col-md-6">
                <ul>
                    <li class="recipe-composant">${highlight(ingredient.ingredient, searchTerm)}</li>
                    <li class="recipe-composant-quantity">${highlight(ingredient.quantity || '', searchTerm)} ${highlight(ingredient.unit || '', searchTerm)}</li>
                </ul>
            </div>`;

        return html;
    }, '');

    // Set the maximum number of characters for the description
    const maxDescriptionLength = 200;

    // Create a truncated version of the description
    const truncatedDescription = recipe.description.length > maxDescriptionLength ?
        recipe.description.substring(0, maxDescriptionLength) + '...' :
        recipe.description;

    const recipeHTML = `
    <div class="col-lg-4 col-sm-6 mb-4">
      <div class="card h-100">
      <span class="time badge bg-warning position-absolute m-2 end-0 text-dark">${recipe.time} min</span>
        <a href="#"><img class="card-img-top object-fit-cover border rounded" src="${imagePath}"  alt="${recipe.name}" data-label="${recipe.id}"></a>
        <div class="card-body">
            <h2 id="name" class="card-title">${highlight(recipe.name, searchTerm)}</h2>
            <h3 id="recipe">recette</h3>
            <p id="description" class="card-text">${highlight(truncatedDescription, searchTerm)}</p>
            <h3 id="ingredients">Ingrédients</h3>
                    <div class="container mt-5">
                        <div class="row">
                            ${ingredientPairsHTML}
                        </div>
                    </div>
        </div>
        <span class="card-footer">${recipe.appliance} <br> ${recipe.ustensils}</span>
      </div>
    </div>
        
    `;
    recipeContainer.innerHTML += recipeHTML;
}

function searchResults(searchTerm) {
    recipeContainer.innerHTML = "";
    const filteredRecipes = recipes.filter(recipe =>
        (recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) || recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchTerm.toLowerCase())))
    );
    filteredRecipes.forEach(recipe => renderRecipe(recipe, searchTerm));
    updateRecipeCount(filteredRecipes.length);
}
    const searchInput = document.getElementById('site-search');
    searchInput.addEventListener('input', handleSearch);
    const ingredientInput = document.getElementById('search-ingredients');
    ingredientInput.addEventListener('input', filterIngredients);
    ingredientInput.addEventListener('change', filterIngredients);

    const applianceInput = document.getElementById('search-appliances');
    applianceInput.addEventListener('input', filterAppliances);
    applianceInput.addEventListener('change', filterAppliances);

    const utensilInput = document.getElementById('search-ustensils');
    utensilInput.addEventListener('input', filterUstensils);
    utensilInput.addEventListener('change', filterUstensils);

function filterIngredients() {
    const ingredientFilter = ingredientInput.value;
    const filteredIngredients = listOfAllIngredients.filter(ingredient => ingredient.includes(ingredientFilter));
    let ingredientContainer = document.querySelector('.dropdown-menu-ingredients');
    ingredientContainer.innerHTML = filteredIngredients.map((ingredient, index) => `<li><a class="dropdown-item ingredients" href="#">${ingredient}</a></li>`).join('');
    recipeContainer.innerHTML = "";
    const filteredRecipes = recipes.filter(
        recipe => (recipe.name.includes(ingredientFilter)) || recipe.ingredients.some(ingredient => ingredient.ingredient.includes(ingredientFilter))
    );
    filteredRecipes.forEach(recipe => renderRecipe(recipe, ingredientFilter));
    updateRecipeCount(filteredRecipes.length);
}

function filterAppliances() {
    const applianceFilter = applianceInput.value;
    const filteredAppliances = listOfAllAppliances.filter(appliance => appliance.includes(applianceFilter));
    let applianceContainer = document.querySelector('.dropdown-menu-appliances');
    applianceContainer.innerHTML = filteredAppliances.map((appliance, index) => `<li><a class="dropdown-item appliances" href="#">${appliance}</a></li>`).join('');
    recipeContainer.innerHTML = "";
    const filteredRecipes = recipes.filter(
        recipe => (recipe.appliance.toLowerCase().includes(applianceFilter.toLowerCase()))
    );
    filteredRecipes.forEach(recipe => renderRecipe(recipe, applianceFilter));
    updateRecipeCount(filteredRecipes.length);
}

function filterUstensils() {
    const ustensilFilter = utensilInput.value;
    const filteredUstensils = listOfAllUstensils.filter(ustensil => ustensil.includes(ustensilFilter));
    let ustensilContainer = document.querySelector('.dropdown-menu-ustensils');
    ustensilContainer.innerHTML = filteredUstensils.map((ustensil, index) => `<li><a class="dropdown-item ustensils"  href="#">${ustensil}</a></li>`).join('');
    recipeContainer.innerHTML = "";
    const filteredRecipes = recipes.filter(
        recipe => recipe.ustensils.some(ustensil => ustensil.toLowerCase().includes(ustensilFilter.toLowerCase()))
    );
    filteredRecipes.forEach(recipe => renderRecipe(recipe, ustensilFilter));
    updateRecipeCount(filteredRecipes.length);

}


function handleSearch() {
    const searchTerm = searchInput.value;
    searchResults(searchTerm);
};
