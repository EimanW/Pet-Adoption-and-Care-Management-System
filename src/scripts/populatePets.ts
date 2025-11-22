import { supabase } from "../integrations/supabase/client";

export const samplePets = [
  {
    id: 'e4f7c8a1-2b3d-4e5f-9a6b-1c2d3e4f5a6b',
    name: 'Max',
    species: 'dog',
    breed: 'Golden Retriever',
    age: 3,
    gender: 'male',
    size: 'large',
    color: 'golden',
    description: 'Max is a friendly and energetic Golden Retriever who loves to play fetch and go for long walks. He\'s great with children and other dogs. Max is fully trained and knows basic commands. He would be perfect for an active family with a yard.',
    personality: ['friendly', 'energetic', 'playful', 'obedient'],
    health_status: 'excellent',
    vaccination_status: 'up-to-date',
    spayed_neutered: true,
    good_with_kids: true,
    good_with_pets: true,
    energy_level: 'high',
    image_url: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&h=600&fit=crop',
    status: 'available',
    arrival_date: '2024-11-01'
  },
  {
    id: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    name: 'Luna',
    species: 'cat',
    breed: 'Siamese',
    age: 2,
    gender: 'female',
    size: 'small',
    color: 'cream and brown',
    description: 'Luna is a beautiful Siamese cat with striking blue eyes. She\'s playful, curious, and loves attention. Luna enjoys interactive toys and sunny windowsills. She would do well in a quiet home as the only pet.',
    personality: ['playful', 'curious', 'affectionate', 'intelligent'],
    health_status: 'excellent',
    vaccination_status: 'up-to-date',
    spayed_neutered: true,
    good_with_kids: false,
    good_with_pets: false,
    energy_level: 'medium',
    image_url: 'https://images.unsplash.com/photo-1573865526739-10c1deaeac5e?w=800&h=600&fit=crop',
    status: 'available',
    arrival_date: '2024-10-15'
  },
  {
    id: 'b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    name: 'Charlie',
    species: 'dog',
    breed: 'Labrador Mix',
    age: 1,
    gender: 'male',
    size: 'medium',
    color: 'black',
    description: 'Charlie is a young, energetic pup full of life! He\'s still learning but is very food-motivated and eager to please. Perfect for someone who wants to train a puppy. Great with kids and very social.',
    personality: ['energetic', 'playful', 'social', 'eager to please'],
    health_status: 'excellent',
    vaccination_status: 'up-to-date',
    spayed_neutered: false,
    good_with_kids: true,
    good_with_pets: true,
    energy_level: 'very high',
    image_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&h=600&fit=crop',
    status: 'available',
    arrival_date: '2024-11-10'
  },
  {
    id: 'c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
    name: 'Bella',
    species: 'cat',
    breed: 'Persian',
    age: 4,
    gender: 'female',
    size: 'medium',
    color: 'white',
    description: 'Bella is a gentle and calm Persian cat who loves to cuddle. She has a luxurious coat that requires regular grooming. Bella prefers a peaceful environment and would be ideal for seniors or quiet households.',
    personality: ['gentle', 'calm', 'affectionate', 'quiet'],
    health_status: 'excellent',
    vaccination_status: 'up-to-date',
    spayed_neutered: true,
    good_with_kids: true,
    good_with_pets: false,
    energy_level: 'low',
    image_url: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800&h=600&fit=crop',
    status: 'available',
    arrival_date: '2024-09-20'
  },
  {
    id: 'd4e5f6a7-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
    name: 'Rocky',
    species: 'dog',
    breed: 'German Shepherd',
    age: 5,
    gender: 'male',
    size: 'large',
    color: 'black and tan',
    description: 'Rocky is a loyal and protective German Shepherd. He\'s well-trained and obedient, making him an excellent companion for an experienced dog owner. Rocky needs regular exercise and mental stimulation.',
    personality: ['loyal', 'protective', 'intelligent', 'obedient'],
    health_status: 'excellent',
    vaccination_status: 'up-to-date',
    spayed_neutered: true,
    good_with_kids: false,
    good_with_pets: true,
    energy_level: 'high',
    image_url: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&h=600&fit=crop',
    status: 'available',
    arrival_date: '2024-08-05'
  },
  {
    id: 'e5f6a7b8-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
    name: 'Milo',
    species: 'cat',
    breed: 'Maine Coon',
    age: 3,
    gender: 'male',
    size: 'large',
    color: 'tabby',
    description: 'Milo is a majestic Maine Coon with a gentle giant personality. Despite his size, he\'s incredibly gentle and affectionate. Milo gets along well with other pets and children. He loves to play and explore.',
    personality: ['gentle', 'affectionate', 'playful', 'social'],
    health_status: 'excellent',
    vaccination_status: 'up-to-date',
    spayed_neutered: true,
    good_with_kids: true,
    good_with_pets: true,
    energy_level: 'medium',
    image_url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=600&fit=crop',
    status: 'available',
    arrival_date: '2024-10-01'
  },
  {
    id: 'f6a7b8c9-0d1e-2f3a-4b5c-6d7e8f9a0b1c',
    name: 'Daisy',
    species: 'rabbit',
    breed: 'Holland Lop',
    age: 1,
    gender: 'female',
    size: 'small',
    color: 'brown and white',
    description: 'Daisy is an adorable Holland Lop rabbit with floppy ears and a sweet temperament. She\'s litter-trained and loves fresh vegetables. Daisy enjoys gentle handling and would be perfect for a family with older children.',
    personality: ['sweet', 'gentle', 'quiet', 'friendly'],
    health_status: 'excellent',
    vaccination_status: 'up-to-date',
    spayed_neutered: true,
    good_with_kids: true,
    good_with_pets: true,
    energy_level: 'low',
    image_url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&h=600&fit=crop',
    status: 'available',
    arrival_date: '2024-11-05'
  },
  {
    id: 'a7b8c9d0-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
    name: 'Cooper',
    species: 'dog',
    breed: 'Beagle',
    age: 2,
    gender: 'male',
    size: 'medium',
    color: 'tricolor',
    description: 'Cooper is a friendly Beagle with a great nose for adventure! He\'s curious and loves to explore. Cooper is good with other dogs and children. He would thrive in a home with a secure backyard.',
    personality: ['friendly', 'curious', 'playful', 'adventurous'],
    health_status: 'excellent',
    vaccination_status: 'up-to-date',
    spayed_neutered: true,
    good_with_kids: true,
    good_with_pets: true,
    energy_level: 'medium',
    image_url: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800&h=600&fit=crop',
    status: 'available',
    arrival_date: '2024-10-20'
  }
];

export async function populateSamplePets() {
  console.log('Starting to populate sample pets...');
  
  try {
    // Check if pets already exist
    const { data: existingPets, error: checkError } = await supabase
      .from('pets')
      .select('id')
      .in('id', samplePets.map(p => p.id));
    
    if (checkError) throw checkError;
    
    if (existingPets && existingPets.length > 0) {
      console.log('Sample pets already exist in database');
      return { success: true, message: 'Pets already exist' };
    }
    
    // Insert sample pets
    const { data, error } = await supabase
      .from('pets')
      .insert(samplePets);
    
    if (error) throw error;
    
    console.log('Successfully populated sample pets!');
    return { success: true, message: 'Successfully added sample pets' };
  } catch (error: any) {
    console.error('Error populating pets:', error);
    return { success: false, message: error.message };
  }
}
