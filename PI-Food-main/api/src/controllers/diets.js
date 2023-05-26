const { Diet } = require('../db');
const axios = require('axios');
require("dotenv").config();
const { API_KEY, URL } = process.env;


const cleanData = (arr) => { 
    const clean = arr.map(recipe => recipe.diets
    );
    return clean;
}

const getDiets = async () => {
    const apiDietsRaw = (  
        await axios.get(`${URL}/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`)
    ).data.results;

    const apiDiets = cleanData(apiDietsRaw).flat() 

    const diets = [...new Set(apiDiets)];

    diets.forEach( (diet) => {
        Diet.findOrCreate({
            where: {
                name: diet,
            },
        })
    })

    return [diets];
};


module.exports = getDiets;