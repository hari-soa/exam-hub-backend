import { PoolClient } from "pg";
import { pool } from "../configuration/database";
import { Choice } from "../models/userModel";

export const ChoiceRepository = {
    async findByQuestionId(questionId: string): Promise<Choice[]> {
        const { rows } = await pool.query<Choice>(
            "SELECT * FROM choices WHERE question_id = $1",
            [questionId]
        );
        return rows;
    },

    async findByQuestionIds(questionIds: string[]): Promise<Choice[]> {
        if (questionIds.length === 0) return [];
        const { rows } = await pool.query<Choice>(
            "SELECT * FROM choices WHERE question_id = ANY($1::text[])",
            [questionIds]
        );
        return rows;
    },

    async findById(id: string): Promise<Choice | null> {
        const { rows } = await pool.query<Choice>(
            "SELECT * FROM choices WHERE id = $1",
            [id]
        );
        return rows[0] || null;
    },

    async create(
        client: PoolClient,
        questionId: string,
        text: string,
        isCorrect: boolean
    ): Promise<Choice> {
        const { rows } = await client.query<Choice>(
            `INSERT INTO choices (question_id, text, is_correct)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [questionId, text, isCorrect]
        );
        return rows[0];
    },

    async deleteByQuestionId(client: PoolClient, questionId: string): Promise<void> {
        await client.query("DELETE FROM choices WHERE question_id = $1", [questionId]);
    },
};