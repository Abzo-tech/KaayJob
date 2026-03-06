"use strict";
/**
 * Routes d'authentification
 * Utilise le AuthController pour la logique métier
 * Validations centralisées dans src/validations/index.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authController_1 = __importDefault(require("../controllers/authController"));
const auth_1 = require("../middleware/auth");
const validations_1 = require("../validations");
const router = (0, express_1.Router)();
// POST /api/auth/register
router.post("/register", validations_1.registerValidation, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    await authController_1.default.register(req, res);
});
// POST /api/auth/login
router.post("/login", validations_1.loginValidation, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    await authController_1.default.login(req, res);
});
// GET /api/auth/me
router.get("/me", auth_1.authenticate, async (req, res) => {
    await authController_1.default.getMe(req, res);
});
// PUT /api/auth/password - Changer le mot de passe
router.put("/password", auth_1.authenticate, validations_1.changePasswordValidation, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    await authController_1.default.changePassword(req, res);
});
// PUT /api/auth/profile - Mettre à jour le profil utilisateur
router.put("/profile", auth_1.authenticate, validations_1.updateProfileValidation, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    await authController_1.default.updateProfile(req, res);
});
exports.default = router;
//# sourceMappingURL=auth.js.map