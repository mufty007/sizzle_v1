import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { validateRecipe } from '../validators/recipe.validator';
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe
} from '../controllers/recipe.controller';

const router = Router();

router.get('/', getRecipes);
router.get('/:id', getRecipeById);
router.post('/', authenticateToken, validateRecipe, createRecipe);
router.put('/:id', authenticateToken, validateRecipe, updateRecipe);
router.delete('/:id', authenticateToken, deleteRecipe);

export default router;