import LoginPage from '../pages/LoginPage'
import InventoryPage from '../pages/InventoryPage'
import CheckoutPage from '../pages/CheckoutPage'

describe('Cart total calculation', () => {
  const numProducts = 3
  let expectedSum = 0

  beforeEach(() => {
    cy.fixture('standard_user').then((user) => {
      cy.visit('https://www.saucedemo.com/')
      LoginPage.login(user.name, user.password)
    })
  })

  it('should correctly calculate total price in checkout', () => {
    InventoryPage.getPricesOfFirstNProducts(numProducts, (prices) => {
      expectedSum = prices.reduce((a, b) => a + b, 0)
    })

    InventoryPage.addFirstNProductsToCart(numProducts)

    CheckoutPage.goToCart()
    CheckoutPage.startCheckout()
    CheckoutPage.fillCheckoutForm('Test', 'User', '1234')

    CheckoutPage.getDisplayedItemTotal((actualTotal) => {
      expect(actualTotal).to.eq(expectedSum)
    })
  })
})
