import { InventorySelectors } from '../selectors/InventorySelectors';

class InventoryPage {
    getAllProductImages() {
      return cy.get('.inventory_item_img img')
    }
    verifyAllImagesHaveValidExtension(validExtensions) {
      cy.get(InventorySelectors.inventoryItem).each((item) => {
        cy.wrap(item).within(() => {
          cy.get(InventorySelectors.itemImage)
            .should('be.visible')
            .should('have.attr', 'src')
            .then((src) => {
              const hasValidExt = validExtensions.some(ext =>
                src.toLowerCase().endsWith(ext)
              )
              expect(hasValidExt, `Image src "${src}" has valid extension`).to.be.true
            })
        })
      })
    }
  
    verifyAllPricesHaveValidFormat() {
      cy.get(InventorySelectors.inventoryItem).each((item) => {
        cy.wrap(item).within(() => {
          cy.get(InventorySelectors.itemPrice)
            .should('exist')
            .invoke('text')
            .then((priceText) => {
              expect(priceText.trim()).to.match(/^\$\d+(\.\d{2})?$/, 'Product has valid price format')
            })
        })
      })
    }
  
    attemptAddToCartAndTrackBrokenButtons(callback) {
      let brokenCount = 0
      cy.get(InventorySelectors.inventoryItem).each((item) => {
        cy.wrap(item).within(() => {
          cy.get(InventorySelectors.itemButton).then(($btn) => {
            if ($btn.text().trim() === 'Add to cart') {
              cy.wrap($btn).click()
              cy.wait(200)
  
              cy.get(InventorySelectors.itemButton).then(($newBtn) => {
                if ($newBtn.text().trim() !== 'Remove') {
                  brokenCount += 1
                }
              })
            }
          })
        })
      }).then(() => {
        callback(brokenCount)
      })
    }
  
    attemptRemoveFromCartAndTrackBrokenButtons(callback) {
      let brokenCount = 0
      cy.get(InventorySelectors.inventoryItem).each((item) => {
        cy.wrap(item).within(() => {
          cy.get(InventorySelectors.itemButton).then(($btn) => {
            if ($btn.text().trim() === 'Remove') {
              cy.wrap($btn).click()
              cy.wait(200)
  
              cy.get(InventorySelectors.itemButton).then(($newBtn) => {
                if ($newBtn.text().trim() !== 'Add to cart') {
                  brokenCount += 1
                }
              })
            }
          })
        })
      }).then(() => {
        callback(brokenCount)
      })
    }

    addFirstProductToCart() {
      cy.get(InventorySelectors.inventoryItem).first().within(() => {
        cy.get(InventorySelectors.itemButton).contains('Add to cart').click()
      })
    }

    addFirstNProductsToCart(n) {
      cy.get(InventorySelectors.inventoryItem).each(($el, index) => {
        if (index < n) {
          cy.wrap($el).within(() => {
            cy.get(InventorySelectors.itemButton).contains('Add to cart').click()
          })
        }
      })
    }
  
    getPricesOfFirstNProducts(n, callback) {
      const prices = []
      cy.get(InventorySelectors.inventoryItem).each(($el, index) => {
        if (index < n) {
          cy.wrap($el).within(() => {
            cy.get('.inventory_item_price')
              .invoke('text')
              .then((text) => {
                const price = parseFloat(text.replace('$', ''))
                prices.push(price)
              })
          })
        }
      }).then(() => {
        callback(prices)
      })
    }
  }
  
  export default new InventoryPage()