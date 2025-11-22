-- Seed data for all user stories

-- Insert care articles (User Story 9 & 14)
INSERT INTO public.care_articles (title, slug, category, excerpt, content, image_url, author_name, read_time) VALUES
('Complete Guide to Puppy Training', 'complete-guide-puppy-training', 'Training', 
 'Learn essential training techniques for your new puppy, from basic commands to house training.',
 'Training a puppy requires patience, consistency, and positive reinforcement. Start with basic commands like sit, stay, and come. Use treats and praise to reward good behavior. House training should begin immediately - take your puppy outside frequently, especially after meals and naps. Crate training can be very effective. Socialize your puppy early by exposing them to different people, animals, and environments. Remember, puppies have short attention spans, so keep training sessions brief (5-10 minutes) and fun. Consistency is key - all family members should use the same commands and rules.',
 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop',
 'Dr. Emily Parker', '8 min read'),

('Nutrition Basics for Cats', 'nutrition-basics-cats', 'Nutrition',
 'Understand what your cat needs nutritionally at different life stages for optimal health.',
 'Cats are obligate carnivores, meaning they require animal protein to thrive. Feed high-quality cat food appropriate for your cat''s life stage (kitten, adult, senior). Kittens need more calories and protein for growth. Adult cats benefit from portion control to prevent obesity. Senior cats may need specialized diets for kidney or joint health. Always provide fresh water. Avoid feeding cats dog food, as it lacks essential nutrients like taurine. Treats should make up no more than 10% of daily calories. Some human foods are toxic to cats, including onions, garlic, chocolate, grapes, and raisins.',
 'https://images.unsplash.com/photo-1529257414772-1960b7bea4eb?w=600&h=400&fit=crop',
 'Dr. Sarah Johnson', '6 min read'),

('Grooming Your Dog at Home', 'grooming-dog-home', 'Grooming',
 'Step-by-step guide to grooming your dog, including bathing, brushing, and nail trimming.',
 'Regular grooming keeps your dog healthy and comfortable. Brush your dog''s coat at least weekly - daily for long-haired breeds. This removes loose fur, prevents matting, and distributes natural oils. Bathe your dog monthly or as needed using dog-specific shampoo. Check and clean ears weekly to prevent infections. Trim nails every 2-4 weeks - overgrown nails can cause pain and posture problems. Brush teeth several times a week with dog toothpaste. Check for fleas, ticks, and skin issues during grooming. Make grooming a positive experience with treats and praise.',
 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&h=400&fit=crop',
 'Lisa Chen', '10 min read'),

('Understanding Pet Vaccination Schedules', 'pet-vaccination-schedules', 'Health',
 'A comprehensive overview of essential vaccinations and when your pet should receive them.',
 'Vaccinations protect pets from serious diseases. Puppies need a series of shots starting at 6-8 weeks: distemper, parvovirus, and hepatitis (often combined as DHPP). Rabies vaccine is given at 12-16 weeks and is legally required. Kittens receive FVRCP vaccine (feline viral rhinotracheitis, calicivirus, panleukopenia) starting at 6-8 weeks. Adult pets need booster shots - some annually, others every 3 years. Your vet will create a schedule based on your pet''s age, health, and lifestyle. Keep vaccination records updated. Some vaccines are optional based on risk factors.',
 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=600&h=400&fit=crop',
 'Dr. Michael Roberts', '7 min read'),

('First-Time Pet Owner Checklist', 'first-time-pet-owner-checklist', 'General',
 'Everything you need to prepare your home for a new pet, from supplies to safety tips.',
 'Before bringing your pet home, prepare these essentials: food and water bowls, appropriate food, collar and leash/harness, ID tag, bed or crate, toys, grooming supplies, and litter box for cats. Pet-proof your home by securing toxic substances, electrical cords, and small objects. Choose a veterinarian and schedule a checkup within the first week. Set up a quiet space where your pet can adjust. Learn about your pet''s specific needs regarding exercise, socialization, and training. Budget for ongoing costs: food, vet care, grooming, and unexpected emergencies. Consider pet insurance.',
 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=400&fit=crop',
 'Amanda Wilson', '5 min read'),

('Creating a Pet-Friendly Exercise Routine', 'pet-exercise-routine', 'Exercise',
 'Tips for keeping your pet active and healthy with age-appropriate exercise routines.',
 'Regular exercise is crucial for your pet''s physical and mental health. Dogs need daily walks - at least 30 minutes for small breeds, 60+ minutes for large/active breeds. Vary routes to provide mental stimulation. Play fetch, frisbee, or tug-of-war. Swimming is excellent low-impact exercise. Cats benefit from interactive play sessions 2-3 times daily using toys that mimic prey. Provide climbing structures and scratching posts. Adjust exercise based on age - puppies and kittens have lots of energy but tire quickly; seniors need gentler, shorter sessions. Watch for signs of overexertion: excessive panting, limping, or reluctance to continue.',
 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop',
 'James Miller', '9 min read');

-- Insert store products (User Story 13)
INSERT INTO public.store_products (name, category, description, price, image_url, stock_quantity, rating) VALUES
('Premium Dog Food - 25lb', 'Food', 'High-quality nutrition for adult dogs with real chicken, brown rice, and vegetables. No artificial flavors or preservatives.', 49.99, 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop', 50, 4.8),
('Cat Litter Box Set', 'Supplies', 'Complete litter box with hood, scoop, and liner. Large size with odor control filter. Easy to clean.', 34.99, 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&h=400&fit=crop', 30, 4.6),
('Interactive Dog Toy Bundle', 'Toys', '3-piece set of durable chew toys including rope, ball, and puzzle feeder. Perfect for medium to large dogs.', 24.99, 'https://images.unsplash.com/photo-1535324492437-cdd3a2b1cd3b?w=400&h=400&fit=crop', 75, 4.9),
('Cat Grooming Kit', 'Grooming', 'Complete grooming tools including slicker brush, nail clippers, comb, and deshedding tool. Professional quality.', 29.99, 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400&h=400&fit=crop', 40, 4.7),
('Orthopedic Dog Bed - Large', 'Accessories', 'Memory foam bed perfect for senior dogs and large breeds. Removable, washable cover. Supports joints and muscles.', 79.99, 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop', 25, 4.9),
('Automatic Pet Feeder', 'Supplies', 'Programmable feeder with timer and portion control. Holds up to 6L of dry food. Battery backup included.', 59.99, 'https://images.unsplash.com/photo-1625316708582-7c38734be31d?w=400&h=400&fit=crop', 20, 4.5),
('Cat Tree Tower', 'Accessories', 'Multi-level climbing tree with scratching posts, perches, and hideaway. Sturdy construction for multiple cats.', 89.99, 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&h=400&fit=crop', 15, 4.8),
('Dog Training Treats', 'Food', 'Healthy, low-calorie training rewards made with real chicken. Grain-free and perfect for sensitive stomachs.', 14.99, 'https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=400&h=400&fit=crop', 100, 4.7),
('Pet Carrier Backpack', 'Accessories', 'Comfortable carrier for small pets up to 15lbs. Breathable mesh, padded straps, and safety tether included.', 44.99, 'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=400&h=400&fit=crop', 35, 4.6),
('Premium Cat Food - Variety Pack', 'Food', 'Wet cat food variety pack with chicken, turkey, and salmon. Grain-free, high-protein formula. 24 cans.', 34.99, 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop', 60, 4.8),
('Dog Collar and Leash Set', 'Accessories', 'Durable nylon collar and matching 6ft leash. Reflective stitching for night walks. Available in multiple colors.', 19.99, 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop', 80, 4.5),
('Cat Scratching Post', 'Toys', 'Tall sisal scratching post with carpet base. Helps prevent furniture damage. Includes dangling toy.', 27.99, 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&h=400&fit=crop', 45, 4.6),
('Dog Dental Chews - 30 Pack', 'Food', 'Dental health treats that reduce plaque and tartar. Vet recommended. Fresh breath formula.', 22.99, 'https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=400&h=400&fit=crop', 70, 4.7),
('Pet Water Fountain', 'Supplies', 'Automatic water fountain with 3-stage filtration. Encourages drinking with flowing water. 2L capacity.', 39.99, 'https://images.unsplash.com/photo-1625316708582-7c38734be31d?w=400&h=400&fit=crop', 28, 4.8),
('Cat Toy Variety Pack', 'Toys', '15-piece toy set including mice, balls, feathers, and catnip toys. Hours of entertainment.', 18.99, 'https://images.unsplash.com/photo-1535324492437-cdd3a2b1cd3b?w=400&h=400&fit=crop', 55, 4.6);

-- Note: Sample pets will be added by admins through the UI
-- Sample vaccination reminders, prescriptions, etc. will be created through app usage
