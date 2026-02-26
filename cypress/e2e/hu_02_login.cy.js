
describe('HU-02 — Inicio de sesión de usuario',()=>{
    let user

    before(()=>{
        cy.fixture('loginValido').then((valor)=>{
            user = valor
        })
    })

    beforeEach(()=>{
        cy.visit('/')
    })

    it('TC-01 Iniciar sesión con login y password válidos',()=>{
        cy.login(user.login, user.password)  

        cy.get('.navbar')
        .contains('Hi,')
        .should('be.visible')
    })

    it('TC-02 Intentar iniciar sesión sin completar el campo Login',()=>{
        cy.login('','Password456')

        cy.get('[name="login"]')
        .should('have.attr','required')

        cy.get('.navbar')
        .contains('Hi,')
        .should('not.exist')
    })

    it('TC-03 Intentar iniciar sesión sin completar el campo Password',()=>{
        cy.login("username01","")

        cy.get('[name="password"]')
        .should('have.attr','required')

        cy.get('.navbar')
        .contains('Hi,')
        .should('not.exist')
    })

    it('TC-04 Intentar iniciar sesión sin completar ningún campo',()=>{
        cy.login("","")

        cy.get('[name="login"]')
        .should('have.attr','required')

        cy.get('[name="password"]')
        .should('have.attr','required')

        cy.get('.navbar')
        .contains('Hi,')
        .should('not.exist')
    })

    it('TC-05 Iniciar sesión con login inexistente',()=>{
        cy.login("username0098","Prueba123*")

        cy.contains('Invalid username/password')
        .should('be.visible')
    })

    it('TC-06 Iniciar sesión con login registrado y password incorrecto',()=>{
        cy.login(user.login,"Qwerty1*")

        cy.contains('Invalid username/password')
        .should('be.visible')
    } )
})