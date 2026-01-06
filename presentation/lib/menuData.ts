import { MenuItem } from './types';

export const menuData: Record<string, MenuItem[]> = {
  'mexican-food': [
    {
      name: 'Chicken Burrito',
      description: 'Tortilla filled with seasoned chicken and salsa.',
      allergens: 'Contains wheat and dairy',
      price: '$5.00',
      image: 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/chicken-burrito.jpg',
    },
    {
      name: 'Beef Quesadilla',
      description: 'Grilled tortilla with cheese and beef.',
      allergens: 'Contains dairy',
      price: '$5.50',
      image: 'https://np-snatch-v.s3.us-east-1.amazonaws.com/bef-quesadilla.jpg',
    },
  ],

  'chicken-rice': [
    {
      name: 'Hainanese Chicken Rice',
      description: 'Steamed chicken with fragrant rice and chili sauce.',
      allergens: 'Contains soy',
      price: '$3.50',
      image: 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/hainanese-chicken-rice.jpg',
    },
    {
      name: 'Roasted Chicken Rice',
      description: 'Roasted chicken with garlic rice and soup.',
      allergens: 'Contains soy',
      price: '$3.80',
      image: 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/chicken-rice.jpg',
    },
  ],

  'drinks-stall': [
    {
      name: 'Green Tea',
      allergens: 'NIL',
      description: 'Tea which green.',
      price: '$1.50',
      image: 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/green-tea.jpg',
    },
    {
      name: 'Red Tea',
      allergens: 'NIL',
      description: 'Tea which red.',
      price: '$1.80',
      image: 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/red-tea.jpg',
    },
  ],

  'indonesian-food': [
    {
      name: 'Ayam Penyet',
      description: 'Fried smashed chicken served with sambal chili, and steamed rice.',
      allergens: 'Contains soy and chili',
      price: '$4.80',
      image: 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/ayam-penyet.jpg',
    },
    {
      name: 'Beef Rendang',
      description: 'Slow-cooked beef in a rich coconut and spice curry, served with rice.',
      allergens: 'Contains coconut and spices',
      price: '$5.20',
      image: 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/beef-rendang.jpg',
    },
  ],

  'prataboy-pratas': [
    {
      name: 'Cheese Prata',
      description: 'A crispy, golden-brown flatbread filled with gooey melted cheese, grilled to perfection.',
      allergens: 'Contains dairy and gluten',
      price: '$2.80',
      image: 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/cheese-prata.jpg',
    },
    {
      name: 'Egg Prata with Curry',
      description: 'Fluffy prata filled with seasoned egg, served with a side of spicy fish curry.',
      allergens: 'Contains eggs, gluten, and spices',
      price: '$3.00',
      image: 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/egg-prata-with-curry.jpg',
    },
  ],

  'koi-drink-stall': [
    {
      name: 'Green Tea Macchiato',
      description: 'Freshly brewed premium green tea topped with a rich, creamy milk foam.',
      allergens: 'Contains dairy',
      price: '$3.50',
      image: 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/green-tea-macchiato.jpg',
    },
    {
      name: 'Brown Tea',
      description: 'Classic milk tea with chewy brown sugar pearls and a smooth caramel-like sweetness.',
      allergens: 'Contains dairy',
      price: '$4.20',
      image: 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/brown-sugar-pearl-milk-tea.jpg',
    },
  ],

  'korean-food': [
    {
      name: 'Bibimbap',
      description: 'A mixed rice dish with sautéed vegetables, egg, and spicy gochujang sauce.',
      allergens: 'Contains egg and sesame',
      price: '$5.80',
      image: 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/bibimbap.jpg',
    },
    {
      name: 'Kimchi Jjigae',
      description: 'A hearty kimchi stew with tofu, pork, and scallions served with rice.',
      allergens: 'Contains soy and pork',
      price: '$6.20',
      image: 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/kimchi-jjigae.jpg',
    },
  ],
};
