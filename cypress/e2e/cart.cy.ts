describe('Cart Page', () => {
  beforeEach(() => {
    cy.visit('/cart');
  });

  it('displays empty cart message when cart is empty', () => {
    cy.contains('Your Cart is Empty').should('be.visible');
    cy.contains('Continue Shopping').should('be.visible');
  });

  it('navigates to home page when clicking Continue Shopping', () => {
    cy.contains('Continue Shopping').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('displays cart items and totals when cart has items', () => {
    cy.visit('/');
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.contains('Add to Cart').click();
    });

    cy.wait(500);
    cy.visit('/cart');
  
    cy.contains('Shopping Cart').should('be.visible');
    cy.contains('Order Summary').should('be.visible');
    cy.contains('Total:').should('be.visible');
    cy.get('[data-testid="quantity-input"]').should('exist');
  });

  it('removes item from cart', () => {
    cy.visit('/');
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.contains('Add to Cart').click();
    });

    cy.wait(500);
    
    cy.visit('/cart');
    cy.get('[data-testid="quantity-input"]').should('exist');
    cy.get('[data-testid="remove-item"]').first().click();
    cy.contains('Your Cart is Empty').should('be.visible');
  });

  it('updates item quantity', () => {
    cy.visit('/');
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.contains('Add to Cart').click();
    });
    cy.wait(500);
    cy.visit('/cart');
    cy.get('[data-testid="quantity-input"]').should('have.value', '1');
    cy.get('[data-testid="update-quantity"]').click();
    cy.get('[data-testid="update-quantity"]').click();
    cy.get('[data-testid="quantity-input"]').should('have.value', '3');
  });
});