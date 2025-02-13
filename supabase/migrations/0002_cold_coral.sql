/*
  # Seed Recipe Data

  1. Data Added
    - Sample recipes with realistic data
    - Recipe ingredients
    - Recipe instructions
    - Sample ratings

  2. Notes
    - All recipes are linked to demo user accounts
    - Includes a variety of categories and difficulty levels
    - Realistic preparation and cooking times
*/

-- Insert demo users first (using Supabase Auth UUID generation)
INSERT INTO auth.users (id, email)
VALUES 
  ('d0d4e6e0-9f81-4c37-8d2c-bac4b0c33189', 'chef.john@example.com'),
  ('8f9b9c2e-c450-4f5c-9f2d-d6c3248d19a7', 'mary.baker@example.com')
ON CONFLICT (id) DO NOTHING;

-- Insert recipes
INSERT INTO recipes (
  id, title, description, category, prep_time, cook_time, difficulty, user_id
) VALUES
  (
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'Classic Margherita Pizza',
    'A traditional Italian pizza with fresh basil, mozzarella, and tomatoes',
    'Dinner',
    20,
    15,
    'Medium',
    'd0d4e6e0-9f81-4c37-8d2c-bac4b0c33189'
  ),
  (
    'a68d5c7d-4b3f-4b3f-8f9d-8d7c6b9c3b2a',
    'Chocolate Chip Cookies',
    'Soft and chewy cookies with melted chocolate chips',
    'Dessert',
    15,
    12,
    'Easy',
    'd0d4e6e0-9f81-4c37-8d2c-bac4b0c33189'
  ),
  (
    'b9d8c7e6-5f4d-3e2c-1a9b-8c7d6e5f4d3e',
    'Grilled Salmon Bowl',
    'Fresh grilled salmon with quinoa and roasted vegetables',
    'Dinner',
    25,
    20,
    'Medium',
    '8f9b9c2e-c450-4f5c-9f2d-d6c3248d19a7'
  ),
  (
    'c8e7d6f5-4e3d-2c1b-9a8b-7c6d5e4f3d2c',
    'Avocado Toast',
    'Creamy avocado on toasted sourdough with poached eggs',
    'Breakfast',
    10,
    5,
    'Easy',
    '8f9b9c2e-c450-4f5c-9f2d-d6c3248d19a7'
  ),
  (
    'd7f6e5d4-3c2b-1a9b-8c7d-6e5f4d3c2b1a',
    'Beef Stir Fry',
    'Quick and flavorful beef stir fry with mixed vegetables',
    'Dinner',
    20,
    15,
    'Medium',
    'd0d4e6e0-9f81-4c37-8d2c-bac4b0c33189'
  );

-- Insert ingredients
INSERT INTO recipe_ingredients (recipe_id, ingredient, amount, unit) VALUES
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Pizza Dough', '1', 'ball'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Fresh Mozzarella', '200', 'g'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Fresh Basil', '10', 'leaves'),
  
  ('a68d5c7d-4b3f-4b3f-8f9d-8d7c6b9c3b2a', 'All-Purpose Flour', '2 1/4', 'cups'),
  ('a68d5c7d-4b3f-4b3f-8f9d-8d7c6b9c3b2a', 'Chocolate Chips', '2', 'cups'),
  ('a68d5c7d-4b3f-4b3f-8f9d-8d7c6b9c3b2a', 'Butter', '1', 'cup'),
  
  ('b9d8c7e6-5f4d-3e2c-1a9b-8c7d6e5f4d3e', 'Salmon Fillet', '200', 'g'),
  ('b9d8c7e6-5f4d-3e2c-1a9b-8c7d6e5f4d3e', 'Quinoa', '1', 'cup'),
  ('b9d8c7e6-5f4d-3e2c-1a9b-8c7d6e5f4d3e', 'Mixed Vegetables', '2', 'cups');

-- Insert instructions
INSERT INTO recipe_instructions (recipe_id, step_number, instruction) VALUES
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 1, 'Preheat oven to 500°F (260°C) with pizza stone'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 2, 'Roll out pizza dough and add toppings'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 3, 'Bake for 12-15 minutes until crust is golden'),
  
  ('a68d5c7d-4b3f-4b3f-8f9d-8d7c6b9c3b2a', 1, 'Cream butter and sugars until fluffy'),
  ('a68d5c7d-4b3f-4b3f-8f9d-8d7c6b9c3b2a', 2, 'Add eggs and vanilla'),
  ('a68d5c7d-4b3f-4b3f-8f9d-8d7c6b9c3b2a', 3, 'Mix in dry ingredients and chocolate chips'),
  
  ('b9d8c7e6-5f4d-3e2c-1a9b-8c7d6e5f4d3e', 1, 'Cook quinoa according to package instructions'),
  ('b9d8c7e6-5f4d-3e2c-1a9b-8c7d6e5f4d3e', 2, 'Season and grill salmon for 4-5 minutes per side'),
  ('b9d8c7e6-5f4d-3e2c-1a9b-8c7d6e5f4d3e', 3, 'Roast vegetables and assemble bowl');

-- Insert ratings
INSERT INTO recipe_ratings (recipe_id, user_id, rating, comment) VALUES
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', '8f9b9c2e-c450-4f5c-9f2d-d6c3248d19a7', 5, 'Perfect pizza recipe!'),
  ('a68d5c7d-4b3f-4b3f-8f9d-8d7c6b9c3b2a', 'd0d4e6e0-9f81-4c37-8d2c-bac4b0c33189', 4, 'Great cookies, very easy to make'),
  ('b9d8c7e6-5f4d-3e2c-1a9b-8c7d6e5f4d3e', '8f9b9c2e-c450-4f5c-9f2d-d6c3248d19a7', 5, 'Healthy and delicious');