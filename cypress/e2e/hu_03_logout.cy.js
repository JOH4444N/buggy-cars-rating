describe('HU-03 — Cierre de sesión (Logout)',()=>{
    let user

    before(()=>{
        cy.fixture('loginForLogout').then((data)=>{
            user=data
        })
    })

    beforeEach(()=>{
        cy.visit('/')
        cy.login(user.login, user.password)
    })

    const modules = [
        { name: 'Popular Make',  visit: () => cy.visitPopularMake() },
        { name: 'Popular Model', visit: () => cy.visitPopularModel()},
        { name: 'Overall Rating',visit: () => cy.visitOverallRating()},
        { name: 'Profile',       visit: () => cy.visitProfile()     },
    ]

    modules.forEach(({ name, visit }) => {
        it(`@ui TC-01 Verificar cierre de sesión desde: ${name}`, () => {
            visit()

            cy.logout()

            cy.contains('.btn', 'Login').should('be.visible')
        })
    })

    modules.forEach(({ name, visit }) => {
        it(`@ui TC-02 Verificar redirección al hacer logout desde: ${name}`, () => {
            visit()

            cy.logout()

            cy.url().should('eq', 'https://buggy.justtestit.org/')
        })
    })

    it('@ui - TC-03 Intentar acceder a página protegida después del logout', () => {
        cy.logout()

        cy.visit('/profile', { failOnStatusCode: false })

        cy.url().should('not.include', '/profile')
            .and('eq', 'https://buggy.justtestit.org/')
        
        cy.contains('.btn', 'Login').should('be.visible')
    })

    it('@ui - TC-04 Intentar acceder a una página protegida usando el botón “Back” del navegador después del logout',()=>{
        cy.visitProfile()

        cy.logout()

        cy.go('back')
        cy.contains('.btn', 'Login')
            .should('be.visible')
    })
})