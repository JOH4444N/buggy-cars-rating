    // ***********************************************
    // This example commands.js shows you how to
    // create various custom commands and overwrite
    // existing commands.
    //
    // For more comprehensive examples of custom
    // commands please read more here:
    // https://on.cypress.io/custom-commands
    // ***********************************************
    //
    //
    // -- This is a parent command --
    // Cypress.Commands.add('login', (email, password) => { ... })
    //
    //
    // -- This is a child command --
    // Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
    //
    //
    // -- This is a dual command --
    // Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
    //
    //
    // -- This will overwrite an existing command --
    // Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

    import UpdatePage from "./page/UpdatePage"
    import RegisterPage from "./page/RegisterPage"

    Cypress.Commands.add('login', (login, password) => { 
        if(login)
            cy.get('[name="login"]')
                .should('be.visible')
                .clear()
                .type(login)

        if(password)
            cy.get('[name="password"]')
                .should('be.visible')
                .clear()
                .type(password)

        cy.contains('.btn','Login')
            .click()
    })
    
    Cypress.Commands.add('logout', () => { 
        cy.get('.navbar')
            .should('exist')
            .contains('Hi,')
            .should('be.visible')

        cy.get('.navbar')
            .contains('Logout')
            .click()

        cy.contains('.btn', 'Login')
            .should('be.visible')
    })

    Cypress.Commands.add('visitPopularMake', () => {
        cy.intercept('GET', '**/ckl2phsabijs71623vk0*').as('make')

        cy.contains('.card-header', 'Popular Make')
            .parents('.card')
            .find('a')
            .should('be.visible')
            .click()

        cy.wait('@make')

        cy.url().should('include', '/make/ckl2phsabijs71623vk0')
    })

    Cypress.Commands.add('visitPopularModel', () => {
        cy.intercept('GET', '**/ckl2phsabijs71623vk0%7Cckl2phsabijs71623vqg*').as('model')
        
        cy.contains('.card-header', 'Popular Model')
            .parents('.card')
            .find('a')
            .should('be.visible')
            .click()

        cy.wait('@model')
        cy.url().should('include', '/model/ckl2phsabijs71623vk0%7Cckl2phsabijs71623vqg')
    })

    Cypress.Commands.add('visitOverallRating', () => {
        cy.intercept('GET', '**/models*').as('overall')

        cy.contains('.card-header', 'Overall Rating')
            .parents('.card')
            .find('a')
            .click()

        cy.wait('@overall')
        cy.url().should('include', '/overall')
    })

    Cypress.Commands.add('visitProfile', () => { 
        cy.intercept('GET', '**/profile*').as('profile')
        
        cy.get('.navbar')
            .should('exist')
            .contains('Profile')
            .click()
        
        cy.wait('@profile')
    })    

    Cypress.Commands.add('changePassword', (currentPassword, newPassword) => { 
        cy.intercept('PUT', '**/users/profile*').as('saveNewPassword')

        UpdatePage.completarFormCambioContraseña({
            currentPassword: currentPassword,
            newPassword: newPassword,
            confirmPassword: newPassword
        })

        UpdatePage.enviarInformacion()

        cy.wait('@saveNewPassword')
            .its('response.statusCode')
            .should('eq', 200)
    })  

    Cypress.Commands.add('buscarAuto', (make, model) => {
    cy.contains('page')
        .invoke('text')
        .then((text) => {
            const maxPages = Number(text.match(/of\s+(\d+)/)[1])
            let currentPage = 1

            function buscar() {
                cy.log(`Buscando en página ${currentPage}`)
                cy.get('table.cars tbody').then(($tbody) => {
                    if ($tbody.text().includes(make) && $tbody.text().includes(model)) {
                        cy.contains('tr', model)
                            .find('a')
                            .contains(model)
                            .click()
                    } else if (currentPage < maxPages) {
                        currentPage++
                        cy.intercept('GET', `**/models?page=${currentPage}`).as(`page${currentPage}`)
                        cy.contains('a', '»').click()
                        cy.wait(`@page${currentPage}`)
                        buscar()
                    } else {
                        cy.log(`${make} ${model} no encontrado en ninguna página`)
                    }
                })
            }
            buscar()
        })
    })