//Definición del modelo de Quiz

/*	En primer lugar se define la estructura que debe tener
	la base de datos. Será una DB llamada Quiz,
 	con dos datos o entradas (por fila). Ambos String */
module.exports = function (sequelize, DataTypes) {
	return sequelize.define('Quiz',
		{ pregunta:  DataTypes.STRING,
		  respuesta: DataTypes.STRING
		});
}
