import { Request, Response } from 'express';
import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/auth';

export const createRecipe = async (req: AuthRequest, res: Response) => {
  const { title, description, category, prepTime, cookTime, difficulty, ingredients, instructions } = req.body;
  const userId = req.user?.id;

  try {
    const connection = await pool.getConnection();

    try {
      const recipeId = uuidv4();
      await connection.beginTransaction();

      // Insert recipe
      await connection.execute(
        'INSERT INTO recipes (id, user_id, title, description, category, prep_time, cook_time, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [recipeId, userId, title, description, category, prepTime, cookTime, difficulty]
      );

      // Insert ingredients
      for (const ingredient of ingredients) {
        await connection.execute(
          'INSERT INTO recipe_ingredients (recipe_id, ingredient) VALUES (?, ?)',
          [recipeId, ingredient]
        );
      }

      // Insert instructions
      for (let i = 0; i < instructions.length; i++) {
        await connection.execute(
          'INSERT INTO recipe_instructions (recipe_id, step_number, instruction) VALUES (?, ?, ?)',
          [recipeId, i + 1, instructions[i]]
        );
      }

      await connection.commit();
      res.status(201).json({ id: recipeId });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
};

export const getRecipes = async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [recipes] = await connection.execute('SELECT * FROM recipes ORDER BY created_at DESC');
      res.json(recipes);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
};

export const getRecipeById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const connection = await pool.getConnection();
    try {
      const [recipes] = await connection.execute('SELECT * FROM recipes WHERE id = ?', [id]);
      const recipe = recipes[0];

      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      const [ingredients] = await connection.execute(
        'SELECT * FROM recipe_ingredients WHERE recipe_id = ?',
        [id]
      );

      const [instructions] = await connection.execute(
        'SELECT * FROM recipe_instructions WHERE recipe_id = ? ORDER BY step_number',
        [id]
      );

      res.json({
        ...recipe,
        ingredients,
        instructions,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
};

export const updateRecipe = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const { title, description, category, prepTime, cookTime, difficulty, ingredients, instructions } = req.body;

  try {
    const connection = await pool.getConnection();
    try {
      // Check if recipe exists and belongs to user
      const [recipes] = await connection.execute(
        'SELECT * FROM recipes WHERE id = ? AND user_id = ?',
        [id, userId]
      );

      if (!recipes[0]) {
        return res.status(404).json({ error: 'Recipe not found or unauthorized' });
      }

      await connection.beginTransaction();

      // Update recipe
      await connection.execute(
        'UPDATE recipes SET title = ?, description = ?, category = ?, prep_time = ?, cook_time = ?, difficulty = ? WHERE id = ?',
        [title, description, category, prepTime, cookTime, difficulty, id]
      );

      // Update ingredients
      await connection.execute('DELETE FROM recipe_ingredients WHERE recipe_id = ?', [id]);
      for (const ingredient of ingredients) {
        await connection.execute(
          'INSERT INTO recipe_ingredients (recipe_id, ingredient) VALUES (?, ?)',
          [id, ingredient]
        );
      }

      // Update instructions
      await connection.execute('DELETE FROM recipe_instructions WHERE recipe_id = ?', [id]);
      for (let i = 0; i < instructions.length; i++) {
        await connection.execute(
          'INSERT INTO recipe_instructions (recipe_id, step_number, instruction) VALUES (?, ?, ?)',
          [id, i + 1, instructions[i]]
        );
      }

      await connection.commit();
      res.json({ message: 'Recipe updated successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
};

export const deleteRecipe = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        'DELETE FROM recipes WHERE id = ? AND user_id = ?',
        [id, userId]
      );

      if (!result) {
        return res.status(404).json({ error: 'Recipe not found or unauthorized' });
      }

      res.json({ message: 'Recipe deleted successfully' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
};