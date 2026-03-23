
describe('HU-02 — Inicio de sesión de usuario',()=>{
    let user

    before(()=>{
        cy.fixture('loginValido').then((data)=>{
            user = data
        })
    })

    beforeEach(()=>{
        cy.visit('/')
    })

    it('@integration TC-01 Iniciar sesión con login y password válidos', () => {

        cy.intercept('POST', '**/prod/oauth/token').as('loginUser')

        cy.login(user.login, user.password)

        cy.wait('@loginUser')
            .then((interception) => {
                expect(interception.request.method).to.eq('POST')

                expect(interception.request.body)
                    .to.contain(`username=${user.login}`)

                expect(interception.response.statusCode).to.eq(200)
            })

        cy.get('.navbar')
            .contains('Hi,')
            .should('be.visible')

    })

    it('@ui TC-02 Intentar iniciar sesión sin completar el campo Login',()=>{
        cy.login('','Password456')

        cy.get('[name="login"]')
            .should('have.attr','required')

        cy.get('.navbar')
            .contains('Hi,')
            .should('not.exist')
    })

    it('@ui TC-03 Intentar iniciar sesión sin completar el campo Password',()=>{
        cy.login("username01","")

        cy.get('[name="password"]')
            .should('have.attr','required')

        cy.get('.navbar')
            .contains('Hi,')
            .should('not.exist')
    })

    it('@ui TC-04 Intentar iniciar sesión sin completar ningún campo',()=>{
        cy.login("","")

        cy.get('[name="login"]')
            .should('have.attr','required')

        cy.get('[name="password"]')
            .should('have.attr','required')

        cy.get('.navbar')
            .contains('Hi,')
            .should('not.exist')
    })

    it('@integration TC-05 Iniciar sesión con login inexistente', () => {

        cy.intercept('POST', '**/prod/oauth/token').as('loginFail')

        cy.login("username0098", "Prueba123*")

        cy.wait('@loginFail')
            .then((interception) => {
                expect(interception.request.method).to.eq('POST')

                expect(interception.request.body)
                    .to.contain('username=username0098')

                expect(interception.response.statusCode).to.eq(401)
            })

        cy.contains('Invalid username/password')
        .should('be.visible')

    })

    it('@integration TC-06 Iniciar sesión con login registrado y password incorrecto', () => {
        cy.intercept('POST', '**/prod/oauth/token').as('loginFail')

        cy.login(user.login, "Qwerty1*")

        cy.wait('@loginFail')
            .then((interception) => {
                expect(interception.request.method).to.eq('POST')

                expect(interception.request.body)
                    .to.contain(`username=${user.login}`)

                expect(interception.response.statusCode).to.eq(401)
            })

        cy.contains('Invalid username/password')
            .should('be.visible')
    })
})