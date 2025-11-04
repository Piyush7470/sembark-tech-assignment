describe('Footer', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays footer on all pages', () => {
    // Check footer on home page
    cy.get('footer').should('be.visible');
    cy.contains('© 2024 Sembarks. All rights reserved.').should('be.visible');
    
    // Navigate to cart page
    cy.visit('/cart');
    cy.get('footer').should('be.visible');
    cy.contains('© 2024 Sembarks. All rights reserved.').should('be.visible');
  });

  it('has correct footer styling', () => {
    cy.get('footer').should('have.css', 'background-color', 'rgb(52, 58, 64)');
    cy.get('footer').should('have.css', 'text-align', 'center');
  });

  it('footer text is readable', () => {
    cy.get('footer').should('have.css', 'color', 'rgb(255, 255, 255)');
  });
});