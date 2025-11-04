describe('Home Page', () => {
  it('loads the home page and displays products', () => {
    cy.intercept('GET', 'https://fakestoreapi.com/products', { fixture: 'products.json' }).as('getProducts');
    cy.visit('/');
    cy.contains('Product Listing').should('be.visible');
    cy.wait('@getProducts', { timeout: 20000 });
    cy.get('[data-testid="product-card"]', { timeout: 20000 }).should('have.length.at.least', 1);
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.contains('Test Product').should('be.visible');
      cy.contains('$19.99').should('be.visible');
    });
  });

  it('navigates to product detail page', () => {
    cy.intercept('GET', 'https://fakestoreapi.com/products', { fixture: 'products.json' }).as('getProducts');
    cy.intercept('GET', 'https://fakestoreapi.com/products/*', { fixture: 'product.json' }).as('getProduct');
    cy.visit('/');
    cy.wait('@getProducts');
    cy.get('[data-testid="product-card"] a[href*="/product/"]').first().click();
    cy.wait('@getProduct');
    cy.url().should('match', /\/product\/\d+\/details$/);
    cy.contains('Add to MyCart').should('be.visible');
  });
});