const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

const recipes = require( "./recipes" );
const diets = require( "./diets.js" );

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use( "/recipes", recipes );
router.use( "/diets", diets );

module.exports = router;