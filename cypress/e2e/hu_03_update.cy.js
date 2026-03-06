
describe('HU-03 — Actualizar perfil',()=>{
    let user

    before(()=>{
        cy.fixture('loginValido').then((data)=>{
            user = data
        })
    })

    beforeEach(()=>{
        cy.visit('/')
    })

    it('PRUEBA 1',()=>{
        cy.login('','Password456')
    })

    it('PRUEBA 2',()=>{
        cy.login("username01","")
    })
})