import { recipes } from './recipes.js';

const recipeContainer = document.getElementById('recipe-container');
let searchTerm = "";
let listOfAllIngredients =  [];
let listOfAllAppliances =  [];
let listOfAllUstensils =  [];
let activeIngredients = [];
let activeAppliances = [];
let activeUstensils = [];
let disabledIngredients = [];
let disabledAppliances = [];
let disabledUstensils = [];

recipes.forEach(renderRecipe);

function updateArrayFromActiveList(tableau, listeElement, valueGetter) {

    const elements = Array.from(listeElement.children);

    if (elements.length === 1) {
        const valeur = valueGetter(elements[0]);

        if (!tableau.includes(valeur)) {
            tableau.push(valeur);
        }
    } else {
        elements.forEach((element) => {
            const valeur = valueGetter(element);

            if (!tableau.includes(valeur)) {
                tableau.push(valeur);
            }
        });
    }
}

function updateArrayFromList(tableau, listeHTML, valueGetter, itemClass) {
    const items = Array.from(listeHTML.querySelectorAll(`.${itemClass}`));

    items.forEach((item) => {
        const valeur = valueGetter(item);

        if (!tableau.includes(valeur)) {
            tableau.push(valeur);
        }
    });
}

function updateRecipeCount(count) {
    const numberSpan = document.querySelector('.number');
    if (count > 1){
        numberSpan.innerHTML = count + ' recettes';
    }
    else{
        numberSpan.innerHTML = count + ' recette'
    }
}

updateRecipeCount(recipes.length);

function toggleChevron(chevron, removeClass, addClass) { 
    chevron.classList.remove(removeClass);
    chevron.classList.add(addClass);
}

function animateDropdownIcons(button, chevron) {
    button.addEventListener('click', () => {
        if (chevron.classList.contains("bi-chevron-down")) {
            toggleChevron(chevron, 'bi-chevron-down', 'bi-chevron-up');
        } else {
            toggleChevron(chevron, 'bi-chevron-up', 'bi-chevron-down');
        }

    });
        
}

document.addEventListener('DOMContentLoaded', function (event) {
    const ingredientsDropDownButton = document.querySelector('#dropdownButton-ingredients');
    const appliancesDropDownButton = document.querySelector('#dropdownButton-appliances');
    const ustensilsDropDownButton = document.querySelector('#dropdownButton-ustensils');
    const ingredientsChevron = document.querySelector('#chevron-ingredients');
    const appliancesChevron = document.querySelector('#chevron-appliances');
    const ustensilsChevron = document.querySelector('#chevron-ustensils');
    const appliancesList = document.querySelector('.dropdown-menu-appliances');
    const ingredientsList = document.querySelector('.dropdown-menu-ingredients');
    const ustensilsList = document.querySelector('.dropdown-menu-ustensils');
    const activeUstensilsList = document.querySelector('.active-ustensils');
    const activeAppliancesList = document.querySelector('.active-appliances');
    const activeIngredientsList = document.querySelector('.active-ingredients');


    animateDropdownIcons(ingredientsDropDownButton, ingredientsChevron);
    animateDropdownIcons(appliancesDropDownButton, appliancesChevron);
    animateDropdownIcons(ustensilsDropDownButton, ustensilsChevron);

    fillFilter();
    
    updateArrayFromList(disabledAppliances, appliancesList, (item) => item.textContent.trim(), 'dropdown-item.appliances');
    updateArrayFromList(disabledUstensils, ustensilsList, (item) => item.textContent.trim(), 'dropdown-item.ustensils');
    updateArrayFromList(disabledIngredients, ingredientsList, (item) => item.textContent.trim(), 'dropdown-item.ingredients');

    const searchInput = document.getElementById('site-search');
    searchInput.addEventListener('input',  function(event){
        searchTerm = searchInput.value.toLowerCase();
        filterRecipesByAll();
    });

    appliancesList.addEventListener('click', function (event) {
        fillFilterActivated(event, activeAppliancesList, appliancesList, activeAppliances);
        updateArrayFromActiveList(activeAppliances,activeAppliancesList,(button) => button.textContent.trim());
        filterRecipesByAll();
    });

    ingredientsList.addEventListener('click', function (event) {
        fillFilterActivated(event,  activeIngredientsList, ingredientsList, activeIngredients);
        updateArrayFromActiveList(activeIngredients,activeIngredientsList,(button) => button.textContent.trim());
        updateArrayFromList(disabledIngredients, ingredientsList, (item) => item.textContent.trim(), 'dropdown-item.ingredients');
        filterRecipesByAll();
    });

    ustensilsList.addEventListener('click', function (event) {
        fillFilterActivated(event,  activeUstensilsList, ustensilsList, activeUstensils);
        updateArrayFromActiveList(activeUstensils,activeUstensilsList,(button) => button.textContent.trim());
        updateArrayFromList(disabledUstensils, ustensilsList, (item) => item.textContent.trim(), 'dropdown-item.ustensils');
        filterRecipesByAll();
    });
});

function fillFilterActivated(event, arrayEnabled, arrayDisabled, activeArray) {
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
                removeSelectedItem(listElement, arrayEnabled, arrayDisabled, activeArray);
            });

            buttonElement.append(closeIcon);
            listElement.append(buttonElement);
            arrayEnabled.append(listElement);
            arrayDisabled.removeChild(event.target.parentNode);
        }

        function isItemAlreadySelected(arrayEnabled, selectedItemText) {
            return Array.from(arrayEnabled.children).some(element => {
                return element.textContent.includes(selectedItemText);
            });
        }

        function removeSelectedItem(listElement, arrayEnabled, arrayDisabled, activeArray) {
            arrayEnabled.removeChild(listElement);
            let listItem = document.createElement('li');
            let linkItem = document.createElement('a');
            linkItem.setAttribute('class', 'dropdown-item');
            linkItem.textContent = listElement.textContent;
            listItem.append(linkItem);
            arrayDisabled.append(listItem);
            const index = activeArray.indexOf(listElement.textContent);
            if (index !== -1) {
                activeArray.splice(index, 1);
                sortFiltersAlphabetically(arrayDisabled);
                filterRecipesByAll();
            }
        }
        function sortFiltersAlphabetically(container) {
            const items = container.querySelectorAll('li');
            const sortedItems = Array.from(items).sort((a, b) => a.textContent.localeCompare(b.textContent));
            container.innerHTML = '';
            sortedItems.forEach(item => container.appendChild(item));
        }
    }
}

function fillFilter() {
    function preprocessRecipe(recipe) {
        const lowerCaseIngredients = new Set(recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase()));
        const lowerCaseAppliances = new Set([recipe.appliance.toLowerCase()]);
        const lowerCaseUstensils = new Set(recipe.ustensils.map(ustensil => ustensil.toLowerCase()));

        return {
            ...recipe,
            ingredients: Array.from(lowerCaseIngredients).map(ingredient => ({ ingredient })),
            appliance: Array.from(lowerCaseAppliances)[0],
            ustensils: Array.from(lowerCaseUstensils)
        };
    }

    let ingredientsSet = new Set();
    for (let recipe of recipes) {
        const preprocessedRecipe = preprocessRecipe(recipe);
        for (let ingredient of preprocessedRecipe.ingredients) {
            ingredientsSet.add(ingredient.ingredient);
        }
    }
    listOfAllIngredients = Array.from(ingredientsSet).sort();
    let ingredientContainer = document.querySelector('.dropdown-menu-ingredients');
    let ingredientsHTML = listOfAllIngredients.map((ingredient) => `<li><a class="dropdown-item ingredients" href="#">${ingredient}</a></li>`).join('');
    ingredientContainer.innerHTML = '';
    ingredientContainer.innerHTML = ingredientsHTML;

    let appliancesSet = new Set();
    for (let recipe of recipes) {
        const preprocessedRecipe = preprocessRecipe(recipe);
        appliancesSet.add(preprocessedRecipe.appliance);
    }
    listOfAllAppliances = Array.from(appliancesSet).sort();
    let applianceContainer = document.querySelector('.dropdown-menu-appliances');
    let appliancesHTML = listOfAllAppliances.map((appliance) => `<li><a class="dropdown-item appliances" href="#">${appliance}</a></li>`).join('');
    applianceContainer.innerHTML = '';
    applianceContainer.innerHTML = appliancesHTML;

    let ustensilsSet = new Set();
    for (let recipe of recipes) {
        const preprocessedRecipe = preprocessRecipe(recipe);
        for (let ustensil of preprocessedRecipe.ustensils) {
            ustensilsSet.add(ustensil);
        }
    }
    listOfAllUstensils = Array.from(ustensilsSet).sort();
    let ustensilsContainer = document.querySelector('.dropdown-menu-ustensils');
    let ustensilsHTML = listOfAllUstensils.map((ustensil) => `<li><a class="dropdown-item ustensils" href="#">${ustensil}</a></li>`).join('');
    ustensilsContainer.innerHTML = '';
    ustensilsContainer.innerHTML = ustensilsHTML;
}

function highlight(text, term) {

    if (typeof text === 'string') {
        if (Array.isArray(term)) {
            const pattern = new RegExp(`(${term.join('|')})`, 'gi');
            return text.replace(pattern, '<span class="highlight">$1</span>');
        } else {
            return term ? text.replace(new RegExp(`(${term})`, 'gi'), '<span class="highlight">$1</span>') : text;
        }
    }
    return text;
}

function renderRecipe(recipe, elementsToHighlight) {

    const imagePath = `assets/Recipes/${recipe.image}`;

    const ingredientPairsHTML = recipe.ingredients.reduce((html, ingredient, index) => {
        html += `
            <div class="col-md-6">
                <ul>
                    <li class="recipe-composant">${highlight(ingredient.ingredient, elementsToHighlight)}</li>
                    <li class="recipe-composant-quantity">${highlight(ingredient.quantity || '', elementsToHighlight)} ${highlight(ingredient.unit || '', elementsToHighlight)}</li>
                </ul>
            </div>`;
        return html;
    }, '');

    const maxDescriptionLength = 200;

    const truncatedDescription = recipe.description.length > maxDescriptionLength ?
        recipe.description.substring(0, maxDescriptionLength) + '...' :
        recipe.description;

    const recipeHTML = `
        <div class="col-lg-4 col-sm-6 mb-4">
        <div class="card h-100">
        <span class="time badge bg-warning position-absolute m-2 end-0 text-dark">${recipe.time} min</span>
            <a href="#"><img class="card-img-top object-fit-cover border rounded" src="${imagePath}"  alt="${recipe.name}" data-label="${recipe.id}"></a>
            <div class="card-body">
                <h2 id="name" class="card-title">${highlight(recipe.name, elementsToHighlight)}</h2>
                <h3 id="recipe">recette</h3>
                <p id="description" class="card-text">${highlight(truncatedDescription, elementsToHighlight)}</p>
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
    
const ingredientInput = document.getElementById('search-ingredients');
ingredientInput.addEventListener('input', filterIngredients);
ingredientInput.addEventListener('change', filterIngredients);

function filterIngredients() {
    const ingredientFilter = ingredientInput.value.toLowerCase();
    const filteredIngredients = listOfAllIngredients.filter(ingredient => ingredient.includes(ingredientFilter));
    let ingredientContainer = document.querySelector('.dropdown-menu-ingredients');
    ingredientContainer.innerHTML = filteredIngredients.map((ingredient, index) => `<li><a class="dropdown-item ingredients" href="#">${ingredient}</a></li>`).join('');  
}

const applianceInput = document.getElementById('search-appliances');
applianceInput.addEventListener('input', filterAppliances);
applianceInput.addEventListener('change', filterAppliances);

function filterAppliances() {
    const applianceFilter = applianceInput.value.toLowerCase();
    const filteredAppliances = listOfAllAppliances.filter(appliance => appliance.includes(applianceFilter));
    let applianceContainer = document.querySelector('.dropdown-menu-appliances');
    applianceContainer.innerHTML = filteredAppliances.map((appliance, index) => `<li><a class="dropdown-item appliances" href="#">${appliance}</a></li>`).join('');
    
}

const utensilInput = document.getElementById('search-ustensils');
utensilInput.addEventListener('input', filterUstensils);
utensilInput.addEventListener('change', filterUstensils);

function filterUstensils() {
    const ustensilFilter = utensilInput.value.toLowerCase();
    const filteredUstensils = listOfAllUstensils.filter(ustensil => ustensil.includes(ustensilFilter));
    let ustensilContainer = document.querySelector('.dropdown-menu-ustensils');
    ustensilContainer.innerHTML = filteredUstensils.map((ustensil, index) => `<li><a class="dropdown-item ustensils"  href="#">${ustensil}</a></li>`).join('');
}

function filterRecipesByAll() {
    recipeContainer.innerHTML = "";
    const filteredRecipes = recipes.filter(recipe => {
        const hasMatchingName = recipe.name.toLowerCase().includes(searchTerm);
        const hasMatchingIngredient = recipe.ingredients.some(ingredient =>
            ingredient.ingredient.toLowerCase().includes(searchTerm)
        );
        const isSelectedIngredient = activeIngredients.length === 0 || activeIngredients.every(activeIngredient => {
                return recipe.ingredients.some(ingredientRecipe => {
                    const ingredientName = ingredientRecipe.ingredient.toLowerCase();
                    const isMatch = activeIngredient.toLowerCase() === ingredientName;
                    return isMatch;
                });
        });
        const isSelectedAppliance = activeAppliances.length === 0 || activeAppliances.some(appliance => {
            const lowerCaseAppliance = recipe.appliance.toLowerCase();
            const isMatch = lowerCaseAppliance.includes(appliance.toLowerCase());
            return isMatch;
        });
        const isSelectedUstensil = activeUstensils.length === 0 || recipe.ustensils.some(ustensil => {
            const recipeUstensils = ustensil.split(',').map(u => u.trim().toLowerCase());
            const isMatch = activeUstensils.some(activeUstensil => recipeUstensils.includes(activeUstensil.toLowerCase()));
            return isMatch
        });
        return (hasMatchingName || hasMatchingIngredient) &&
            isSelectedIngredient && isSelectedAppliance && isSelectedUstensil;
    });
    console.log(filteredRecipes);
    const elementsToHighlight = [searchTerm, ...activeIngredients, ...activeAppliances, ...activeUstensils];
    console.log(elementsToHighlight);
    filteredRecipes.forEach(recipe => renderRecipe(recipe, elementsToHighlight));
    updateRecipeCount(filteredRecipes.length);
}

