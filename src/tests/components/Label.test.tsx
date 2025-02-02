import { render, screen } from '@testing-library/react'
import { LanguageProvider } from '../../providers/language/LanguageProvider'
import Label from '../../components/Label'
import { Language } from '../../providers/language/type'

describe('Label Component', () => {
    function renderComponent(labelId: string, language: Language) {
        render(
            <LanguageProvider language={language}>
                <Label labelId={labelId} />
            </LanguageProvider>
        )
    }

    describe('Language English', () => {
        it.each([
            { labelId: "welcome", text: "Welcome" },
            { labelId: "new_product", text: "New Product" },
            { labelId: "edit_product", text: "Edit Product" },
        ])('should render $text for $labelId', ({ labelId, text }) => {
            renderComponent(labelId, "en")

            expect(screen.getByText(text)).toBeInTheDocument()
        })
    })

    describe('Language Spanish', () => {
        it.each([
            { labelId: "welcome", text: "Bienvenidos" },
            { labelId: "new_product", text: "Nuevo Producto" },
            { labelId: "edit_product", text: "Editar Producto" },
        ])('should render $text for $labelId', ({ labelId, text }) => {
            renderComponent(labelId, "es")

            expect(screen.getByText(text)).toBeInTheDocument()
        })
    })

    it('should throw error if paste not valiud labelId', () => {
        expect(() => { renderComponent("invalid_label", "en") }).toThrowError()
    })

})