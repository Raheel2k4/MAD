import { create } from 'zustand';

// --- 1. I'll EXPORT this interface so other files can use it ---
export interface MenuItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  image: string; 
  description: string; // <-- 2. Ensure description is here
}
// --------------------------

// This is the shape of an item *inside* our cart
export interface CartItem extends MenuItem {
  quantity: number;
}

// This is the shape of the "brain" itself
interface CartState {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

// This is where all the logic lives
export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  // --- No logic changes needed below ---
  
  addItem: (itemToAdd) => {
    const items = get().items;
    const existingItemIndex = items.findIndex(i => i._id === itemToAdd._id);

    if (existingItemIndex > -1) {
      const newItems = [...items];
      newItems[existingItemIndex].quantity += 1;
      set({ items: newItems });
    } else {
      set({ items: [...items, { ...itemToAdd, quantity: 1 }] });
    }
  },

  removeItem: (itemId) => {
    const items = get().items;
    const existingItem = items.find(i => i._id === itemId);

    if (existingItem && existingItem.quantity > 1) {
      const newItems = items.map(i => 
        i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      );
      set({ items: newItems });
    } else {
      const newItems = items.filter(i => i._id !== itemId);
      set({ items: newItems });
    }
  },

  clearCart: () => {
    set({ items: [] });
  },
}));