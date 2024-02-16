import { recipes } from './recipes.js';

function initializePage() {


    let searchTerm = "";
    let listOfAllIngredients = [];
    let listOfAllAppliances = [];
    let listOfAllUstensils = [];
    let activeIngredients = [];
    let activeAppliances = [];
    let activeUstensils = [];
    let disabledIngredients = [];
    let disabledAppliances = [];
    let disabledUstensils = [];

    function updateArrayFromActiveList(tableau, listeElement, valueGetter) {
        const elements = Array.from(listeElement.children);
        for (const element of elements) {
            const valeur = valueGetter(element);
            if (!tableau.includes(valeur)) {
                tableau.push(valeur);
            }
        }
    }

    function updateArrayFromList(tableau, listeHTML, valueGetter, itemClass) {
        const items = Array.from(listeHTML.querySelectorAll(`.${itemClass}`));
        for (const item of items) {
            const valeur = valueGetter(item);
            if (!tableau.includes(valeur)) {
                tableau.push(valeur);
            }
        }
    }

    function updateRecipeCount(count) {
        const numberSpan = document.querySelector('.number');
        let text = count > 1 ? `${count} recettes` : `${count} recette`;
        numberSpan.innerHTML = text;
    }
    
    updateRecipeCount(recipes.length);

    function toggleChevron(chevronId) {
        const chevron = document.querySelector(`#${chevronId}`);
        chevron.classList.toggle('bi-chevron-up');
        chevron.classList.toggle('bi-chevron-down');
    }


    const recipeContainer = document.getElementById('recipe-container');
    const ingredientsDropDownButton = document.querySelector('#dropdownButton-ingredients');
    const appliancesDropDownButton = document.querySelector('#dropdownButton-appliances');
    const ustensilsDropDownButton = document.querySelector('#dropdownButton-ustensils');

    ingredientsDropDownButton.addEventListener('click', () => toggleChevron('chevron-ingredients'));
    appliancesDropDownButton.addEventListener('click', () => toggleChevron('chevron-appliances'));
    ustensilsDropDownButton.addEventListener('click', () => toggleChevron('chevron-ustensils'));

    fillFilter();

        
    const appliancesList = document.querySelector('.dropdown-menu-appliances');
    const ingredientsList = document.querySelector('.dropdown-menu-ingredients');
    const ustensilsList = document.querySelector('.dropdown-menu-ustensils');
    const activeUstensilsList = document.querySelector('.active-ustensils');
    const activeAppliancesList = document.querySelector('.active-appliances');
    const activeIngredientsList = document.querySelector('.active-ingredients');

    updateArrayFromList(disabledAppliances, document.querySelector('.dropdown-menu-appliances'), (item) => item.textContent.trim(), 'dropdown-item.appliances');
    updateArrayFromList(disabledUstensils, document.querySelector('.dropdown-menu-ustensils'), (item) => item.textContent.trim(), 'dropdown-item.ustensils');
    updateArrayFromList(disabledIngredients, document.querySelector('.dropdown-menu-ingredients'), (item) => item.textContent.trim(), 'dropdown-item.ingredients');

    const searchInput = document.getElementById('site-search');
    searchInput.addEventListener('input', function (event) {
        function handleSearch() {
            searchTerm = searchInput.value.toLowerCase();
            filterRecipesByAll();
        }

        handleSearch();
    });

    const lists = [
        { element: appliancesList, activeList: activeAppliancesList, activeArray: activeAppliances, disabledList: appliancesList, disabledArray: disabledAppliances },
        { element: ingredientsList, activeList: activeIngredientsList, activeArray: activeIngredients, disabledList: ingredientsList, disabledArray: disabledIngredients },
        { element: ustensilsList, activeList: activeUstensilsList, activeArray: activeUstensils, disabledList: ustensilsList, disabledArray: disabledUstensils }
    ];
    
    lists.forEach(({ element, activeList, activeArray, disabledList, disabledArray }) => {
        element.addEventListener('click', function (event) {
            fillFilterActivated(event, activeList, element, activeArray);
            updateArrayFromActiveList(activeArray, activeList, (button) => button.textContent.trim());
            if (disabledList !== element) {
                updateArrayFromList(disabledArray, disabledList, (item) => item.textContent.trim(), `dropdown-item.${element.classList[1]}`);
            }
            filterRecipesByAll();
        });
    });
    
    function fillFilterActivated(event, arrayEnabled, arrayDisabled, activeArray) {
        if (event.target.tagName === 'A') {
            const selectedItemText = event.target.textContent;
    
            if (!isItemAlreadySelected(arrayEnabled, selectedItemText)) {
                const listElement = createListElement(selectedItemText, arrayEnabled, arrayDisabled, activeArray);
                arrayEnabled.append(listElement);
                arrayDisabled.removeChild(event.target.parentNode);
            }
        }
    
        function isItemAlreadySelected(arrayEnabled, selectedItemText) {
            return Array.from(arrayEnabled.children).some(element => {
                return element.textContent.includes(selectedItemText);
            });
        }
    
        function createListElement(selectedItemText, arrayEnabled, arrayDisabled, activeArray) {
            const listElement = document.createElement('li');
            const buttonElement = document.createElement('button');
            const closeIcon = document.createElement('i');
            //'mr-md-2', 'mb-md-0', 'mb-2', 'mx-auto p-2', 
            buttonElement.classList.add( 'btn','btn-warning', 'btn-rounds', 'btn-lg');
            buttonElement.setAttribute('type', 'button');
            buttonElement.textContent = selectedItemText;
            
            function removeSelectedItem(listElement, arrayEnabled, arrayDisabled, activeArray) {
                arrayEnabled.removeChild(listElement);
                const listItem = document.createElement('li');
                const linkItem = document.createElement('a');
                linkItem.setAttribute('class', 'dropdown-item');
                linkItem.textContent = listElement.textContent;
                listItem.append(linkItem);
                arrayDisabled.append(listItem);
                const index = activeArray.indexOf(listElement.textContent);
                if (index >= 0) {
                    const newArray = [];
                    for (let i = 0; i < activeArray.length; i++) {
                        newArray.push(activeArray[i]);
                        activeArray.splice(index, 1);
                        console.log("Active Array after removal splice:", activeArray, "newArray after removal splice:",newArray);
                        filterRecipesByAll();
                    }
                }
            }

            closeIcon.classList.add('bi', 'bi-x');
            closeIcon.addEventListener('click', function () {
                removeSelectedItem(listElement, arrayEnabled, arrayDisabled, activeArray);
            });
            buttonElement.append(closeIcon);
            listElement.append(buttonElement);
            return listElement;
        }
    }

    function fillFilter() {
        function preprocessRecipe(recipe) {
          
            const lowerCaseIngredients = new Set();
            for (const ingredient of recipe.ingredients) {
                lowerCaseIngredients.add(ingredient.ingredient.toLowerCase());
            }
            const lowerCaseAppliances = new Set([recipe.appliance.toLowerCase()]);
            const lowerCaseUstensils = new Set();
            for (const ustensil of recipe.ustensils) {
                lowerCaseUstensils.add(ustensil.toLowerCase());
            }
            
            const ingredientsArray = [];
            for (const ingredient of lowerCaseIngredients) {
                ingredientsArray.push({ ingredient });
            }
            let filters = {
                ...recipe,
                appliance: Array.from(lowerCaseAppliances)[0],
                ustensils: Array.from(lowerCaseUstensils),
                ingredients: ingredientsArray,
            };

            return filters;
        }
        let ingredientsSet = new Set();
        for (let recipe of recipes) {
            const preprocessedRecipe = preprocessRecipe(recipe);
            for (let ingredient of preprocessedRecipe.ingredients) {
                ingredientsSet.add(ingredient.ingredient);
            }
        }
        listOfAllIngredients = Array.from(ingredientsSet);
        let ingredientContainer = document.querySelector('.dropdown-menu-ingredients');
        let sortListOfAllIngredients = listOfAllIngredients.sort();
        let ingredientsHTML = '';
        for (let ingredient of sortListOfAllIngredients) {
            ingredientsHTML += `<li><a class="dropdown-item ingredients" href="#">${ingredient}</a></li>`;
        }
    
        ingredientContainer.innerHTML = '';
        ingredientContainer.innerHTML = ingredientsHTML;
        console.log('here');
    
        let appliancesSet = new Set();
        for (let recipe of recipes) {
            const preprocessedRecipe = preprocessRecipe(recipe);
            appliancesSet.add(preprocessedRecipe.appliance);
        }
        listOfAllAppliances = Array.from(appliancesSet);
        let applianceContainer = document.querySelector('.dropdown-menu-appliances');
        let sortListOfAllAppliances = listOfAllAppliances.sort();
        let appliancesHTML = '';
    
        for (let appliance of sortListOfAllAppliances) {
            appliancesHTML += `<li><a class="dropdown-item appliances" href="#">${appliance}</a></li>`;
        }
    
        applianceContainer.innerHTML = '';
        applianceContainer.innerHTML = appliancesHTML;
    
        let ustensilsSet = new Set();
        for (let recipe of recipes) {
            const preprocessedRecipe = preprocessRecipe(recipe);
            for (let ustensil of preprocessedRecipe.ustensils) {
                ustensilsSet.add(ustensil);
            }
        }
        listOfAllUstensils = Array.from(ustensilsSet);
        let ustensilsContainer = document.querySelector('.dropdown-menu-ustensils');
        let sortListOfAllUstensils = listOfAllUstensils.sort();
        let ustensilsHTML = '';
    
        for (let ustensil of sortListOfAllUstensils) {
            ustensilsHTML += `<li><a class="dropdown-item ustensils" href="#">${ustensil}</a></li>`;
        }
    
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
    
        let ingredientPairsHTML = '';
        for (let index = 0; index < recipe.ingredients.length; index++) {
            const ingredient = recipe.ingredients[index];
            ingredientPairsHTML += `
                <div class="col-md-6">
                    <ul>
                        <li class="recipe-composant">${highlight(ingredient.ingredient, elementsToHighlight)}</li>
                        <li class="recipe-composant-quantity">${highlight(ingredient.quantity || '', elementsToHighlight)} ${highlight(ingredient.unit || '', elementsToHighlight)}</li>
                    </ul>
                </div>`;
        }
    
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
                    <h3 id="ingredients">ingredients</h3>
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
        const filteredIngredients = [];
        for (let i = 0; i < listOfAllIngredients.length; i++) {
            const ingredient = listOfAllIngredients[i];
            if (ingredient.includes(ingredientFilter)) {
                filteredIngredients.push(ingredient);
            }
        }
        let ingredientContainer = document.querySelector('.dropdown-menu-ingredients');
        let html = '';
        for (let index = 0; index < filteredIngredients.length; index++) {
            const ingredient = filteredIngredients[index];
            html += `<li><a class="dropdown-item ingredients" href="#">${ingredient}</a></li>`;
        }
        ingredientContainer.innerHTML = html;
  
    }

    const applianceInput = document.getElementById('search-appliances');
    applianceInput.addEventListener('input', filterAppliances);
    applianceInput.addEventListener('change', filterAppliances);

    function filterAppliances() {
        const applianceFilter = applianceInput.value.toLowerCase();
        const filteredAppliances = [];
        for (let i = 0; i < listOfAllAppliances.length; i++) {
            const appliance = listOfAllAppliances[i];
            if (appliance.includes(applianceFilter)) {
                filteredAppliances.push(appliance);
            }
        }
        let applianceContainer = document.querySelector('.dropdown-menu-appliances');
        let html = '';
        for (let index = 0; index < filteredAppliances.length; index++) {
            const appliance = filteredAppliances[index];
            html += `<li><a class="dropdown-item appliances" href="#">${appliance}</a></li>`;
        }
        applianceContainer.innerHTML = html;
        
    }

    const utensilInput = document.getElementById('search-ustensils');
    utensilInput.addEventListener('input', filterUstensils);
    utensilInput.addEventListener('change', filterUstensils);

    function filterUstensils() {
        const ustensilFilter = utensilInput.value.toLowerCase();
        const filteredUstensils = [];
        for (let i = 0; i < listOfAllUstensils.length; i++) {
            const ustensil = listOfAllUstensils[i];
            if (ustensil.includes(ustensilFilter)) {
                filteredUstensils.push(ustensil);
            }
        }
        let ustensilContainer = document.querySelector('.dropdown-menu-ustensils');
        let html = '';
        for (let index = 0; index < filteredUstensils.length; index++) {
            const ustensil = filteredUstensils[index];
            html += `<li><a class="dropdown-item ustensils" href="#">${ustensil}</a></li>`;
        }
        ustensilContainer.innerHTML = html;
    }
      
      
    recipes.forEach((recipe) => renderRecipe(recipe, []));

    function filterRecipesByAll() {
        console.log("FILTERING RECIPES");
        recipeContainer.innerHTML = "";
        console.log(activeIngredients);
        console.log(searchTerm);
        const allFiltersEmpty = searchTerm.trim() === '' && activeIngredients.length === 0 && activeAppliances.length === 0 && activeUstensils.length === 0;
        const filteredRecipes = [];
        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            const hasMatchingName = recipe.name.toLowerCase().includes(searchTerm);
            const hasMatchingIngredient = false;
    
            if (hasMatchingName || hasMatchingIngredient) {
                let isSelectedIngredient = true;
                if (activeIngredients.length > 0) {
                    isSelectedIngredient = true;
                    for (let j = 0; j < activeIngredients.length; j++) {
                        const activeIngredient = activeIngredients[j];
                        isSelectedIngredient = false;
    
                        for (let k = 0; k < recipe.ingredients.length; k++) {
                            const ingredientRecipe = recipe.ingredients[k];
                            const ingredientName = ingredientRecipe.ingredient.toLowerCase();
    
                            if (activeIngredient.toLowerCase() === ingredientName) {
                                isSelectedIngredient = true;
                                break;
                            }
                        }
    
                        if (!isSelectedIngredient) {
                            break;
                        }
                    }
                }
    
                let isSelectedAppliance = true;
                if (activeAppliances.length > 0) {
                    isSelectedAppliance = false;
                    for (let j = 0; j < activeAppliances.length; j++) {
                        const appliance = activeAppliances[j];
                        const lowerCaseAppliance = recipe.appliance.toLowerCase();
    
                        if (lowerCaseAppliance.includes(appliance.toLowerCase())) {
                            isSelectedAppliance = true;
                            break;
                        }
                    }
                }
    
                let isSelectedUstensil = true;
                if (activeUstensils.length > 0) {
                    isSelectedUstensil = false;
                    for (let j = 0; j < recipe.ustensils.length; j++) {
                        const ustensil = recipe.ustensils[j];
                        const recipeUstensils = [];
                        const ustensilsArray = ustensil.split(',');

                        for (const u of ustensilsArray) {
                            const trimmedUstensil = u.trim().toLowerCase();
                            recipeUstensils.push(trimmedUstensil);
                        }
                        for (let k = 0; k < activeUstensils.length; k++) {
                            const activeUstensil = activeUstensils[k];
    
                            if (recipeUstensils.includes(activeUstensil.toLowerCase())) {
                                isSelectedUstensil = true;
                                break;
                            }
                        }
    
                        if (isSelectedUstensil) {
                            break;
                        }
                    }
                }
    
                if (isSelectedIngredient && isSelectedAppliance && isSelectedUstensil) {
                    filteredRecipes.push(recipe);
                }
            }
        }
    
        console.log(filteredRecipes);
        const elementsToHighlight = [searchTerm, ...activeIngredients, ...activeAppliances, ...activeUstensils];
        console.log(elementsToHighlight);
    
        if (allFiltersEmpty) {
            recipes.forEach((recipe) => renderRecipe(recipe, []));
            activeIngredients = [];
            activeAppliances = [];
            activeUstensils = [];
            updateRecipeCount(recipes.length);
        } else if(filteredRecipes.length > 0){
            for (let i = 0; i < filteredRecipes.length; i++) {
                const recipe = filteredRecipes[i];
                renderRecipe(recipe, elementsToHighlight);
            }
            updateRecipeCount(filteredRecipes.length);
        }
        
    }
    
}
document.addEventListener('DOMContentLoaded', initializePage);
