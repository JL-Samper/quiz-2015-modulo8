// MW de autorizacion de acccesos HTTP restringidos
// MODIFIED IN ORDER TO CONTROL THE AFK USERS IN THE APP
// if they reach the maximum time, their sessions are erased
exports.loginRequired = function(req,res,next){
    var wTimeisIt = new Date().getTime();
    if (req.session.user) {
        // Added an afk controller
        if (req.session.lastUserAction_t + 120000 > wTimeisIt) {
            console.log(" NEW PRIVATE ACTION ORDERED BY: %s ",req.session.user.username);
            next();
        } else {
            console.log("MAXIMUM AFK TIME REACHED --> %s BANNED FORM THE SYSTEM", req.session.user.username);
            req.session.errors = [{"message": 'MAXIMUM AFK TIME REACHED.\n Please, Log in Again'}];

            delete req.session.user;
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
    req.session.lastUserAction_t = wTimeisIt;

};


// GET /login -- Formulario de login
exports.new = function(req,res) {
    var errors = req.session.errors || {};
    req.session.errors = {};
    
    res.render('sessions/new',   {errors: errors});
};

// POST /login --Crear la sesion
exports.create = function (req,res) {
    var login =     req.body.login;
    var password =  req.body.password;
    
    var userController = require('./user_controller');
    userController.autenticar(login, password, function (error, user) {
        if (error) { //si hay error retornamos mensajes de error de sesión
            req.session.errors = [{"message": 'Se ha producido un error: '+error}];
            res.redirect("/login");
            return;
        }
        
        // crear req.session.user y guardar campos id y username
        // la sesion se define por la existencia de: req.session.user
        req.session.user = {id:user.id, username: user.username};
        req.session.lastUserAction_t = new Date().getTime();
        
        res.redirect(req.session.redir.toString()); //redireccion a path anterior a login
    });
};

// DELETE /logout --Destruir sesion
exports.destroy = function (req,res) {
    delete req.session.user;
    res.redirect(req.session.redir.toString()); //redirect a path anterior a login
};