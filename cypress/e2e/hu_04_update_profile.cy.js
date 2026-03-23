import RegisterPage from "../support/page/RegisterPage"
import UpdatePage from "../support/page/UpdatePage"

describe('HU-04 — Actualización de perfil de usuario',()=>{
    let user
    let password
    let updatepassword
    let passwordparameters
    let passwordvalidation
    let register

    before(()=>{
        cy.fixture('loginForUpdate').then((data)=>{
            user=data
        })

        cy.fixture('changePassword').then((data)=>{
            password=data
        })

        cy.fixture('userForChangePassword').then((data)=>{
            register=data
        })

        cy.fixture('loginForUpdatePassword').then((data)=>{
            updatepassword=data
        })
       
        cy.fixture('LoginForUpdatePasswordParameters').then((data)=>{
            passwordparameters=data
        })

        cy.fixture('LoginForUpdatePasswordValidation').then((data)=>{
            passwordvalidation=data
        })
    })

    describe('Formulario informacion basica',()=>{

        beforeEach(()=>{
            cy.visit('/')

            cy.login(user.login, user.password)
        })

        it('@integration - TC-01 Editar la información básica con datos válidos',()=>{
            cy.intercept('PUT', '**/users/profile*').as('saveProfile')

            cy.visitProfile()

            UpdatePage.completarFormBasic('Nombre nuevo','Apellido nuevo')

            UpdatePage.enviarInformacion()

            cy.wait('@saveProfile')
                .its('response.statusCode')
                .should('eq', 200)

            cy.get('.result')
                .should('be.visible')
                .and('contain', 'The profile has been saved successful')
            
            cy.reload()

            cy.visitProfile()

            cy.get('#firstName')
                .should('have.value','Nombre nuevo')
            
            cy.get('#lastName')
                .should('have.value','Apellido nuevo')
        })

        it('@ui TC-02 Verificar la opción de salir sin guardar cambios',()=>{
            cy.visitProfile()

            UpdatePage.completarFormBasic('Cambio Fallido', 'Cambio Fallido')

            cy.contains('.btn','Cancel')
                .should('be.visible')
                .click()
            
            cy.visitProfile()

            cy.get('#firstName')
                .should('have.value','Nombre nuevo')
            
            cy.get('#lastName')
                .should('have.value','Apellido nuevo')
        })

        it('@ui TC-03 Verificar que el campo login no se puede editar',()=>{
            cy.visitProfile()

            cy.get('#username')
                .should('be.visible')
                .and('be.disabled')
        })

        it('@ui TC-04 Intentar editar información dejando el campo First Name vacío',()=>{
            cy.visitProfile()

            cy.get('#firstName')
                .clear()

            cy.get('.alert')
                .should('be.visible')
                .contains('First Name is required')
            
            cy.contains('button','Save')
                .should('be.disabled')
        })

        it('@ui TC-05 Intentar editar información dejando el campo Last Name vacío',()=>{
            cy.visitProfile()

            cy.get('#lastName')
                .clear()

            cy.get('.alert')
                .should('be.visible')
                .contains('Last Name is required')
            
            cy.contains('button','Save')
                .should('be.disabled')
        })
    })

    describe('Formulario informacion adicional',()=>{
        beforeEach(()=>{
            cy.visit('/')

            cy.login(user.login, user.password)
        })
        it('@integration TC-06 Actualizar información adicional del perfil con datos válidos',()=>{
            
            cy.intercept('PUT', '**/users/profile*').as('saveProfile')
            
            cy.visitProfile()

            cy.get('#gender')
                .should('be.visible')
                .clear()
                .type('F')
                
            cy.get('#age')
                .should('be.visible')
                .clear()
                .type('23')

            cy.get('#address')
                .should('be.visible')
                .clear()
                .type('Cra 6b #23-45')

            cy.get('#phone')
                .should('be.visible')
                .clear()
                .type('+573849205748')

            cy.get('#hobby')
                .should('be.visible')
                .select('Biking')
            
            UpdatePage.enviarInformacion()

            cy.wait('@saveProfile')
                .its('response.statusCode')
                .should('eq', 200)

            cy.get('.result')
                .should('be.visible')
                .and('contain', 'The profile has been saved successful')

            cy.reload()

            cy.visitProfile()
            

            cy.get('#gender').should('have.value','F')
            cy.get('#age').should('have.value','23')
            cy.get('#address').should('have.value','Cra 6b #23-45')
            cy.get('#phone').should('have.value','+573849205748')
            cy.get('#hobby').should('have.value','Biking')

        })

        it('@ui TC-07 Verificar que el campo Age solo permita números enteros',()=>{
            cy.visitProfile()

            cy.get('#age')
                .should('be.visible')
                .clear()
                .type('incorrecto')
                .and('have.value','')
        })

        it('@ui TC-08 Verificar que el campo Phone solo permita el símbolo + y números ',()=>{
            cy.visitProfile()

            cy.get('#phone')
                .should('be.visible')
                .clear()
                .type('asdfgh_*')
                .and('have.value','')
        })

        it('@ui TC-09 Verificar el campo Gender sea lista desplegable',()=>{
            cy.visitProfile()
            
            cy.get('#gender')
                .should('exist')
                .should('have.prop', 'tagName', 'SELECT')
        })

        it('@ui TC-10 Verificar el campo Hobby sea lista desplegable',()=>{
            cy.visitProfile()
            
            cy.get('#hobby')
                .should('exist')
                .should('have.prop', 'tagName', 'SELECT')
        })
    })

    describe('Formulario cambio de contraseña', () => {
        let dynamicLogin

        beforeEach(()=>{

            cy.visit('/')
            cy.intercept('POST', '**/prod/users').as('registerUser')

            cy.get('.btn')
                .contains('Register')
                .should('be.visible')
                .click()

            dynamicLogin = `user_${Date.now()}`
            
            RegisterPage.completarFormulario({
                login: dynamicLogin,
                ...register
            })

            RegisterPage.enviarRegistro()

            cy.wait('@registerUser')
                .its('response.statusCode')
                .should('eq', 201)

            cy.visit('/')
            cy.login(dynamicLogin, password.currentPassword)

            cy.get('.navbar')
                .contains('Hi,')
                .should('be.visible')
            
            cy.visitProfile()
        })

        it('@integration TC-11 Cambiar la contraseña con datos válidos', () => {
            cy.changePassword(password.currentPassword, password.newPassword)
            cy.get('.result')
                .should('be.visible')
                .and('contain', 'The profile has been saved successful')
        })

        it('@integration TC-12 Validar login con nueva contraseña después del cambio', () => {
            
            cy.changePassword(password.currentPassword, password.newPassword)
            cy.logout()
            cy.visit('/')
            cy.login(dynamicLogin, password.newPassword)
            cy.get('.navbar').contains('Hi,').should('be.visible')
        })

        it('@integration TC-13 Intentar login con contraseña vieja', () => {
            
            cy.changePassword(password.currentPassword, password.newPassword)
            cy.logout()
            cy.visit('/')
            cy.login(dynamicLogin, password.currentPassword)
            cy.contains('Invalid username/password').should('be.visible')
        })

        it('@integration TC-14 Verificar que el sistema no permita reutilizar la contraseña actual como nueva contraseña', () => {
            cy.changePassword(password.currentPassword, password.newPassword)
            cy.get('.result').should('be.visible').and('contain', 'Incorrect password')
        })
    })

    describe('Parametros de la contraseña',()=>{
        beforeEach(()=>{
            cy.visit('/')

            cy.login(passwordparameters.login, passwordparameters.password)
        })

        it('@ui TC-15 Intentar cambiar contraseña menor a 8 caracteres que cumpla mayúscula, número y símbolo',()=>{
            cy.visitProfile()

            UpdatePage.completarFormCambioContraseña({
                currentPassword: passwordparameters.password,
                newPassword: 'Qwer12*',
                confirmPassword: 'Qwer12*'
            })

            cy.contains('button','Save')
                .should('be.disabled')
        })

        it('@ui TC-16 Intentar cambiar contraseña de 8 caracteres sin letra mayúscula',()=>{
            cy.visitProfile()

            UpdatePage.completarFormCambioContraseña({
                currentPassword: passwordparameters.password,
                newPassword: 'qwert12*',
                confirmPassword: 'qwert12*'
            })

            cy.contains('button','Save')
                .should('be.disabled')
        })

        it('@ui TC-17 Intentar cambiar contraseña de 8 caracteres sin número',()=>{
            cy.visitProfile()

            UpdatePage.completarFormCambioContraseña({
                currentPassword: passwordparameters.password,
                newPassword: 'qwertyu*',
                confirmPassword: 'qwertyu*'
            })

            cy.contains('button','Save')
                .should('be.disabled')
        })

        it('@ui TC-18 Intentar cambiar contraseña de 8 caracteres sin carácter especial',()=>{
            cy.visitProfile()

            UpdatePage.completarFormCambioContraseña({
                currentPassword: passwordparameters.password,
                newPassword: 'qwertyu1',
                confirmPassword: 'qwertyu1'
            })

            cy.contains('button','Save')
                .should('be.disabled')
        })
    })

    describe('Validación formulario cambio de contraseña',()=>{
        beforeEach(()=>{
            cy.visit('/')

            cy.login(passwordvalidation.login, passwordvalidation.password)
        })

        it('@ui TC-19 Verificar que no permita cambiar contraseña con el campo Current Password vacío',()=>{
            cy.visitProfile()

            UpdatePage.completarFormCambioContraseña({
                currentPassword: '',
                newPassword: 'Qwert12*',
                confirmPassword: 'Qwert12*'
            })

            UpdatePage.enviarInformacion()

            cy.get('.result')
                .should('be.visible')
                .and('contain','password required')
        })

        it('@ui TC-20 Verificar que los campos New Password y Confirm Password sean obligatorios',()=>{
            cy.visitProfile()

            UpdatePage.completarFormCambioContraseña({
                currentPassword: passwordvalidation.password,
                newPassword: 'Qwert12*',
                confirmPassword: ''
            })

            UpdatePage.enviarInformacion()

            cy.get('.alert')
                .should('be.visible')
                .and('contain','required')
        })

        it('@integration TC-21 Intentar cambiar la contraseña con contraseña actual incorrecta',()=>{
            cy.visitProfile()

            UpdatePage.completarFormCambioContraseña({
                currentPassword: 'Abcdre123*',
                newPassword: 'Qwert12*',
                confirmPassword: 'Qwert12*'
            })

            UpdatePage.enviarInformacion()

            cy.get('.result')
                .should('be.visible')
                .and('contain','Incorrect username or password')
        })

        it('@ui TC-22 Intentar cambiar la contraseña con nueva contraseña y confirmación que no coinciden',()=>{
            cy.visitProfile()

            UpdatePage.completarFormCambioContraseña({
                currentPassword: passwordvalidation.password,
                newPassword: 'Qwert12*',
                confirmPassword: 'Qwert1234*'
            })

            cy.get('.alert')
                .should('be.visible')
                .and('contain','Passwords do not match')
        })
    })
})