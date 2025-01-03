describe('example-refresh', () => {
  it('should refresh the example', () => {
    // given
    cy.visit('/api/faker.html#constructor');
    cy.get('.refresh').first().as('refresh');
    cy.get('@refresh').next().find('code').as('codeBlock');
    cy.get('@codeBlock').then(($el) => {
      const originalCodeText = $el.text();

      cy.get('@refresh')
        .click()
        .should('not.be.disabled') // stays disabled on error
        .then(() => {
          cy.get('@codeBlock').then(($el) => {
            const newCodeText = $el.text();
            expect(newCodeText).not.to.equal(originalCodeText);

            cy.get('@refresh')
              .click()
              .should('not.be.disabled') // stays disabled on error
              .then(() => {
                cy.get('@codeBlock').then(($el) => {
                  const newCodeText2 = $el.text();
                  expect(newCodeText2).not.to.equal(originalCodeText);
                  expect(newCodeText2).not.to.equal(newCodeText);
                });
              });
          });
        });
    });
  });
});
