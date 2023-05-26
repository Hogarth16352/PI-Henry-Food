const { getRecipeByIdController, searchRecipeByNameController, postRecipeController } = require('../controllers/recipes');

const STATUS_OK = 200
const STATUS_ERROR = 400

const getRecipeByIdHandler = async (req, res) => {
    const { id } = req.params;
    const dataSource = isNaN(id) ? "bd" : "api";
    try {
      const recipe = await getRecipeByIdController( id, dataSource );
      res.status( STATUS_OK ).json(recipe);
    } catch (error) {
      res.status( STATUS_ERROR ).json({ error: error.message });
    }
  };

const getRecipeNameHandler = async (req, res) => {
    const { name } = req.query;  
    try {
      if ( !name ) {
        return res.status( STATUS_ERROR ).json( { message:'Name parameter is required' } );
      }  
      const recipeName = await searchRecipeByNameController( name );  
      if (recipeName.length === 0) {
        return res.status( STATUS_ERROR ).send(`No recipes found with the name: "${name}"`);
      }  
      res.status( STATUS_OK ).send( recipeName );
    } catch (error) {
      res.status( STATUS_ERROR ).json({ error: error.message });
    }
};

const postRecipeHandler = async (req, res) => {
  const { name, image, summary, healthScore, steps, diets, createInDB } = req.body; 
  try {// Verificar si faltan datos requeridos
    if( !name || !image || !summary || !healthScore || !steps || !diets || !createInDB ){
      return res
        .status( STATUS_ERROR )
        .json( { message: "Required information is missing" } )
      }
    // Llamar al controlador para crear la receta
      const newRecipe = await postRecipeController(name, image, summary, healthScore, steps, diets, createInDB);
      
      res.status( 201 ).json( newRecipe );

  } catch (error) {
      res.status( 400 ).json({ error: error.message });
  }
};
  
  module.exports = { 
    getRecipeByIdHandler, 
    getRecipeNameHandler,
    postRecipeHandler 
  };