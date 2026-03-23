describe('HU-05 — Visualización de secciones en la página principal',()=>{
    beforeEach(()=>{
        cy.visit('/')
    })

    it('@ui TC-01 Verificar la visibilidad en la página principal de las secciones Popular Make, Popular Model y Overall Rating',()=>{
        cy.get('.card-header')
            .contains('Popular Make')
            .should('be.visible')

        cy.get('.card-header')
            .contains('Popular Model')
            .should('be.visible')

        cy.get('.card-header')
            .contains('Overall Rating')
            .should('be.visible')
    })

   it('@ui TC-02 Verificar que al acceder a Popular Make se muestre la misma marca destacada que aparece en la página principal',()=>{
        cy.contains('.card', 'Popular Make')
            .find('h3')
            .then(($el) => {
                const makeHome = $el.clone().children().remove().end().text().trim()
                cy.wrap(makeHome).as('popularMake')
            })

        cy.visitPopularMake()

        cy.get('@popularMake').then((makeHome) => {
            cy.get('.card-header')
                .invoke('text')
                .then((makePage) => {
                    const makeTitle = makePage.trim()

                    expect(makeTitle).to.eq(makeHome)
            })
        })
    })

    it('@ui TC-03 Verificar que la sección Popular Make muestre la marca con mayor número de votos en el sistema',()=>{
        cy.visitOverallRating()

        cy.contains('td','1')
            .parents('tr')
            .find('a[href*="/make/"]')
            .invoke('text')
            .then(text => text.trim())
            .as('topMake')

        cy.visit('/')

        cy.get('@topMake').then((topMake) => {
            cy.contains('.card','Popular Make')
                .find('h3')
                .then(($el) => {
                    const homeMake = $el.clone().children().remove().end().text().trim()

                    expect(homeMake).to.eq(topMake)
                })
        }) 
    })

    it('@ui TC-04 Verificar que al acceder a Popular Model se muestre el mismo modelo destacado que aparece en la página principal',()=>{
        cy.contains('.card', 'Popular Model')
            .find('h3')
            .then(($el) => {
                const text = $el.clone().children().remove().end().text().trim()
                const modelHome = text.split(' ').pop()   
                cy.wrap(modelHome).as('popularModel')
            })

        cy.visitPopularModel()

        cy.get('@popularModel').then((modelHome) => {
            cy.get('h3')
                .invoke('text')
                .then((modelPage) => {
                    const modelTitle = modelPage.trim()

                    expect(modelTitle).to.eq(modelHome)
                })
        })
    })

    it('@ui TC-05 Verificar que la sección Popular Model muestre el modelo con mayor número de votos',()=>{
        cy.visitOverallRating()

        cy.contains('td','1')
            .parents('tr')
            .find('a[href*="/model/"]')
            .eq(1) 
            .invoke('text')
            .then(text => text.trim())
            .as('topModel')

        cy.visit('/')

        cy.get('@topModel').then((topModel) => {
            cy.contains('.card','Popular Model')
                .find('h3')
                .then(($el) => {
                    const text = $el.clone().children().remove().end().text().trim()
                    const modelHome = text.split(' ').pop()   

                    expect(modelHome).to.eq(topModel)
                })
        }) 
    })

    it('@ui TC-06 Verificar que la sección Overall Rating redirija a la página de clasificación general de vehículos',()=>{
        cy.visitOverallRating() 

        cy.get('table.cars tbody tr').each(($row, index) => {
            if (index < 4) { 
                cy.wrap($row)
                    .find('td')
                    .eq(3) 
                    .invoke('text')
                    .then(text => {
                        const rank = parseInt(text.trim(), 10)
                        expect(rank).to.eq(index + 1)
                    })
            }
         })
    })
})