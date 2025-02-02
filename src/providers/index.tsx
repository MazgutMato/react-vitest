import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { PropsWithChildren } from "react";
import { CartProvider } from "./CartProvider";
import ReactQueryProvider from "./ReactQueryProvider";
import { LanguageProvider } from "./language/LanguageProvider";
import AuthProvider from "./AuthProvider";

const Providers = ({ children }: PropsWithChildren) => {
    return (
        <AuthProvider>
            <ReactQueryProvider>
                <CartProvider>
                    <LanguageProvider language="en">
                        <Theme>{children}</Theme>
                    </LanguageProvider>
                </CartProvider>
            </ReactQueryProvider>
        </AuthProvider>

    );
};

export default Providers;
