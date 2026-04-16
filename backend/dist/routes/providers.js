"use strict";
/**
 * Routes pour les prestataires
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const providerController_1 = __importDefault(require("../controllers/providerController"));
const router = (0, express_1.Router)();
// GET /api/providers/map - Prestataires avec coordonnées pour la carte (doit être avant /:id)
router.get("/map", async (req, res) => {
    await providerController_1.default.getProvidersForMap(req, res);
});
// GET /api/providers - Liste des prestataires (public)
router.get("/", async (req, res) => {
    await providerController_1.default.getAll(req, res);
});
// GET /api/providers/:id - Détails d'un prestataire (doit être après les routes spécifiques)
router.get("/:id", async (req, res) => {
    await providerController_1.default.getById(req, res);
});
// TODO: Ajouter les autres routes quand le contrôleur sera complet
exports.default = router;
//# sourceMappingURL=providers.js.map