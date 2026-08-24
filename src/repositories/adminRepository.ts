import { pool } from "../configuration/database";
import { Admin } from "../models/Admin";

export const AdminRepository = {
    async findByEmail(email: string): Promise<Admin | null> {
        const { rows } = await pool.query<Admin>(
            "SELECT * FROM admins WHERE email = $1",
            [email]
        );
        return rows[0] || null;
    },

    async create(name: string, email: string, passwordHash: string): Promise<Admin> {
        const { rows } = await pool.query<Admin>(
            "INSERT INTO admins (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
            [name, email, passwordHash]
        );
        return rows[0];
    },
};
