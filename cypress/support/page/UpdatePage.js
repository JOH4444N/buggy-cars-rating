class UpdateRegister{
    elements = {
        firstNameInput: ()=> cy.get('#firstName'),
        lastNameInput: ()=> cy.get('#lastName'),
        currentPasswordInput: ()=> cy.get('#currentPassword'),
        newPasswordInput: ()=> cy.get('#newPassword'),
        confirmPasswordInput: ()=> cy.get('#newPasswordConfirmation')
    }

    completarFormBasic(firstname, lastname){
        if(firstname){
            this.elements.firstNameInput()
                .should('be.visible')
                .clear()
                .type(firstname)
        }
        if(lastname){
            this.elements.lastNameInput()
                .should('be.visible')
                .clear()
                .type(lastname)   
        }  
    }

    completarFormCambioContraseña(password={}){
        if(password.currentPassword)
            this.elements.currentPasswordInput()
                .should('be.visible')
                .clear()
                .type(password.currentPassword)
        
        if(password.newPassword)
            this.elements.newPasswordInput()
                .should('be.visible')
                .clear()
                .type(password.newPassword)
        
        if(password.confirmPassword)
            this.elements.confirmPasswordInput()
                .should('be.visible')
                .clear()
                .type(password.confirmPassword)
    }

    enviarInformacion(){
        cy.contains('button','Save')
            .should('be.visible')
            .and('be.enabled')
            .click()
    }
}
 export default new UpdateRegister()