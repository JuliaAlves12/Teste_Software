describe("Teste de navegação", ()=>{

    it("Navegando entre páginas", ()=>{

        //Visitando página de login
        cy.visit("http://localhost:5173/login")
        cy.wait(3000);

        //Colocando informações no login (Email + senha)
        cy.get('#email').type('admin@example.com');
        cy.wait(3000);
        cy.get('#senha').type('admin');

        //Clicando no botão de entrar
        cy.get('.botao-entrar').click()

        //Visitando página principal
        cy.visit("http://localhost:5173/");
        cy.wait(3000);

        //Visitando página de filme específico
        cy.visit("http://localhost:5173/movie?id=4");
        cy.wait(3000);

        //Visitando página de editar filme
        cy.visit("http://localhost:5173/edit-movie?id=4");
        cy.wait(3000);

        //Voltando para home 
        cy.visit("http://localhost:5173/");
        cy.wait(3000);

        //Clicando no Adicionar Filme da tela Home
        cy.get('.botao-adicionar').click();
        cy.wait(3000);
    })
})