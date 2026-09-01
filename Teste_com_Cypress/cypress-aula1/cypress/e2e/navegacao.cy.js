describe("Teste para Navegar", ()=>{

it("Navegando entre todas as páginas", ()=>{
    //Entra na tela home
    cy.visit("http://localhost:3000/");
    cy.wait(2000);
    cy.visit("http://localhost:3000/produtos");
    cy.wait(2000);
    cy.visit("http://localhost:3000/contato");
    cy.wait(2000);
    cy.visit("http://localhost:3000/sobre");
    cy.wait(2000);

    //Verifico se existe (contains). Se existe, eu clico
    cy.contains("Home").click();
    cy.wait(2000);
    cy.contains("Sobre").click();
    cy.wait(2000);
    cy.contains("Contato").click();
    cy.wait(2000);
    cy.contains("Produtos").click();
    cy.wait(2000);

    cy.contains("Home").click(); // procuro algum texto na pagina (se for link eu clico)
    cy.wait(2000);
    cy.get("button").click(); //procuro algum elemento que tenha a tag button
    cy.wait(2000);
    cy.get("button").contains("Clique aqui").click(); // Procuro um botão que tenha um texto específico
    cy.get('[data-cy="botao-acao"]').click(); //procuro um botao com um ID específico
    cy.get('[data-cy="mensagem-resultado"]').should("be.visible") // Verifico se a mensagem está visivel após clicar no botão
    cy.get('[data-cy="input-nome"]').type("Julinha linda") //Procuro um campo com um ID específico e digito dentro dele
})
})