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

})
})