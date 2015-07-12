exports.mainPage = function (req,res) {
   res.render('index', { title: 'Primera prueba QUIZ !' });  
};
exports.author = function (req,res) {
   res.render('author', {title: 'Cŕeditos de la página'});  
};