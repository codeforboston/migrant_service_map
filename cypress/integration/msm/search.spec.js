/// <reference types="Cypress" />

context('Search', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('results in concentric circles', () => {
  	// Sanity check
	cy.get('.header-subtext')
		.should('have.text', 'Use the filters in the top bar to adjust the number of results')
	
	// Perform the search
	cy.get('.mapboxgl-ctrl-geocoder input').type('One Broadway')

	// This is not necessary but it may help in some circumstances
	cy.wait(3000)

	// Select a search result
	cy.get('.suggestions .active a').click()

	// Confirm that rings appear
	cy.get('.mapboxgl-canvas-container').contains('0.5 mile').should('have.class', 'mapboxgl-marker')
	cy.get('.mapboxgl-canvas-container').contains('1 mile').should('have.class', 'mapboxgl-marker')
  });
})