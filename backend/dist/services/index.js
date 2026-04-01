"use strict";
/**
 * Point d'exportation pour les services
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = exports.EmailService = void 0;
// Services existants
var emailService_1 = require("./emailService");
Object.defineProperty(exports, "EmailService", { enumerable: true, get: function () { return __importDefault(emailService_1).default; } });
var notificationService_1 = require("./notificationService");
Object.defineProperty(exports, "createNotification", { enumerable: true, get: function () { return notificationService_1.createNotification; } });
// Nouveaux services (business logic)
__exportStar(require("./userService"), exports);
__exportStar(require("./bookingService"), exports);
__exportStar(require("./categoryService"), exports);
__exportStar(require("./serviceService"), exports);
__exportStar(require("./paymentService"), exports);
__exportStar(require("./geolocationService"), exports);
//# sourceMappingURL=index.js.map