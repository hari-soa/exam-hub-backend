import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/examhub',
});

async function runSeed() {
  try {
    const seedPath = path.join(__dirname, 'seed.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf-8');
    await pool.query(seedSql);
    console.log('✅ Base de données initialisée et compte Admin créé avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution du seed :', error);
  } finally {
    await pool.end();
  }
}

runSeed();