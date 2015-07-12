var path = require('path');

//cargar modelo ORM

var Sequelize = require('sequelize');

//Usar BBDD Sqlite:
var  sequelize = new Sequelize(null,null,null, {dialect: "sqlite", storage: "quiz.sqlite"});

//Importar la definición de la tabla Quiz en quiz
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

exports.Quiz=Quiz //exportar la definición de tabla Quiz

// sequelize.sync() crea e inicializa la tabla de preguntas en DB
sequelize.sync().then(function(){
	//success(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function (count) { //success es el método obsoleto
		if (count === 0 ) { // en caso de que esté vacía la tabla, inicializarla
			Quiz.create({ pregunta: 'Capital de Italia',
				      respuesta: 'Roma'
					})
            Quiz.create({pregunta: 'Capital de Portugal',
                        respuesta: 'Lisboa'
                        })
			// En caso de no dar ningún error, mostrar un mensaje
			// por consola notificando la correcta inicialización
			.then(function(){ console.log('Base de datos inicializada')});
		};	
	});
});
