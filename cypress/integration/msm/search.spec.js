/// <reference types="Cypress" />

context("Search", () => {
  before(() => {
    cy.visit("http://localhost:3000");
  });

  it("results in concentric circles", () => {
    // Sanity check
    cy.get(".header-subtext").should(
      "have.text",
      "Use the filters in the top bar to adjust the number of results"
    );

    // Perform the search
    cy.get(".mapboxgl-ctrl-geocoder input").type("One Broadway");

    // This is not necessary but it may help in some circumstances
    cy.wait(3000);

    // Select a search result
    cy.get(".suggestions .active a").click();

    // Confirm that rings appear
    cy.get(".mapboxgl-canvas-container")
      .contains("0.5 mile")
      .should("have.class", "mapboxgl-marker");
    cy.get(".mapboxgl-canvas-container")
      .contains("1 mile")
      .should("have.class", "mapboxgl-marker");
  });

  it("can input a new location into the search bar", () => {
    // select all and type a second location
    cy.get(".mapboxgl-ctrl-geocoder input")
      .type("{selectall}Davis Square")
      .type(" ");

    // This is not necessary but it may help in some circumstances
    cy.wait(500);

    // Select a search result
    cy.get(".suggestions .active a").click();

    // Confirm that rings appear
    cy.get(".mapboxgl-canvas-container")
      .contains("0.5 mile")
      .should("have.class", "mapboxgl-marker");
    cy.get(".mapboxgl-canvas-container")
      .contains("1 mile")
      .should("have.class", "mapboxgl-marker");

    // Confirm that search suggestion has been added to input field
    cy.get(".mapboxgl-ctrl-geocoder input").should(
      "have.value",
      "Davis Square, Somerville, Massachusetts 02144, United States"
    );
  });

  it("can remove a reference location", () => {
    // clear my current location
    cy.get("button.geocoder-icon.geocoder-icon-close").click();

    // Confirm that markers don't appear
    cy.get(".mapboxgl-marker").should("not.exist");
  });
});
