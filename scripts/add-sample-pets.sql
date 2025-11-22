-- Sample pets to populate the database
-- Run this in Supabase SQL Editor or via migration

INSERT INTO public.pets (name, species, breed, age, gender, size, color, description, health_status, vaccination_status, spayed_neutered, good_with_kids, good_with_pets, energy_level, image_url, status) VALUES
('Max', 'dog', 'Golden Retriever', 3, 'male', 'large', 'golden', 'Max is a friendly and energetic Golden Retriever who loves playing fetch and swimming. He''s great with children and other dogs. Max has completed basic obedience training and walks well on a leash. He would thrive in an active family with a yard.', 'healthy', 'up_to_date', true, true, true, 'high', 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600&h=600&fit=crop', 'available'),

('Luna', 'cat', 'Siamese', 2, 'female', 'medium', 'seal point', 'Luna is an elegant Siamese cat with striking blue eyes. She''s affectionate and vocal, enjoying conversation with her humans. Luna loves sunbathing by the window and playing with feather toys. She would do best as the only pet in a quiet home.', 'healthy', 'up_to_date', true, true, false, 'medium', 'https://images.unsplash.com/photo-1573865526739-10c1deaeac5e?w=600&h=600&fit=crop', 'available'),

('Bella', 'dog', 'Labrador Retriever', 5, 'female', 'large', 'chocolate', 'Bella is a sweet and gentle Labrador who adores everyone she meets. She''s perfectly house-trained and knows many commands. Bella enjoys leisurely walks and belly rubs. She''s great with kids and would be perfect for a family looking for a calm companion.', 'healthy', 'up_to_date', true, true, true, 'medium', 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=600&h=600&fit=crop', 'available'),

('Charlie', 'cat', 'Tabby', 1, 'male', 'medium', 'orange', 'Charlie is a playful young tabby with lots of energy and curiosity. He loves climbing cat trees and chasing toy mice. Charlie is very social and enjoys being around people. He would do well with another playful cat or in a home with older children.', 'healthy', 'up_to_date', true, true, true, 'high', 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop', 'available'),

('Buddy', 'dog', 'Beagle', 4, 'male', 'medium', 'tri-color', 'Buddy is an adorable Beagle with a nose for adventure. He loves going on walks and exploring new scents. Buddy is friendly, loyal, and great with children. He would thrive in an active home where he can get plenty of exercise and mental stimulation.', 'healthy', 'up_to_date', true, true, true, 'high', 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=600&h=600&fit=crop', 'available'),

('Daisy', 'dog', 'Poodle Mix', 2, 'female', 'small', 'white', 'Daisy is a charming poodle mix with a hypoallergenic coat. She''s intelligent, easy to train, and loves learning new tricks. Daisy is perfect for apartment living and enjoys both playtime and cuddles. She gets along well with other dogs and cats.', 'healthy', 'up_to_date', true, true, true, 'medium', 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=600&h=600&fit=crop', 'available'),

('Whiskers', 'cat', 'Persian', 3, 'male', 'large', 'white', 'Whiskers is a regal Persian cat with luxurious long fur. He''s calm, affectionate, and enjoys a peaceful environment. Whiskers loves being brushed and will happily sit on your lap for hours. He requires regular grooming and would be perfect for someone who enjoys a quiet, devoted companion.', 'healthy', 'up_to_date', true, false, false, 'low', 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=600&h=600&fit=crop', 'available'),

('Rocky', 'dog', 'German Shepherd', 6, 'male', 'large', 'black and tan', 'Rocky is a loyal and protective German Shepherd who has received professional training. He''s incredibly smart and eager to please. Rocky would make an excellent companion for an experienced dog owner. He enjoys long walks, training sessions, and having a job to do.', 'healthy', 'up_to_date', true, true, false, 'high', 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=600&h=600&fit=crop', 'available'),

('Mittens', 'cat', 'Domestic Shorthair', 4, 'female', 'medium', 'gray and white', 'Mittens is a sweet and easygoing cat who loves attention. She has adorable white paws that look like mittens. She''s perfectly content lounging around the house but also enjoys interactive play. Mittens would be a great companion for anyone looking for a low-maintenance, affectionate cat.', 'healthy', 'up_to_date', true, true, true, 'low', 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600&h=600&fit=crop', 'available'),

('Cooper', 'dog', 'Border Collie', 2, 'male', 'medium', 'black and white', 'Cooper is an energetic and intelligent Border Collie who excels at agility and loves learning. He needs an active owner who can provide plenty of mental and physical stimulation. Cooper is great with kids and would love a home with a yard where he can run and play.', 'healthy', 'up_to_date', true, true, true, 'very_high', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop', 'available'),

('Shadow', 'cat', 'Black Cat', 5, 'male', 'medium', 'black', 'Shadow is a sleek black cat with golden eyes and a mysterious charm. Despite superstitions, he''s incredibly loving and brings nothing but good luck. Shadow enjoys quiet evenings and gentle pets. He''s independent but affectionate and would be perfect for a calm household.', 'healthy', 'up_to_date', true, true, false, 'low', 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=600&h=600&fit=crop', 'available'),

('Rosie', 'dog', 'Cocker Spaniel', 3, 'female', 'medium', 'golden', 'Rosie is a beautiful Cocker Spaniel with a gentle and loving personality. She has gorgeous flowing ears and a wagging tail that never stops. Rosie loves everyone she meets and is especially good with children. She enjoys moderate exercise and plenty of cuddle time.', 'healthy', 'up_to_date', true, true, true, 'medium', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=600&fit=crop', 'available');

-- Add some medical records for these pets
INSERT INTO public.medical_records (pet_id, record_type, description, date, veterinarian, notes) 
SELECT 
  id,
  'vaccination',
  'Annual vaccination including Rabies, Distemper, and Parvovirus',
  CURRENT_DATE - INTERVAL '2 months',
  'Dr. Sarah Johnson',
  'Pet is healthy and up to date on all vaccinations. Next due in 10 months.'
FROM public.pets
WHERE name IN ('Max', 'Bella', 'Buddy', 'Rocky')
LIMIT 4;

INSERT INTO public.medical_records (pet_id, record_type, description, date, veterinarian, notes) 
SELECT 
  id,
  'vaccination',
  'FVRCP vaccination (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)',
  CURRENT_DATE - INTERVAL '1 month',
  'Dr. Michael Roberts',
  'Cat is in excellent health. Continue annual vaccinations.'
FROM public.pets
WHERE species = 'cat'
LIMIT 3;

INSERT INTO public.medical_records (pet_id, record_type, description, date, veterinarian, notes) 
SELECT 
  id,
  'checkup',
  'Annual wellness examination',
  CURRENT_DATE - INTERVAL '3 weeks',
  'Dr. Emily Parker',
  'Overall health is excellent. Weight is ideal. Recommend dental cleaning in 6 months.'
FROM public.pets
WHERE name IN ('Luna', 'Charlie', 'Daisy')
LIMIT 3;
