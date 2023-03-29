import { Router } from 'express';
import { userModel } from '../Dao/DB/models/users.js';

const router = Router();

export const publicRoute = (req, res, next) => {
    if (req.session.user){
        return res.redirect('/products');
    }
    next();
};
export const privateRoute = (req, res, next) => {
    if (!req.session.user){
        return res.redirect('/users/login');
    }
    next();
};

router.post("/register", publicRoute, async (req, res)=>{
    const { first_name, last_name, email, age, password} = req.body;
    console.log("Registrando usuario:");
    console.log(req.body);

    const exists = await userModel.findOne({email});

    if (exists){
        return res.status(400).send({status: "error", message: "El suario ya existe"});
    }

    const user = {
        first_name,
        last_name,
        email,
        age,
        password
    };

    if (email === "adminCoder@coder.com" && password === "adminCod3r123"){
        user.role = 'admin';
    }

    const result = await userModel.create(user);
    res.status(201).send({status: "success", message: "Usuario creado con extito con ID: " + result.id, redirectUrl: '/users/login'});
});

router.post("/login", publicRoute, async (req, res)=>{
    const {email, password} = req.body;
    const user = await userModel.findOne({email,password}); 

    if(!user) return res.status(401).send({status:"error", error:"Los datos ingresados son inválidos"});

    req.session.user= {
        name : `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    }

    if (user.role === 'admin') {
        req.session.admin = true;
    }

    res.redirect('/products');;
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/users/login');
});

export default router;