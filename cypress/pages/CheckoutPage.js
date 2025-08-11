import CheckoutSelectors from '../selectors/CheckoutSelectors'

class CheckoutPage {
  goToCart() {
    cy.get(CheckoutSelectors.cartButton).click()
  }

  startCheckout() {
    cy.get(CheckoutSelectors.checkoutButton).click()
  }

  fillCheckoutForm(firstName, lastName, postalCode) {
    cy.get(CheckoutSelectors.firstNameInput).type(firstName)
    cy.get(CheckoutSelectors.lastNameInput).type(lastName)
    cy.get(CheckoutSelectors.postalCodeInput).type(postalCode)
    cy.get(CheckoutSelectors.continueButton).click()
  }

  finishOrder() {
    cy.get(CheckoutSelectors.finishButton).click()
  }

  verifyOrderSuccess() {
    cy.get(CheckoutSelectors.confirmationHeader)
      .should('contain.text', 'Thank you for your order')
  }
  
  getDisplayedItemTotal(callback) {
    cy.get(CheckoutSelectors.itemTotal)
      .invoke('text')
      .then((text) => {
        const total = parseFloat(text.replace('Item total: $', ''))
        callback(total)
      })
  }
}

export default new CheckoutPage()