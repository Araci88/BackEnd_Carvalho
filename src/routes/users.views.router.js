import { Router } from "express";
import { publicRoute, privateRoute } from "./sessions.router.js";

const router = Router();

router.get("/login", publicRoute, (req, res) => {
    res.render("login");
});

router.get("/register", publicRoute, (req, res) => {
    res.render("register");
});

router.get("/", privateRoute, (req, res) =>{
    res.render("products", {
        user: req.session.user,
        admin: req.session.admin
    });
});

export default router;
