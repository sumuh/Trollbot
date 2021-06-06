describe('Trollbot chat page end to end tests', function () {

  it('Front page can be visited', function () {
    cy.visit('http://localhost:3000')
    cy.contains('Trollbot')
    cy.contains('Chat window')
  })

  it('Can send a message', function () {
    cy.contains('Send')
    cy.get('#message').type('Test message')
    cy.get('#submit').click()
    cy.contains('Test message')
  })

  it('Can clear messages', function () {
    cy.contains('Send')
    cy.get('#clear').click()
    cy.contains('Test message').should('not.exist')
    cy.contains('Hello, I am a bot.')
  })

})