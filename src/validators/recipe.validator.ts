import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateRecipe = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  body('prepTime')
    .isInt({ min: 0 })
    .withMessage('Preparation time must be a positive number'),
  body('cookTime')
    .isInt({ min: 0 })
    .withMessage('Cooking time must be a positive number'),
  body('difficulty')
    .isIn(['Easy', 'Medium', 'Hard'])
    .withMessage('Difficulty must be Easy, Medium, or Hard'),
  body('ingredients')
    .isArray({ min: 1 })
    .withMessage('At least one ingredient is required'),
  body('instructions')
    .isArray({ min: 1 })
    .withMessage('At least one instruction is required'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];