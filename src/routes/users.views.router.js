import { Router } from "express";

const router = Router();

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/", (req, res) =>{
    res.render("products", {
        user: req.session.user,
        admin: req.session.admin
    });
});

export default router;
