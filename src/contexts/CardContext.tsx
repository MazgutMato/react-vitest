import { createContext } from "react";
import { Product } from "../entities";
import { CartItem } from "../providers/CartProvider";

type CartContextType = {
    getItem: (product: Product) => CartItem | null;
    addToCart: (product: Product) => void;
    removeFromCart: (product: Product) => void;
    getItemCount: () => number;
};

export const CartContext = createContext<CartContextType>(
    {} as CartContextType
);