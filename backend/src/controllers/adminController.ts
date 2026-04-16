/**
 * Contrôleur pour les fonctionnalités administrateur
 * Utilise les requêtes SQL directes pour la stabilité
 */

import { Request, Response } from "express";
import { query } from "../config/database";

export class AdminController {
  /**
   * Statistiques générales du tableau de bord
   */
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      console.log('📊 Récupération des statistiques admin');

      // Statistiques de base
      const [usersResult, categoriesResult, servicesResult, bookingsResult] = await Promise.all([
        query('SELECT COUNT(*) as count FROM users'),
        query('SELECT COUNT(*) as count FROM categories'),
        query('SELECT COUNT(*) as count FROM services'),
        query('SELECT COUNT(*) as count FROM bookings')
      ]);

      const stats = {
        users: {
          total: parseInt(usersResult.rows[0].count),
          clients: 0, // TODO: calculer
          providers: 0, // TODO: calculer
        },
        categories: {
          total: parseInt(categoriesResult.rows[0].count),
          active: parseInt(categoriesResult.rows[0].count), // TODO: filtrer actives
        },
        services: {
          total: parseInt(servicesResult.rows[0].count),
          active: parseInt(servicesResult.rows[0].count), // TODO: filtrer actifs
        },
        bookings: {
          total: parseInt(bookingsResult.rows[0].count),
          pending: 0, // TODO: calculer
          confirmed: 0, // TODO: calculer
          completed: 0, // TODO: calculer
        }
      };

      res.json({ success: true, data: stats });
    } catch (error) {
      console.error('❌ Erreur statistiques:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  /**
   * Liste des utilisateurs pour l'administration
   */
  static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 100, offset = 0 } = req.query;
      console.log('👥 Récupération des utilisateurs admin');

      const users = await query(`
        SELECT id, email, first_name, last_name, phone, role, is_verified, created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `, [limit, offset]);

      res.json({ success: true, data: users.rows });
    } catch (error) {
      console.error('❌ Erreur utilisateurs:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  /**
   * Liste des services pour l'administration
   */
  static async getServices(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 100, offset = 0 } = req.query;
      console.log('🔧 Récupération des services admin');

      const services = await query(`
        SELECT s.id, s.name, s.price, s.duration, s.is_active,
               c.name as category_name, p.first_name, p.last_name
        FROM services s
        JOIN categories c ON s.category_id = c.id
        JOIN provider_profiles pp ON s.provider_id = pp.id
        JOIN users p ON pp.user_id = p.id
        ORDER BY s.created_at DESC
        LIMIT $1 OFFSET $2
      `, [limit, offset]);

      res.json({ success: true, data: services.rows });
    } catch (error) {
      console.error('❌ Erreur services:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  /**
   * Liste des réservations pour l'administration
   */
  static async getBookings(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 100, offset = 0 } = req.query;
      console.log('📅 Récupération des réservations admin');

      const bookings = await query(`
        SELECT b.id, b.date, b.time, b.status, b.total_price, b.created_at,
               u.first_name, u.last_name, u.email,
               s.name as service_name
        FROM bookings b
        JOIN users u ON b.client_id = u.id
        JOIN services s ON b.service_id = s.id
        ORDER BY b.created_at DESC
        LIMIT $1 OFFSET $2
      `, [limit, offset]);

      res.json({ success: true, data: bookings.rows });
    } catch (error) {
      console.error('❌ Erreur réservations:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }
}

export default AdminController;