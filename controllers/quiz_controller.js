var models = require('../models/models.js');


//  console.log("req.quiz.id: " + req.quiz.id);
//autoload - factoriza el código si ruta incluye :quizId
exports.load = function (req,res,next,quizId) {
    models.Quiz./*find(quizId)*/find({
        where: {id: Number(quizId)},
        include: [{model: models.Comment }]
    }).then(
        function(quiz) {
            if(quiz) {
                req.quiz = quiz;
                next();
            } else {
                new Error('No existe quizId = '+ quizId)}
        }
        ).catch (function(error) {next(error);});
};


//GET quizes 
exports.index = function (req,res) {
    // get the parameter and choose if the table has to be filtered or not
    // we are looking for a word or a cluster of words so we have to deal with spaces, colons ... that could appear in the whole
    // question. This can be done by %word1%word2%
    var busqueda = req.query.search;
    var opcionesBusqueda={};
    if (busqueda) {
        busqueda=busqueda.replace(/ +/g, '%');
        opcionesBusqueda.where={pregunta: ("%" + busqueda + "%")};
    }
    models.Quiz.findAll(opcionesBusqueda).then(function(quizes) {
            res.render('quizes/index', {quizes: quizes, errors: []});
        })
    
};
// GET /quizes/show

exports.show = function (req,res) {
	models.Quiz.find(req.params.quizId).then(function(quiz)     {
		res.render('quizes/show', {quiz: req.quiz, errors: []});
	})
};

// GET /quizes/answer

exports.answer = function(req,res) { 
	models.Quiz.find(req.params.quizId).then(function(quiz) {
		if (req.query.respuesta.toLowerCase() === quiz.respuesta.toLowerCase()) {
			res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Correcto', errors: []});
		} else {
			res.render('quizes/answer', { quiz: req.quiz, respuesta: 'Incorrecto', errors: []});
		}
	})
};

exports.new = function (req,res) {
    var quiz=models.Quiz.build( //crear objeto quiz
        {pregunta: "", respuesta: "", tema: ""}
        );
    res.render ('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req,res) {
    var quiz=models.Quiz.build(req.body.quiz);
    
    quiz
        .validate()
        .then(
        function(err){
            if (err) {
                res.render('quizes/new', {quiz: quiz, errors: err.errors});
            } else {
    
            //guarda en DB los campos pregunta y respuesta de quiz
                quiz.save({fields: ["pregunta","respuesta","tema"]}).then(function(){
                    res.redirect('/quizes');
                }) // Redireccion HTTP (URL relativo) lista de preguntas
            }
        }
    );
};
exports.edit = function(req,res) {
    var quiz = req.quiz; //autoload instancia de quiz
    res.render('quizes/edit', {quiz: quiz, errors: []});
    
};
// PUT quizes/:id
exports.update = function(req,res) {
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta= req.body.quiz.respuesta;

    req.quiz
        .validate()
        .then(
        function(err){
            if (err) {
                res.render('quizes/edit', {quiz:req.quiz, errors:err.errors});
            } else {
                req.quiz
                    .save( {fields: ["pregunta","respuesta","tema"]})
                    .then(            function(){res.redirect('/quizes');});
            } //redireccion HTTP a lista de preguntas (URL relativo)
        }
  ).catch(function(error){next(error)});
};
exports.destroy = function (req,res) {
    req.quiz.destroy().then( function() {
        res.redirect('/quizes');
    }).catch(function(error){next(error)});
};
