"use strict";
/**
 * Routes des prestataires
 * Utilise le ProviderController pour la logique métier
 * Validations centralisées dans src/validations/index.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const providerController_1 = __importDefault(require("../controllers/providerController"));
const auth_1 = require("../middleware/auth");
const validations_1 = require("../validations");
const router = (0, express_1.Router)();
// GET /api/providers - Liste des prestataires (public)
router.get("/", async (req, res) => {
    await providerController_1.default.getAll(req, res);
});
// GET /api/providers/categories - Catégories disponibles
router.get("/categories", async (req, res) => {
    await providerController_1.default.getCategories(req, res);
});
// GET /api/providers/:id - Profil d'un prestataire
router.get("/:id", async (req, res) => {
    await providerController_1.default.getById(req, res);
});
// GET /api/providers/:id/services - Services d'un prestataire
router.get("/:id/services", async (req, res) => {
    await providerController_1.default.getServices(req, res);
});
// GET /api/providers/:id/reviews - Avis d'un prestataire
router.get("/:id/reviews", async (req, res) => {
    await providerController_1.default.getReviews(req, res);
});
// PUT /api/providers/profile - Mettre à jour son profil (prestataire uniquement)
router.put("/profile", auth_1.authenticate, validations_1.updateProviderProfileValidation, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    await providerController_1.default.updateProfile(req, res);
});
// PUT /api/providers/profile/availability - Mettre à jour la disponibilité
router.put("/profile/availability", auth_1.authenticate, [(0, express_validator_1.body)("availability").isObject().withMessage("Disponibilité invalide")], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    await providerController_1.default.updateAvailability(req, res);
});
// PUT /api/providers/profile/verification - Demander la vérification
router.post("/profile/verification", auth_1.authenticate, [(0, express_validator_1.body)("documents").isArray().withMessage("Documents requis")], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    await providerController_1.default.requestVerification(req, res);
});
// GET /api/providers/me/dashboard - Tableau de bord prestataire
router.get("/me/dashboard", auth_1.authenticate, async (req, res) => {
    await providerController_1.default.getDashboard(req, res);
});
// GET /api/providers/me/stats - Statistiques prestataire
router.get("/me/stats", auth_1.authenticate, async (req, res) => {
    await providerController_1.default.getStats(req, res);
});
exports.default = router;
//# sourceMappingURL=providers.js.map