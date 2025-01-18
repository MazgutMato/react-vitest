import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { PropsWithChildren } from "react";
import { CartProvider } from "./CartProvider";
import ReactQueryProvider from "./ReactQueryProvider";

const Providers = ({ children }: PropsWithChildren) => {
    return (
        <ReactQueryProvider>

            <CartProvider>

                <Theme>{children}</Theme>

            </CartProvider>

        </ReactQueryProvider>

    );
};

export default Providers;
