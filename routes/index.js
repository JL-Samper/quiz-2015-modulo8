var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller.js');
var appController = require('../controllers/app_controller.js');

// autoload de comandos con :quizId
router.param('quizId', quizController.load); 
/* Dependiendo del formulario, ejecutar la parte correspondiente 
   del controlador de "estado" de la app */
router.get('/',                     appController.mainPage);
router.get('/author',               appController.author);
router.get('/quizes',               quizController.index);
router.get('/quizes/:quizId(\\d+)',   quizController.show);   
router.get('/quizes/:quizId(\\d+)/answer',quizController.answer);

module.exports = router;
