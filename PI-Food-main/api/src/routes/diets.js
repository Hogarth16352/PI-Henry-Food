const { Router } = require('express');

const getDietsHandler = require('../handlers/diets');


const dietRouter = Router();

// Ruta GET /diets/:idRecipe
dietRouter.get('/', getDietsHandler );

module.exports = dietRouter;