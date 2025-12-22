// __componente__-template.ts
// Este arquivo mantém o template separado para melhor organização
// Lembre-se: a definição do template pode ficar aqui, mas o USO dele vai no connectedCallback

const componente__Template = document.createElement("template");
componente__Template.innerHTML = `
 <h1>MEU COMPONENT</h1>
 <button id="action-btn" type="button">ACTION</button>
 </br>
 <span></span>
`;
export default componente__Template;
