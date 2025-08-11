import LoginPage from '../pages/LoginPage'
import InventoryPage from '../pages/InventoryPage'

describe('Login test cases', () => {

  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

  beforeEach(() => {
    LoginPage.visit();
  });

  it('Successful login - valid credentials', () => {
    cy.fixture('standard_user').then((standard_user) => {
      LoginPage.login(standard_user.name, standard_user.password);
      cy.url().should('include', '/inventory.html');
    })
  });

  it('Failed login - locked out user', () => {
    cy.fixture('locked_out_user').then((locked_out_user) => {
      LoginPage.login(locked_out_user.name, locked_out_user.password);
      LoginPage.getErrorMessage().should('contain', 'Sorry, this user has been locked out.');
    })
  });

  it('Successful login - problems afterwards', () => {
    cy.fixture('problem_user').then((problem_user) => {
      LoginPage.login(problem_user.name, problem_user.password);
      cy.url().should('include', '/inventory.html');
      InventoryPage.getAllProductImages().each(($img) => {
        const src = $img.attr('src')
        expect(src, 'Image src exists').to.be.a('string').and.not.be.empty
  
        const hasValidExtension = validExtensions.some(ext => src.toLowerCase().endsWith(ext))
        expect(hasValidExtension, `Image src "${src}" has a valid image extension`).to.be.true
      })
    })
  });

  it('Successful login - errors afterwards', () => {
    let brokenAddCount = 0
    let brokenRemoveCount = 0
    let cartAddFailureDetected = false
    let cartRemoveFailureDetected = false
  
    const validImageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

    Cypress.on('uncaught:exception', (err) => {
      if (err.message.includes('Failed to add item to the cart')) {
        cartAddFailureDetected = true
        return false
      }
  
      if (err.message.includes('Failed to remove item from cart')) {
        cartRemoveFailureDetected = true
        return false
      }
  
      return true
    })
    cy.fixture('error_user').then((error_user) => {
      cy.visit('https://www.saucedemo.com/')
      LoginPage.login(error_user.name, error_user.password)
      cy.url().should('include', '/inventory.html')
    
      InventoryPage.verifyAllImagesHaveValidExtension(validImageExtensions)
      InventoryPage.verifyAllPricesHaveValidFormat()
    
      InventoryPage.attemptAddToCartAndTrackBrokenButtons((count) => {
        brokenAddCount = count
      })
    
      cy.wait(1000)
    
      InventoryPage.attemptRemoveFromCartAndTrackBrokenButtons((count) => {
        brokenRemoveCount = count
      })
    
      cy.then(() => {
        expect(cartAddFailureDetected, 'Application threw error when adding to cart').to.be.true
        expect(cartRemoveFailureDetected, 'Application threw error when removing from cart').to.be.true
    
        expect(brokenAddCount, 'At least one broken Add to Cart button').to.be.gte(1)
        expect(brokenRemoveCount, 'At least one broken Remove button').to.be.gte(1)
      })
    })
  })
  
})