
import { MenuItem } from './types';

export const INITIAL_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Truffle Benedict',
    description: 'Poached eggs, black truffle hollandaise, toasted sourdough.',
    price: 24.50,
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1600335895229-6e75511892c8?auto=format&fit=crop&q=80&w=600&h=400',
    isAvailable: true
  },
  {
    id: '2',
    name: 'Wagyu Beef Burger',
    description: 'Caramelized onions, aged cheddar, brioche bun, truffle fries.',
    price: 32.00,
    category: 'Lunch',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600&h=400',
    isAvailable: true
  },
  {
    id: '3',
    name: 'Grilled Sea Bass',
    description: 'Mediterranean herbs, lemon butter sauce, asparagus.',
    price: 45.00,
    category: 'Dinner',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=600&h=400',
    isAvailable: true
  },
  {
    id: '4',
    name: 'Aged Old Fashioned',
    description: 'Bourbon, bitters, orange zest, maple syrup.',
    price: 18.00,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=600&h=400',
    isAvailable: true
  },
  {
    id: '5',
    name: 'Molten Chocolate Lava',
    description: 'Valrhona chocolate, vanilla bean gelato.',
    price: 14.00,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=600&h=400',
    isAvailable: true
  }
];

export const HOTEL_INFO = {
  name: "LuxeStay Grand Hotel",
  address: "123 Elegance Blvd, Metropolitan City",
  phone: "+1 (555) 123-4567",
  email: "concierge@luxestay.com",
  about: "LuxeStay Grand Hotel represents the pinnacle of luxury and comfort. Established in 1924, we have hosted royalty, world leaders, and discerning travelers for a century, providing unparalleled service and exquisite culinary experiences."
};
