describe('Trollbot app E2E testing', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3001')
    loginHelper()
  })

  after(() => {
    logoutHelper()
  })

  const loginHelper = () => {
    cy.intercept('POST', '/login').as('login')
    cy.get('#username').type('cypress')
    cy.get('#login').click()
  }

  const logoutHelper = () => {
    cy.get('#logout').click()
  }

  // Tests

  it('Select room page can be visited', function () {
    cy.contains('Select Room')
  })

  it('Can select a room ', function () {
    cy.get('#room').type('Test')
    cy.get('#join').click()
    cy.contains('Room:')
  })

  it('Can send a message', function () {
    cy.get('#room').type('Test')
    cy.get('#join').click()
    cy.get('#message-field').type('Test message')
    cy.get('#message-submit').click()
    cy.contains('Test message')
  })

})