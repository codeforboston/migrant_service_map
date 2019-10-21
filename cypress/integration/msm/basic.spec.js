/// <reference types="Cypress" />

context('Basic', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('loads', () => {
	cy.get('.header-subtext')
		.should('have.text', 'Use the filters in the top bar to adjust the number of results')

	cy.get('.mapboxgl-ctrl-geocoder input').type('Cambridge Innovation Center')

	cy.get('.suggestions-wrapper .active a').should('contain', 'Cambridge').click()

	cy.get('.distance-marker:first').should('contain', '0.5 mile')
  });
})