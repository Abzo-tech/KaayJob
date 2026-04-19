"use strict";
/**
 * Routes pour les prestataires
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const providerController_1 = __importDefault(require("../controllers/providerController"));
const router = (0, express_1.Router)();
// GET /api/providers/map - Prestataires avec coordonnées pour la carte (doit être avant /:id)
router.get("/map", async (req, res) => {
    await providerController_1.default.getProvidersForMap(req, res);
});
// Routes pour la gestion du profil prestataire (authentifiées) - AVANT /:id
router.use(auth_1.authenticate);
// GET /api/providers/me - Profil du prestataire connecté (alias pour /profile)
router.get("/me", async (req, res) => {
    await providerController_1.default.getProfile(req, res);
});
// GET /api/providers/profile - Profil du prestataire connecté
router.get("/profile", async (req, res) => {
    await providerController_1.default.getProfile(req, res);
});
// PUT /api/providers/profile - Mettre à jour le profil prestataire
router.put("/profile", async (req, res) => {
    await providerController_1.default.updateProfile(req, res);
});
// PUT /api/providers/profile/location - Mettre à jour la localisation
router.put("/profile/location", async (req, res) => {
    await providerController_1.default.updateLocation(req, res);
});
// PUT /api/providers/profile/availability - Mettre à jour la disponibilité
router.put("/profile/availability", async (req, res) => {
    await providerController_1.default.updateAvailability(req, res);
});
// PUT /api/providers/profile/verification - Demander vérification
router.put("/profile/verification", async (req, res) => {
    await providerController_1.default.requestVerification(req, res);
});
// GET /api/providers - Liste des prestataires (public)
router.get("/", async (req, res) => {
    await providerController_1.default.getAll(req, res);
});
// GET /api/providers/:id - Détails d'un prestataire (doit être après les routes spécifiques)
router.get("/:id", async (req, res) => {
    await providerController_1.default.getById(req, res);
});
exports.default = router;
//# sourceMappingURL=providers.js.map