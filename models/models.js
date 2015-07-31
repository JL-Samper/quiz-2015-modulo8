var path = require('path');

// Postgres DATABASE_URL = postgress://user:passwd@host:port/database
// SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

//cargar modelo ORM

var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  dialect,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);

//Importar la definición de la tabla Quiz en quiz
var Quiz = sequelize.import(path.join(__dirname,'quiz'));


//Importar la definición de la tabla Comment de comentarios
var comment_path= path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz=Quiz //exportar la definición de tabla Quiz
exports.Comment=Comment;

// sequelize.sync() crea e inicializa la tabla de preguntas en DB
sequelize.sync().then(function(){
	//success(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function (count) { //success es el método obsoleto
		if (count === 0 ) { // en caso de que esté vacía la tabla, inicializarla
			Quiz.create({ pregunta: 'Capital de Italia',
				      respuesta: 'Roma',
                      tema: 'humanidades'
					})
            Quiz.create({pregunta: 'Capital de Portugal',
                        respuesta: 'Lisboa',
                        tema: 'humanidades'
                        })
			// En caso de no dar ningún error, mostrar un mensaje
			// por consola notificando la correcta inicialización
			.then(function(){ console.log('Base de datos inicializada')});
		};	
	});
});
