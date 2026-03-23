import RegisterPage from "../support/page/RegisterPage"

describe('HU-06 — Votar por un automóvil',()=>{
    let user
    before(()=>{
        cy.fixture('userForVote').then((data)=>{
            user=data
        })
    })

    beforeEach(()=>{
        cy.visit('/')

        cy.intercept('POST', '**/prod/users').as('registerUser')

        cy.get('.btn')
            .contains('Register')
            .should('be.visible')
            .click()

        const login = `user_${Date.now()}`
        RegisterPage.completarFormulario({
            login,
            ...user
        })

        RegisterPage.enviarRegistro()

        cy.wait('@registerUser')
            .its('response.statusCode')
            .should('eq', 201)

        cy.visit('/')
        cy.login(login, user.password)

        cy.get('.navbar')
            .contains('Hi,')
            .should('be.visible')
        
        cy.visitOverallRating()
    })

    it('@integration TC-01 Realizar un voto por un automóvil con comentario teniendo sesión activa', () => {
        cy.buscarAuto('Lamborghini', 'Veneno')

        cy.get('h3')
            .should('be.visible')
            .and('contain', 'Veneno')

        cy.contains('Lamborghini')
            .should('exist')

        cy.intercept('POST', '**/vote*').as('vote')

        cy.get('#comment')
            .should('be.visible')
            .clear()
            .type('Mi carro favorito')

        cy.contains('button', 'Vote!')
            .should('be.visible')
            .click()

        cy.wait('@vote')
            .its('response.statusCode')
            .should('eq', 200)

        cy.contains('.card-text', 'Thank you for your vote!')
            .should('be.visible')
    })

    it('@integration TC-02 Verificar que el usuario solo pueda registrar un voto en la plataforma', () => {
        cy.buscarAuto('Lamborghini', 'Veneno')

        cy.get('h3')
            .should('be.visible')
            .and('contain', 'Veneno')

        cy.contains('Lamborghini')
        .should('exist')

        cy.intercept('POST', '**/vote*').as('vote')

        cy.get('#comment')
            .should('be.visible')
            .clear()
            .type('Mi carro favorito')

        cy.contains('button', 'Vote!')
            .should('be.visible')
            .click()

        cy.wait('@vote')
            .its('response.statusCode')
            .should('eq', 200)

        cy.contains('.card-text', 'Thank you for your vote!')
            .should('be.visible')

        cy.visit('/')
        cy.visitOverallRating()

        cy.buscarAuto('Pagani', 'Zonda')

        cy.get('h3')
            .should('be.visible')
            .and('contain', 'Zonda')

        cy.contains('Pagani')
            .should('exist')

        cy.contains('button', 'Vote!')
            .should('not.exist')

        cy.contains('.card-text', 'Thank you for your vote!')
            .should('be.visible')
    })

    it('@integration TC-03 Verificar que el voto se registre y el contador de votos se actualice correctamente', () => {
        cy.buscarAuto('Alfa Romeo', 'Mito')

        cy.get('h3')
            .should('be.visible')
            .and('contain', 'Mito')

        cy.contains('Alfa Romeo')
            .should('exist')

        cy.contains('Votes:')
            .find('strong')
            .invoke('text').then((text) => {
                const votosIniciales = Number(text.trim())
                cy.wrap(votosIniciales).as('votosIniciales')
            })

        cy.intercept('POST', '**/vote*').as('vote')

        cy.get('#comment')
            .should('be.visible')
            .clear()
            .type('Mi carro favorito')

        cy.contains('button', 'Vote!')
            .should('be.visible')
            .click()

        cy.wait('@vote')
            .its('response.statusCode')
            .should('eq', 200)

        cy.contains('.card-text', 'Thank you for your vote!')
            .should('be.visible')

        cy.get('@votosIniciales').then((votosIniciales) => {
            cy.contains('Votes:')
                .find('strong')
                .should(($el) => {
                    const votosActuales = Number($el.text().trim())
                    expect(votosActuales).to.eq(votosIniciales + 1)
                })
        })
    })

    it('@integration TC-04 Verificar que el usuario pueda registrar un voto sin ingresar comentario', () => {
        cy.buscarAuto('Lancia', 'Stratos')

        cy.get('h3')
            .should('be.visible')
            .and('contain', 'Stratos')

        cy.contains('Lancia')
            .should('exist')

        cy.intercept('POST', '**/vote*').as('vote')

        cy.contains('button', 'Vote!')
            .should('be.visible')
            .click()

        cy.wait('@vote')
            .its('response.statusCode')
            .should('eq', 200)

        cy.contains('.card-text', 'Thank you for your vote!')
            .should('be.visible')
    })

    it('@integration TC-05 Intentar votar por un automóvil sin tener sesión iniciada', () => {
        cy.visit('/')
        cy.logout()

        cy.visitOverallRating()
        cy.buscarAuto('Lamborghini', 'Veneno')

        cy.get('h3')
            .should('be.visible')
            .and('contain', 'Veneno')

        cy.contains('Lamborghini')
            .should('exist')

        cy.contains('.card-text', 'You need to be logged in to vote.')
            .should('be.visible')
    })

})