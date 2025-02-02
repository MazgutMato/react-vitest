import { render, screen } from '@testing-library/react';
import { Product } from '../../entities';
import { CartProvider } from '../../providers/CartProvider';
import QuantitySelector from '../../components/QuantitySelector';
import userEvent from '@testing-library/user-event';

describe('QuantitySelector', () => {

    function renderComponent() {
        const product: Product = {
            id: 1,
            name: "Milk",
            price: 1.99,
            categoryId: 1,
        }

        render(
            <CartProvider>
                <QuantitySelector product={product} />
            </CartProvider >
        )

        const addToCartButton = screen.getByRole('button', { name: /add to cart/i })

        function getAddToCartButton() {
            return screen.getByRole('button', { name: /add to cart/i })
        }

        function getQuantityControls() {
            return (
                {
                    quantity: screen.queryByRole('status'),
                    incrementButton: screen.queryByRole('button', { name: '+' }),
                    decrementButton: screen.queryByRole('button', { name: '-' }),
                }
            )
        }

        const user = userEvent.setup()

        async function addToCart() {
            const button = getAddToCartButton()
            await user.click(button!)
        }

        async function incrementQuanity() {
            const { incrementButton } = getQuantityControls()
            await user.click(incrementButton!)
        }

        async function decrementQuanity() {
            const { decrementButton } = getQuantityControls()
            await user.click(decrementButton!)
        }

        return {
            addToCartButton,
            getAddToCartButton,
            getQuantityControls,
            user,
            addToCart,
            incrementQuanity,
            decrementQuanity,
        }
    }

    it('should render the Add to Cart button', () => {
        const { addToCartButton } = renderComponent();

        expect(addToCartButton).toBeInTheDocument();
    })

    it('should add the product to the card', async () => {
        const { addToCartButton, getQuantityControls, addToCart } = renderComponent();

        await addToCart()

        const { decrementButton, incrementButton, quantity } = getQuantityControls()
        expect(quantity).toHaveTextContent('1');
        expect(incrementButton).toBeInTheDocument()
        expect(decrementButton).toBeInTheDocument()
        expect(addToCartButton).not.toBeInTheDocument()
    })

    it('should increment the quantity', async () => {
        const { getQuantityControls, addToCart, incrementQuanity } = renderComponent();
        await addToCart()

        await incrementQuanity()

        const { quantity } = getQuantityControls()
        expect(quantity).toHaveTextContent("2")
    })

    it('should decrement the quantity', async () => {
        const { addToCart, incrementQuanity, decrementQuanity, getQuantityControls } = renderComponent();

        await addToCart()
        await incrementQuanity()
        await decrementQuanity()

        const { quantity } = getQuantityControls()
        expect(quantity).toHaveTextContent("1")
    })

    it('should remove roduct from cart', async () => {
        const { getAddToCartButton, getQuantityControls, addToCart, decrementQuanity } = renderComponent();

        await addToCart()
        await decrementQuanity()

        const { incrementButton, decrementButton, quantity } = getQuantityControls()
        expect(quantity).not.toBeInTheDocument()
        expect(decrementButton).not.toBeInTheDocument()
        expect(incrementButton).not.toBeInTheDocument()
        expect(getAddToCartButton()).toBeInTheDocument()
    })
})