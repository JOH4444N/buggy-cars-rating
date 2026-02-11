import RegisterPage from "../support/page/RegisterPage" 
describe('Validación HU-01 — Registro de usuario',()=>{
    let user

    before(()=>{
        cy.fixture('usuarioRegistrado').then((data)=>{
            user=data
        }) 
    })

    beforeEach(()=>{
        cy.visit('/')

        cy.get('.btn')
        .contains('Register')
        .should('be.visible')
        .click()
    })

    it('@integration TC-01 - Registrar un nuevo usuario con datos válidos',()=>{
        cy.intercept('POST', '**/prod/users').as('registerUser')

        const dynamicLogin ={
            ...user,
            login: `user_${Date.now()}`
        }

        RegisterPage.completarFormulario(dynamicLogin)
        RegisterPage.enviarRegistro()

        cy.wait('@registerUser')
        .then((interception)=>{
            expect(interception.request.method).to.eq('POST')

            expect(interception.request.body).to.deep.include({
                username: dynamicLogin.login,
                firstName: dynamicLogin.firstName,
                lastName: dynamicLogin.lastName
            })

            expect(interception.response.statusCode).to.eq(201)
        })

        cy.get('.result')
        .should('be.visible')
        .and('contain','Registration is successful')
        cy.screenshot()
    })

    const datosFormulario = {
        login: 'Prueba001',
        firstName: 'Prueba',
        lastName: 'Funcional',
        password: 'Prueba123*',
        confirmPassword: 'Prueba123*'
    }

    it('@ui TC-02 - Intentar registrar un usuario sin completar el campo Login',()=>{
        RegisterPage.completarFormulario({
            ...datosFormulario,
            login: ''
        })
        RegisterPage.buttonDisabled()
        RegisterPage.screenshotButtonDisabled()
    })

    it('@ui TC-03 - Intentar registrar un usuario sin completar el campo First Name',()=>{
        RegisterPage.completarFormulario({
            ...datosFormulario,
            firstName: ''
        })
        RegisterPage.buttonDisabled()
        RegisterPage.screenshotButtonDisabled()
    })

    it('@ui TC-04 - Intentar registrar un usuario sin completar el campo Last Name',()=>{
        RegisterPage.completarFormulario({
            ...datosFormulario,
            lastName: ''
        })
        RegisterPage.buttonDisabled()
        RegisterPage.screenshotButtonDisabled()
    })

    it('@ui TC-05 - Intentar registrar un usuario sin completar el campo Password',()=>{
        RegisterPage.completarFormulario({
            ...datosFormulario,
            password: ''
        })
        RegisterPage.buttonDisabled()
        RegisterPage.screenshotButtonDisabled()
    })

    it('@ui TC-06 - Intentar registrar un usuario sin completar el campo Confirm Password',()=>{
        RegisterPage.completarFormulario({
            ...datosFormulario,
            confirmPassword: ''
        })
        RegisterPage.buttonDisabled()
        RegisterPage.screenshotButtonDisabled()
    })

    it('@ui TC-07 - Registrar usuario con contraseña menor a 8 caracteres que cumple mayúscula, número y símbolo',()=>{
        RegisterPage.completarFormulario({
            ...datosFormulario,
            password: 'Ab01*',
            confirmPassword: 'Ab01*'
        })
        RegisterPage.enviarRegistro()
        cy.get('.result')
        .should('be.visible')
        .and('contain','size')
        cy.screenshot()
    })

    it('@ui TC-08 - Registrar usuario con contraseña de 8 caracteres sin letra mayúscula',()=>{
        RegisterPage.completarFormulario({
            ...datosFormulario,
            password: 'prueba1*',
            confirmPassword: 'prueba1*'
        })

        RegisterPage.enviarRegistro()

        cy.get('.result')
        .should('be.visible')
        .and('contain','Password must have uppercase characters')
        cy.screenshot()
    })

    it('@ui TC-09 - Registrar usuario con contraseña de 8 caracteres sin número',()=>{
        RegisterPage.completarFormulario({
            ...datosFormulario,
            password: 'pruebaA*',
            confirmPassword: 'pruebaA*'
        })

        RegisterPage.enviarRegistro()

        cy.get('.result')
        .should('be.visible')
        .and('contain','Password must have numeric characters')
        cy.screenshot()
    })

    it('@ui TC-10 - Registrar usuario con contraseña de 8 caracteres sin simbolo',()=>{
        RegisterPage.completarFormulario({
            ...datosFormulario,
            password: 'pruebaA1',
            confirmPassword: 'pruebaA1'
        })

        RegisterPage.enviarRegistro()

        cy.get('.result')
        .should('be.visible')
        .and('contain','Password must have symbol characters')
        cy.screenshot()
    })

    it('@ui TC-11 - Registrar un usuario con Password y Confirm Password diferentes',()=>{
        RegisterPage.completarFormulario({
            ...datosFormulario,
            password: 'Prueba1*',
            confirmPassword: 'Pruesdf1*'
        })

        cy.get('.alert')
        .should('contain','Passwords do not match')
        .and('be.visible')
        cy.screenshot()
    })

    it('@integration TC-12 - Registrar un usuario con Login previamente registrado',()=>{
        cy.intercept('POST','**/prod/users').as('loginDuplicate')

        RegisterPage.completarFormulario(user)
        RegisterPage.enviarRegistro()

        cy.wait('@loginDuplicate')
        .then((interception)=>{
            expect(interception.request.method).to.eq('POST')

            expect(interception.request.body).to.deep.include({
                username: user.login
            })

            expect(interception.response.statusCode).to.eq(400)
        })

        cy.get('.result')
        .should('be.visible')
        .and('contain','User already exists')
    })
})