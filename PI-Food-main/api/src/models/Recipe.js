const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('Recipe', 
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,//generará un nuevo UUID cada vez que se inserte una nueva fila en la tabla
      unique: true,//especifica que los valores en este atributo deben ser únicos, es decir, no puede haber duplicados en la columna
      primaryKey: true,
      allowNull: false,
   },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      validate: {
         isUrl: true
      },
    }, 
    summary: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    healthScore: {
      type: DataTypes.FLOAT(),
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    },
    steps: {
      type: DataTypes.ARRAY(DataTypes.STRING()),
      // type: DataTypes.TEXT,
      allowNull: false
    },
    createInDB: {
      type: DataTypes.BOOLEAN(),
      defaultValue: true,
      allowNull: false
    }
  },
    {
      timestamps: false 
    }
  );
};