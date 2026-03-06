"use strict";
/**
 * Service d'authentification
 * Responsabilité: toute la logique métier liée à l'auth
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.createUser = exports.findUserById = exports.findUserByEmail = exports.generateToken = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_ts_1 = require(".//config/database.ts");
const JWT_SECRET = process.env.JWT_SECRET || "kaayjob-secret-key-change-in-production";
/**
 * Génère un token JWT
 */
const generateToken = (user) => {
    const options = { expiresIn: "7d" };
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, options);
};
exports.generateToken = generateToken;
/**
 * Recherche un utilisateur par email
 */
const findUserByEmail = async (email) => {
    const result = await database_ts_1.pool.query("SELECT id, email, first_name, last_name, phone, role, is_active, created_at FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0)
        return null;
    return mapRowToUser(result.rows[0]);
};
exports.findUserByEmail = findUserByEmail;
/**
 * Recherche un utilisateur par ID
 */
const findUserById = async (id) => {
    const result = await database_ts_1.pool.query("SELECT id, email, first_name, last_name, phone, role, avatar, is_active, created_at FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0)
        return null;
    return mapRowToUser(result.rows[0]);
};
exports.findUserById = findUserById;
/**
 * Crée un nouvel utilisateur
 */
const createUser = async (data) => {
    const hashedPassword = await bcryptjs_1.default.hash(data.password, 12);
    const result = await database_ts_1.pool.query(`INSERT INTO users (email, password, first_name, last_name, phone, role)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, email, first_name, last_name, phone, role, is_active, created_at`, [
        data.email,
        hashedPassword,
        data.firstName,
        data.lastName,
        data.phone,
        data.role,
    ]);
    const user = mapRowToUser(result.rows[0]);
    // Créer le profil prestataire si nécessaire
    if (data.role === "prestataire") {
        await database_ts_1.pool.query("INSERT INTO provider_profiles (user_id) VALUES ($1)", [
            user.id,
        ]);
    }
    return user;
};
exports.createUser = createUser;
/**
 * Vérifie le mot de passe
 */
const verifyPassword = async (password, hashedPassword) => {
    return bcryptjs_1.default.compare(password, hashedPassword);
};
exports.verifyPassword = verifyPassword;
/**
 * Mappe une ligne SQL en objet IUser
 */
function mapRowToUser(row) {
    return {
        id: row.id,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        phone: row.phone,
        role: row.role,
        avatar: row.avatar,
        isActive: row.is_active,
        createdAt: row.created_at,
    };
}
//# sourceMappingURL=AuthService.js.map