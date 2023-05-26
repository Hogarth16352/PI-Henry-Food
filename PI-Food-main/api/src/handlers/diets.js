const getDiets = require('../controllers/diets');

const getDietsHandler = async (req, res) => {
  try {
    const diets = await getDiets();
    return res.status(200).json(diets);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = getDietsHandler;