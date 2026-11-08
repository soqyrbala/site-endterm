
const destinations = [
  {
    id: "charyn-canyon",
    name: "Charyn Canyon",
    category: "Canyon",
    region: "Almaty Region",
    difficulty: "Easy",
    days: 2,
    price: 180,
    featured: true,
    image: "images/charyn-canyon.jpg",
    description: "Walk the Valley of Castles at golden hour.",
    highlights: ["Valley of Castles trail", "Picnic by the Charyn river", "Sunset viewpoint"]
  },
  {
    id: "kolsai-lakes",
    name: "Kolsai Lakes",
    category: "Lakes",
    region: "Almaty Region",
    difficulty: "Moderate",
    days: 3,
    price: 260,
    featured: true,
    image: "images/kolsai-lakes.jpg",
    description: "Three alpine lakes surrounded by spruce forest.",
    highlights: ["Hike to the second lake", "Homestay in Saty village", "Horse ride option"]
  },
  {
    id: "altai-mountains",
    name: "Altai Mountains",
    category: "Mountains",
    region: "East Kazakhstan",
    difficulty: "Hard",
    days: 6,
    price: 640,
    featured: true,
    image: "images/altai.jpg",
    description: "Glaciers, rivers and wild valleys on a 6-day route.",
    highlights: ["Belukha viewpoint", "Camping under the stars", "Local mountain guide"]
  },
  {
    id: "lake-kaindy",
    name: "Lake Kaindy",
    category: "Lakes",
    region: "Almaty Region",
    difficulty: "Moderate",
    days: 2,
    price: 210,
    featured: false,
    image: "images/kaindy.webp",
    description: "The sunken spruce forest in a turquoise lake.",
    highlights: ["Sunken forest photo stop", "Off-road drive", "Lakeside lunch"]
  },
  {
    id: "tien-shan-trek",
    name: "Tien Shan Trek",
    category: "Mountains",
    region: "Almaty Region",
    difficulty: "Hard",
    days: 4,
    price: 420,
    featured: false,
    image: "images/tien-shan-web.jpg",
    description: "A 4-day trek across high passes and meadows.",
    highlights: ["High mountain passes", "Tent camp", "Gear checklist included"]
  },
  {
    id: "steppe-stargazing",
    name: "Steppe Sunset & Stargazing",
    category: "Steppe",
    region: "Central Kazakhstan",
    difficulty: "Easy",
    days: 1,
    price: 95,
    featured: false,
    image: "images/steppe-sunset.jpg",
    description: "An evening in the open steppe, then a clear night sky.",
    highlights: ["Sunset picnic", "Telescope session", "Transfer from Astana"]
  }
];

const galleryItems = [
  { src: "images/kaindy.webp", alt: "Lake Kaindy", caption: "Lake Kaindy", category: "Lakes", wide: true },
  { src: "images/steppe-sunset.jpg", alt: "Steppe sunset", caption: "Steppe sunset", category: "Steppe", wide: false },
  { src: "images/tien-shan-web.jpg", alt: "Tien Shan mountains", caption: "Tien Shan", category: "Mountains", wide: false },
  { src: "images/altai.jpg", alt: "Altai mountains", caption: "Altai", category: "Mountains", wide: false },
  { src: "images/charyn-canyon.jpg", alt: "Charyn Canyon", caption: "Charyn Canyon", category: "Canyon", wide: true },
  { src: "images/night-sky.jpg", alt: "Night sky over the mountains", caption: "Night sky", category: "Steppe", wide: false }
];
