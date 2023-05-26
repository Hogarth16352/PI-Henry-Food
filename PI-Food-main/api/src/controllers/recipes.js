const axios = require('axios');
const { Op } = require('sequelize');
require( 'dotenv' ).config();
const { API_KEY, URL } = process.env;


const { Recipe, Diet } = require('../db');

const getRecipeByIdController = async ( id , dataSource ) => {
  if( dataSource === "api" ){    // Si el origen es la API, se realiza una solicitud a la API utilizando axios
    const apiUrl = `${URL}/${id}/information?includeNutrition=true&apiKey=${API_KEY}`;
    // const apiResponse = await fetch();
    const apiResponse = await axios.get( apiUrl );
    const recipe = apiResponse.data;
    // console.log(apiResponse.data);
    const apiRecipe = {
        id: recipe.id,
        name: recipe.name,
        image: recipe.image,
        summary: recipe.summary,
        healthScore: recipe.healthScore,
        // steps: recipe.steps,
        steps: recipe.analyzedInstructions[0]?.steps,
      //   steps: recipe.analyzedInstructions[0]?.steps.map(step => {
      //     return `<b>${step.number}</b> ${step.step}<br>`
      // }),
        diets: recipe.diets,
        createInDB: false
    }
    return apiRecipe;
  } else if (dataSource === 'db') {
    const recipe = await Recipe.findByPk(id);// Si el origen es la base de datos, se utiliza el modelo Recipe y su método findByPk para buscar la receta por su ID

    if (!recipe) {
      throw new Error(`Recipe with ID ${id} not found in the database.`);
    }

    const dbRecipe = {
      id: recipe.id,
      name: recipe.name,
      image: recipe.image,
      summary: recipe.summary,
      healthScore: recipe.healthScore,
      steps: recipe.steps,
      createInDB: true
    };

    return dbRecipe; // Retorna la receta obtenida de la base de datos
  } else {
    throw new Error('Invalid data source'); // Lanza un error si el origen de datos no es válido
  }
};

const searchRecipeByNameController = async (name) => {  
  const apiUrl = `${URL}/complexSearch?apiKey=${API_KEY}&query=${name}&addRecipeInformation=true&number=100`;

  const response = await axios.get(apiUrl);
  const recipes = response.data.results;
  
  const dbRecipes = await Recipe.findAll({
    where: {
      name: {
        [Op.iLike]: `%${name}%`,//Operador de comparación que se utiliza para realizar búsquedas de texto insensibles a mayúsculas y minúsculas 
      }
    }
  });

  const apiRecipes = recipes.map( recipe => {
    return {
      id: recipe.id,
      name: recipe.name,
      image: recipe.image,
      summary: recipe.summary,
      healthScore: recipe.healthScore,
      // steps: recipe.steps,
      steps: recipe.analyzedInstructions[0]?.steps,
      //   steps: recipe.analyzedInstructions[0]?.steps.map(step => {
      //     return `<b>${step.number}</b> ${step.step}<br>`
      // }),
      diets: recipe.diets,
      createInDB: false,
    };
  });

  return [...apiRecipes, ...dbRecipes];
};

const postRecipeController = async (name, image, summary, healthScore, steps, diets, createInDB ) => { 
  try {
    const [newRecipe, created] = await Recipe.findOrCreate({//retorna un array con dos elementos, el objeto creado, y  un booleano que indica si el objeto fue creada o si ya existía en la base de datos.
      where: { name },//Y para asegurarnos de que no se creen recetas duplicadas en la base de datos
      defaults: {
        name,
        image,
        summary,
        healthScore,
        steps,
        createInDB
      }
    });

    if ( !created ) {
      throw new Error("Recipe with the same name already exists");
    }

    if ( diets && diets.length > 0) {
      const dietsFound = await Diet.findAll({
        where: { name: diets }
      });

      if (dietsFound.length !== diets.length) {
        throw new Error("One or more diets not found");
      }

      await newRecipe.setDiets(dietsFound);
    }
    
    return newRecipe;
  } catch (error) {
    console.log( error );
    throw new Error("Failed to create recipe");
  }
};

module.exports =  { 
    getRecipeByIdController, 
    searchRecipeByNameController,
    postRecipeController
  };