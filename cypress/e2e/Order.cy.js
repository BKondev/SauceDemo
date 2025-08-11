import LoginPage from '../pages/LoginPage'
import InventoryPage from '../pages/InventoryPage'
import CheckoutPage from '../pages/CheckoutPage'

describe('Standard User Order Flow', () => {
  beforeEach(() => {
    cy.fixture('standard_user').then((userData) => {
      cy.visit('https://www.saucedemo.com/')
      LoginPage.login(userData.name, userData.password)
    })
  })

  it('Successful order completion', () => {
    InventoryPage.addFirstProductToCart()
    CheckoutPage.goToCart()
    CheckoutPage.startCheckout()
    CheckoutPage.fillCheckoutForm('Blagoslav', 'Kondev', '2760')
    CheckoutPage.finishOrder()
    CheckoutPage.verifyOrderSuccess()
  })
})
