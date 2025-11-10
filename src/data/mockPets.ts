import { Pet } from "@/types/pet";

export const mockPets: Pet[] = [
  {
    id: "1",
    name: "Max",
    type: "dog",
    breed: "Golden Retriever",
    age: 3,
    size: "large",
    gender: "male",
    description: "Max is a friendly and energetic Golden Retriever who loves to play fetch and go for long walks. He's great with children and other dogs. Max is fully trained and knows basic commands. He would be perfect for an active family with a yard.",
    image: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&h=600&fit=crop",
    status: "available",
    vaccinated: true,
    neutered: true,
    medicalHistory: [
      {
        id: "m1",
        date: "2024-01-15",
        type: "vaccination",
        description: "Annual vaccinations including rabies and DHPP",
        vet: "Dr. Sarah Johnson",
        nextDue: "2025-01-15"
      }
    ],
    adoptionFee: 250,
    location: "San Francisco, CA"
  },
  {
    id: "2",
    name: "Luna",
    type: "cat",
    breed: "Siamese",
    age: 2,
    size: "small",
    gender: "female",
    description: "Luna is a beautiful Siamese cat with striking blue eyes. She's playful, curious, and loves attention. Luna enjoys interactive toys and sunny windowsills. She would do well in a quiet home as the only pet.",
    image: "https://images.unsplash.com/photo-1573865526739-10c1deaeac5e?w=800&h=600&fit=crop",
    status: "available",
    vaccinated: true,
    neutered: true,
    medicalHistory: [
      {
        id: "m2",
        date: "2024-02-20",
        type: "checkup",
        description: "Regular health checkup - all clear",
        vet: "Dr. Michael Chen"
      }
    ],
    adoptionFee: 150,
    location: "Los Angeles, CA"
  },
  {
    id: "3",
    name: "Charlie",
    type: "dog",
    breed: "Labrador Mix",
    age: 1,
    size: "medium",
    gender: "male",
    description: "Charlie is a young, energetic pup full of life! He's still learning but is very food-motivated and eager to please. Perfect for someone who wants to train a puppy. Great with kids and very social.",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&h=600&fit=crop",
    status: "available",
    vaccinated: true,
    neutered: false,
    specialNeeds: "Needs basic training",
    medicalHistory: [],
    adoptionFee: 200,
    location: "Seattle, WA"
  },
  {
    id: "4",
    name: "Bella",
    type: "cat",
    breed: "Persian",
    age: 4,
    size: "medium",
    gender: "female",
    description: "Bella is a gentle and calm Persian cat who loves to cuddle. She has a luxurious coat that requires regular grooming. Bella prefers a peaceful environment and would be ideal for seniors or quiet households.",
    image: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800&h=600&fit=crop",
    status: "available",
    vaccinated: true,
    neutered: true,
    medicalHistory: [
      {
        id: "m3",
        date: "2024-01-10",
        type: "vaccination",
        description: "FVRCP vaccine",
        vet: "Dr. Emily Rodriguez",
        nextDue: "2025-01-10"
      }
    ],
    adoptionFee: 175,
    location: "Portland, OR"
  },
  {
    id: "5",
    name: "Rocky",
    type: "dog",
    breed: "German Shepherd",
    age: 5,
    size: "large",
    gender: "male",
    description: "Rocky is a loyal and protective German Shepherd. He's well-trained and obedient, making him an excellent companion for an experienced dog owner. Rocky needs regular exercise and mental stimulation.",
    image: "https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&h=600&fit=crop",
    status: "available",
    vaccinated: true,
    neutered: true,
    medicalHistory: [
      {
        id: "m4",
        date: "2023-11-15",
        type: "checkup",
        description: "Hip examination - good condition",
        vet: "Dr. James Wilson"
      }
    ],
    adoptionFee: 300,
    location: "Denver, CO"
  },
  {
    id: "6",
    name: "Milo",
    type: "cat",
    breed: "Maine Coon",
    age: 3,
    size: "large",
    gender: "male",
    description: "Milo is a majestic Maine Coon with a gentle giant personality. Despite his size, he's incredibly gentle and affectionate. Milo gets along well with other pets and children. He loves to play and explore.",
    image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=600&fit=crop",
    status: "pending",
    vaccinated: true,
    neutered: true,
    medicalHistory: [],
    adoptionFee: 200,
    location: "Austin, TX"
  },
  {
    id: "7",
    name: "Daisy",
    type: "rabbit",
    breed: "Holland Lop",
    age: 1,
    size: "small",
    gender: "female",
    description: "Daisy is an adorable Holland Lop rabbit with floppy ears and a sweet temperament. She's litter-trained and loves fresh vegetables. Daisy enjoys gentle handling and would be perfect for a family with older children.",
    image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&h=600&fit=crop",
    status: "available",
    vaccinated: true,
    neutered: true,
    medicalHistory: [],
    adoptionFee: 75,
    location: "Phoenix, AZ"
  },
  {
    id: "8",
    name: "Cooper",
    type: "dog",
    breed: "Beagle",
    age: 2,
    size: "medium",
    gender: "male",
    description: "Cooper is a friendly Beagle with a great nose for adventure! He's curious and loves to explore. Cooper is good with other dogs and children. He would thrive in a home with a secure backyard.",
    image: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800&h=600&fit=crop",
    status: "available",
    vaccinated: true,
    neutered: true,
    medicalHistory: [],
    adoptionFee: 225,
    location: "Boston, MA"
  }
];
