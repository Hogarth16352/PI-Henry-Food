const { Router } = require('express');

const { getRecipeByIdHandler , getRecipeNameHandler, postRecipeHandler } = require('../handlers/recipes');

const recipesRouter = Router();

// Ruta GET /recipes/:idRecipe

recipesRouter.get('/:id', getRecipeByIdHandler );

recipesRouter.get('/', getRecipeNameHandler );    

recipesRouter.post('/', postRecipeHandler );    

module.exports = recipesRouter;