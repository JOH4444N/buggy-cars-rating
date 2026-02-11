class RegisterPage{
    elements = {
        loginInput: () => cy.get('#username'),
        firstNameInput: () => cy.get('#firstName'),
        lastNameInput: () => cy.get('#lastName'),
        passwordInput: () => cy.get('#password'),
        confirmPasswordInput: () => cy.get('#confirmPassword'),
        registerButton: ()=> cy.contains('button','Register'),
    }

    completarFormulario(user={}){
        if(user.login)
            this.elements.loginInput().should('be.visible').type(user.login)
        if(user.firstName)
            this.elements.firstNameInput().should('be.visible').type(user.firstName)
        if(user.lastName)
            this.elements.lastNameInput().should('be.visible').type(user.lastName)
        if(user.password)
            this.elements.passwordInput().should('be.visible').type(user.password)
        if(user.confirmPassword)
            this.elements.confirmPasswordInput().should('be.visible').type(user.confirmPassword)
    }

    enviarRegistro(){
        this.elements.registerButton().should('be.enabled').click()
    }

    buttonDisabled(){
        this.elements.registerButton().should('be.disabled')
    }

    screenshotButtonDisabled() {
        this.elements.registerButton()
        .should('be.disabled')
        .screenshot()
    }
}
export default new RegisterPage()

