-- Complete Shop Product Catalog
-- Run this to seed the shop with realistic product data
-- Categories: HBCU, NCRF, BCE, LATINO, SAP, STEAM

-- Clear existing products (optional - comment out if you want to keep existing)
-- DELETE FROM shop_items;

-- HBCU Products (5 items)
INSERT INTO shop_items (
  name, 
  description, 
  price_usd, 
  category, 
  product_type,
  sizes,
  colors,
  images,
  material_info,
  shipping_info,
  stock_quantity,
  is_active
) VALUES
(
  'HBCUs MATTER Black T-Shirt',
  'Bold statement tee celebrating HBCU pride and culture. Perfect for students, alumni, and supporters who want to make a powerful statement about the importance of historically black colleges and universities.',
  24.99,
  'hbcu',
  't-shirt',
  ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL'],
  '[
    {"name": "Black", "hex": "#000000"},
    {"name": "White", "hex": "#FFFFFF"}
  ]'::jsonb,
  '{
    "front": "/src/assets/shop/hbcu-black-shirt-2.png",
    "back": "/src/assets/shop/hbcu-black-shirt-2-back.png",
    "side": "/src/assets/shop/hbcu-black-shirt-2-side.png",
    "detail": "/src/assets/shop/hbcu-black-shirt-2-detail.png"
  }'::jsonb,
  '100% Premium Cotton, Pre-shrunk, Tagless comfort, Durable screen print',
  'Ships within 2-3 business days. Free shipping on orders over $50.',
  150,
  true
),
(
  'HBCUs MATTER Grey T-Shirt',
  'Sleek grey tee with bold HBCU branding. A versatile everyday shirt that showcases your pride in historically black colleges and universities with style and comfort.',
  24.99,
  'hbcu',
  't-shirt',
  ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL'],
  '[
    {"name": "Grey", "hex": "#808080"},
    {"name": "Charcoal", "hex": "#36454F"}
  ]'::jsonb,
  '{
    "front": "/src/assets/shop/hbcu-grey-shirt.png",
    "back": "/src/assets/shop/hbcu-grey-shirt-back.png",
    "side": "/src/assets/shop/hbcu-grey-shirt-side.png",
    "detail": "/src/assets/shop/hbcu-grey-shirt-detail.png"
  }'::jsonb,
  '100% Premium Cotton, Athletic fit, Soft and breathable',
  'Ships within 2-3 business days. Free shipping on orders over $50.',
  120,
  true
),
(
  'HBCUs MATTER Camo Edition',
  'Stand out with this unique camo design featuring bold HBCUs MATTER branding. A modern take on HBCU pride that combines street style with cultural significance.',
  29.99,
  'hbcu',
  't-shirt',
  ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL'],
  '[
    {"name": "Camo Green", "hex": "#78866B"},
    {"name": "Urban Camo", "hex": "#6B6E70"}
  ]'::jsonb,
  '{
    "front": "/src/assets/shop/hbcu-camo-shirt.png",
    "back": "/src/assets/shop/hbcu-camo-shirt-back.png",
    "side": "/src/assets/shop/hbcu-camo-shirt-side.png",
    "detail": "/src/assets/shop/hbcu-camo-shirt-detail.png"
  }'::jsonb,
  'Cotton blend with moisture-wicking, All-over camo pattern, Premium graphics',
  'Ships within 2-3 business days. Free shipping on orders over $50.',
  100,
  true
),
(
  'HBCU Pride Hoodie',
  'Premium pullover hoodie perfect for showing your HBCU pride in style. Features soft fleece interior, adjustable drawstring hood, and bold branding. Stay warm and represent!',
  49.99,
  'hbcu',
  'hoodie',
  ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL'],
  '[
    {"name": "Black", "hex": "#000000"},
    {"name": "Grey", "hex": "#808080"},
    {"name": "Navy", "hex": "#001F3F"}
  ]'::jsonb,
  '{
    "front": "/src/assets/shop/black-hoodie-2.png",
    "back": "/src/assets/shop/black-hoodie-2-back.png",
    "side": "/src/assets/shop/black-hoodie-2-side.png",
    "detail": "/src/assets/shop/black-hoodie-2-detail.png"
  }'::jsonb,
  '80% Cotton, 20% Polyester fleece, Ribbed cuffs and waistband, Kangaroo pocket',
  'Ships within 3-5 business days. Free shipping on orders over $50.',
  80,
  true
),
(
  'HBCU Classic Crewneck',
  'Timeless crewneck sweatshirt with embroidered HBCU logo. Perfect for game days, campus events, or casual everyday wear. Classic fit with premium comfort.',
  39.99,
  'hbcu',
  'sweatshirt',
  ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL'],
  '[
    {"name": "Black", "hex": "#000000"},
    {"name": "Maroon", "hex": "#800000"},
    {"name": "Gold", "hex": "#FFD700"}
  ]'::jsonb,
  '{
    "front": "/src/assets/shop/black-shirt-1.png",
    "back": "/src/assets/shop/black-shirt-1.png",
    "side": "/src/assets/shop/black-shirt-1.png",
    "detail": "/src/assets/shop/black-shirt-1.png"
  }'::jsonb,
  '80% Cotton, 20% Polyester, Embroidered logo, Ribbed collar and cuffs',
  'Ships within 2-3 business days. Free shipping on orders over $50.',
  90,
  true
),

-- NCRF Products (3 items)
(
  'NCRF Foundation Black Tee',
  'Official NCRF Foundation t-shirt supporting educational initiatives. Clean design with the NCRF logo proudly displayed. Every purchase supports scholarship programs.',
  22.99,
  'ncrf',
  't-shirt',
  ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL'],
  '[
    {"name": "Black", "hex": "#000000"},
    {"name": "White", "hex": "#FFFFFF"},
    {"name": "Green", "hex": "#228B22"}
  ]'::jsonb,
  '{
    "front": "/src/assets/shop/ncrf-black-shirt-2.png",
    "back": "/src/assets/shop/ncrf-black-shirt-2-back.png",
    "side": "/src/assets/shop/ncrf-black-shirt-2-side.png",
    "detail": "/src/assets/shop/ncrf-black-shirt-2-detail.png"
  }'::jsonb,
  '100% Premium Cotton, Soft hand feel, Classic fit, Reinforced shoulder seams',
  'Ships within 2-3 business days. Free shipping on orders over $50.',
  140,
  true
),
(
  'NCRF Scholar Hoodie',
  'Premium NCRF hoodie for scholars and supporters. Features the foundation logo with "Building Future Leaders" tagline. Comfortable and meaningful.',
  49.99,
  'ncrf',
  'hoodie',
  ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL'],
  '[
    {"name": "Black", "hex": "#000000"},
    {"name": "Grey", "hex": "#808080"},
    {"name": "Forest Green", "hex": "#228B22"}
  ]'::jsonb,
  '{
    "front": "/src/assets/shop/black-hoodie.png",
    "back": "/src/assets/shop/black-hoodie.png",
    "side": "/src/assets/shop/black-hoodie.png",
    "detail": "/src/assets/shop/black-hoodie.png"
  }'::jsonb,
  '80% Cotton, 20% Polyester, Fleece lined, Front pocket, Adjustable hood',
  'Ships within 3-5 business days. Free shipping on orders over $50.',
  75,
  true
),
(
  'NCRF Green Logo Shirt',
  'Eye-catching tee with vibrant green NCRF logo. Perfect for foundation events, fundraisers, and showing your support for educational equity.',
  24.99,
  'ncrf',
  't-shirt',
  ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL'],
  '[
    {"name": "Black with Green", "hex": "#000000"},
    {"name": "White with Green", "hex": "#FFFFFF"},
    {"name": "Grey with Green", "hex": "#808080"}
  ]'::jsonb,
  '{
    "front": "/src/assets/shop/ncrf-black-shirt.png",
    "back": "/src/assets/shop/ncrf-black-shirt.png",
    "side": "/src/assets/shop/ncrf-black-shirt.png",
    "detail": "/src/assets/shop/ncrf-black-shirt.png"
  }'::jsonb,
  '100% Cotton, Vibrant eco-friendly print, Comfortable fit, Tagless label',
  'Ships within 2-3 business days. Free shipping on orders over $50.',
  110,
  true
),

-- BCE Products (3 items)
(
  'Black College Expo Tee',
  'Official Black College Expo t-shirt. Perfect for attendees, volunteers, and supporters of higher education opportunities. Classic design with bold BCE branding.',
  24.99,
  'bce',
  't-shirt',
  ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL'],
  '[
    {"name": "Black", "hex": "#000000"},
    {"name": "Navy", "hex": "#001F3F"},
    {"name": "Royal Blue", "hex": "#4169E1"}
  ]'::jsonb,
  '{
    "front": "/src/assets/shop/bce-black-shirt.png",
    "back": "/src/assets/shop/bce-black-shirt.png",
    "side": "/src/assets/shop/bce-black-shirt.png",
    "detail": "/src/assets/shop/bce-black-shirt.png"
  }'::jsonb,
  '100% Premium Cotton, Pre-shrunk, Athletic fit, Durable print',
  'Ships within 2-3 business days. Free shipping on orders over $50.',
  200,
  true
),
(
  'BCE Green Logo Shirt',
  'Stand out at college fairs with this striking BCE shirt featuring green accent graphics. Represents growth, opportunity, and educational excellence.',
  24.99,
  'bce',
  't-shirt',
  ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL'],
  '[
    {"name": "Black with Green", "hex": "#000000"},
    {"name": "White with Green", "hex": "#FFFFFF"}
  ]'::jsonb,
  '{
    "front": "/src/assets/shop/bce-black-shirt-green.png",
    "back": "/src/assets/shop/bce-black-shirt-green.png",
    "side": "/src/assets/shop/bce-black-shirt-green.png",
    "detail": "/src/assets/shop/bce-black-shirt-green.png"
  }'::jsonb,
  '100% Cotton, Eco-friendly ink, Soft hand feel, Reinforced stitching',
  'Ships within 2-3 business days. Free shipping on orders over $50.',
  130,
  true
),
(
  'BCE Premium Hoodie',
  'Premium Black College Expo hoodie for cold weather events and year-round support. Features embroidered logo and quality construction.',
  52.99,
  'bce',
  'hoodie',
  ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL'],
  '[
    {"name": "Black", "hex": "#000000"},
    {"name": "Grey", "hex": "#808080"},
    {"name": "Navy", "hex": "#001F3F"}
  ]'::jsonb,
  '{
    "front": "/src/assets/shop/black-hoodie.png",
    "back": "/src/assets/shop/black-hoodie.png",
    "side": "/src/assets/shop/black-hoodie.png",
    "detail": "/src/assets/shop/black-hoodie.png"
  }'::jsonb,
  '80% Cotton, 20% Polyester, Embroidered logo, Heavy fleece, Premium quality',
  'Ships within 3-5 business days. Free shipping on orders over $50.',
  85,
  true
),

-- LATINO Products (3 items)
(
  'Latino College Expo Red Tee',
  'Vibrant red tee representing Latino excellence in higher education. Bold design celebrating Latino college-bound students and their achievements.',
  24.99,
  'latino',
  't-shirt',
  ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL'],
  '[
    {"name": "Red", "hex": "#DC143C"},
    {"name": "Black", "hex": "#000000"},
    {"name": "White", "hex": "#FFFFFF"}
  ]'::jsonb,
  '{
    "front": "/src/assets/shop/red-shirt.png",
    "back": "/src/assets/shop/red-shirt.png",
    "side": "/src/assets/shop/red-shirt.png",
    "detail": "/src/assets/shop/red-shirt.png"
  }'::jsonb,
  '100% Premium Cotton, Vibrant colorfast print, Classic fit, Comfortable all-day wear',
  'Ships within 2-3 business days. Free shipping on orders over $50.',
  160,
  true
),
(
  'Latino Pride Red Sweater',
  'Cozy red sweater perfect for fall college fairs and campus visits. Represents Latino pride and educational excellence with style and comfort.',
  44.99,
  'latino',
  'sweatshirt',
  ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL'],
  '[
    {"name": "Red", "hex": "#DC143C"},
    {"name": "Burgundy", "hex": "#800020"},
    {"name": "Black", "hex": "#000000"}
  ]'::jsonb,
  '{
    "front": "/src/assets/shop/red-sweater.png",
    "back": "/src/assets/shop/red-sweater.png",
    "side": "/src/assets/shop/red-sweater.png",
    "detail": "/src/assets/shop/red-sweater.png"
  }'::jsonb,
  '80% Cotton, 20% Polyester, Soft interior, Ribbed collar and cuffs, Classic crewneck',
  'Ships within 2-3 business days. Free shipping on orders over $50.',
  95,
  true
),
(
  'Latino Excellence Hoodie',
  'Premium hoodie celebrating Latino excellence in education. Features bold graphics and quality construction for maximum comfort and pride.',
  49.99,
  'latino',
  'hoodie',
  ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL'],
  '[
    {"name": "Red", "hex": "#DC143C"},
    {"name": "Black", "hex": "#000000"},
    {"name": "Grey", "hex": "#808080"}
  ]'::jsonb,
  '{
    "front": "/src/assets/shop/black-hoodie.png",
    "back": "/src/assets/shop/black-hoodie.png",
    "side": "/src/assets/shop/black-hoodie.png",
    "detail": "/src/assets/shop/black-hoodie.png"
  }'::jsonb,
  '80% Cotton, 20% Polyester, Fleece lined, Kangaroo pocket, Adjustable drawstring',
  'Ships within 3-5 business days. Free shipping on orders over $50.',
  70,
  true
),

-- SAP Products (2 items)
(
  'Student Athlete Program Grey Tee',
  'Official SAP tee for student athletes balancing sports and academics. Comfortable design perfect for training, travel, and everyday wear.',
  24.99,
  'sap',
  't-shirt',
  ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL'],
  '[
    {"name": "Grey", "hex": "#808080"},
    {"name": "Black", "hex": "#000000"},
    {"name": "Navy", "hex": "#001F3F"}
  ]'::jsonb,
  '{
    "front": "/src/assets/shop/grey-shirt.png",
    "back": "/src/assets/shop/grey-shirt.png",
    "side": "/src/assets/shop/grey-shirt.png",
    "detail": "/src/assets/shop/grey-shirt.png"
  }'::jsonb,
  '100% Premium Cotton, Athletic fit, Breathable fabric, Reinforced seams',
  'Ships within 2-3 business days. Free shipping on orders over $50.',
  170,
  true
),
(
  'SAP Performance Shirt',
  'High-performance tee designed for active student athletes. Moisture-wicking fabric keeps you comfortable during training and competition.',
  29.99,
  'sap',
  't-shirt',
  ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL'],
  '[
    {"name": "Grey", "hex": "#808080"},
    {"name": "Black", "hex": "#000000"},
    {"name": "Royal Blue", "hex": "#4169E1"}
  ]'::jsonb,
  '{
    "front": "/src/assets/shop/grey-shirt.png",
    "back": "/src/assets/shop/grey-shirt.png",
    "side": "/src/assets/shop/grey-shirt.png",
    "detail": "/src/assets/shop/grey-shirt.png"
  }'::jsonb,
  'Performance moisture-wicking fabric, Anti-odor technology, Athletic fit, Quick-dry',
  'Ships within 2-3 business days. Free shipping on orders over $50.',
  140,
  true
),

-- STEAM Products (2 items)
(
  'STEAM Program Black Tee',
  'Show your passion for Science, Technology, Engineering, Arts, and Mathematics with this sleek STEAM program tee. Perfect for future innovators.',
  24.99,
  'steam',
  't-shirt',
  ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL'],
  '[
    {"name": "Black", "hex": "#000000"},
    {"name": "Navy", "hex": "#001F3F"},
    {"name": "Purple", "hex": "#800080"}
  ]'::jsonb,
  '{
    "front": "/src/assets/shop/steam-black-shirt.png",
    "back": "/src/assets/shop/steam-black-shirt.png",
    "side": "/src/assets/shop/steam-black-shirt.png",
    "detail": "/src/assets/shop/steam-black-shirt.png"
  }'::jsonb,
  '100% Premium Cotton, Modern fit, Durable print, Soft and comfortable',
  'Ships within 2-3 business days. Free shipping on orders over $50.',
  125,
  true
),
(
  'STEAM Innovation Hoodie',
  'Premium hoodie for STEAM program participants and enthusiasts. Celebrate innovation, creativity, and the future of technology and science.',
  49.99,
  'steam',
  'hoodie',
  ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL'],
  '[
    {"name": "Black", "hex": "#000000"},
    {"name": "Grey", "hex": "#808080"},
    {"name": "Purple", "hex": "#800080"}
  ]'::jsonb,
  '{
    "front": "/src/assets/shop/black-hoodie.png",
    "back": "/src/assets/shop/black-hoodie.png",
    "side": "/src/assets/shop/black-hoodie.png",
    "detail": "/src/assets/shop/black-hoodie.png"
  }'::jsonb,
  '80% Cotton, 20% Polyester, Fleece interior, Tech-inspired graphics, Kangaroo pocket',
  'Ships within 3-5 business days. Free shipping on orders over $50.',
  80,
  true
);

-- Success message
SELECT 'Successfully seeded ' || COUNT(*) || ' products!' as message
FROM shop_items
WHERE category IN ('hbcu', 'ncrf', 'bce', 'latino', 'sap', 'steam');
