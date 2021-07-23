/// <reference types = "cypress" />

describe ('First Test with Backend', () => {

        beforeEach('Login to The Application', () => {
            //tags are loaded befor login, so we need to create servesadasdr to mockup

            cy.intercept ('GET', '**/tags', {fixture:'tags.json'})

            cy.loginToApplication ()
    })

    it ('Verify Correct request and response', () => {

        //RUn Cypress server 

        // Use route command to provide routing configurtion (listen to post request for api ending with articles) and save it using .as() command alias command
        cy.intercept ('POST', '**/articles').as ('postArticles')

        cy.contains (' New Article ').click ()
        cy.get ('[placeholder="Article Title"]').type ('This is a title')
        cy.get ('[formcontrolname="description"]').type ('This is a description')
        cy.get ('[formcontrolname="body"]').type ('This is a body of article')
        cy.get ('[placeholder="Enter tags"]')
        cy.get('[type="button"]').click ()

        cy.wait ('@postArticles')
        cy.get ('@postArticles').then (xhr => {
            console.log (xhr)
            expect (xhr.response.statusCode).to.equal (200)
            expect (xhr.request.body.article.body).to.equal ('This is a body of article')
            expect (xhr.response.body.article.description).to.equal('This is a description')
        })
    })

    it ('should have tags with routing object', () => {
        cy.get ('[class="tag-list"]')
        .should ('contain', 'cypress')
        .and ('contain', 'automation')
        .and ('contain', 'testing') 
    })
    
    it ('verify global feeds count', () => {
        cy.intercept ('GET', '**/articles/feed*', '{"articles":[],"articlesCount":0}')
        cy.intercept ('GET', '**/articles*', {fixture:'articles.json'}) 

        cy.contains (' Global Feed ').click ()
        cy.get ('app-article-list button').then (listOfButtons => {
            expect (listOfButtons[0]).to.contain ('0')
            cy.log ('We are learning git')

        })
         
    })
})