import _componenteNameTemplate from "./_componenteNameTemplate.ts";
import style from "./componentName.css?inline"; //🧪 esse tipo de imporação só funciona no vite eu acho 😅

// cria uma nova folha de estilo fazia depois preenche com o estilo importado
const _componenteNameStyle = new CSSStyleSheet();
_componenteNameStyle.replaceSync(style);
/**
 * Interface para definir a estrutura de props ou estado se necessário
 * interface ComponenteProps {
 * attribute?: string;
 * }
 */

class __ComponentName__ extends HTMLElement {
  // 1. Definição dos atributos observados
  static get observedAttributes(): string[] {
    return ["attribute"];
  }

  //💡 EXEMPLO! Elementos internos do ShadowDOM (Cache/Seletores)
  #msgElement!: HTMLSpanElement;
  #btnElement!: HTMLButtonElement;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  /**
   * 2. Lifecycle: Conectado ao DOM
   * Momento ideal para renderizar e adicionar listeners
   */
  connectedCallback(): void {
    console.log("[Lifecycle] connectedCallback");
    this.render();
    this.cacheDomElements();
    this.addEventListeners();
  }

  /**
   * 3. Lifecycle: Desconectado do DOM
   * CRUCIAL: Remover listeners para evitar memory leaks
   */
  disconnectedCallback(): void {
    console.log("[Lifecycle] disconnectedCallback");
    this.removeEventListeners();
  }

  /**
   * 4. Lifecycle: Atributo alterado
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    console.log(`[Lifecycle] Atributo '${name}' mudou de '${oldValue}' para '${newValue}'`);

    // Re-renderizar ou atualizar apenas partes específicas se necessário
    if (this.isConnected) {
      // Lógica de atualização aqui
    }
  }

  /**
   * 5. Lifecycle: Movido para um novo documento
   */
  adoptedCallback(): void {
    console.log("[Lifecycle] adoptedCallback");
  }

  // --- Métodos Privados e Helpers ---

  private getElement<T extends HTMLElement>(selector: string): T {
    if (!this.shadowRoot) {
      throw new Error("Shadow Root não foi inicializado.");
    }
    const element = this.shadowRoot.querySelector<T>(selector);

    if (!element) {
      throw new Error(`Elemento "${selector}" não encontrado no Shadow DOM.`);
    }

    return element;
  }
  /**
   * Padrão de Captura de Elementos
   * Armazena referências para evitar querySelector repetitivo
   */

  private cacheDomElements(): void {
    this.#msgElement = this.getElement<HTMLSpanElement>("span");
    this.#btnElement = this.getElement<HTMLButtonElement>("#action-btn");
  }
  /**
   * Gerenciamento de Listeners
   */
  private addEventListeners(): void {
    this.#btnElement.addEventListener("click", this.handleButtonClick);

    this.addEventListener("custom-event", this.handleCustomEvent as EventListener);
  }

  private removeEventListeners(): void {
    this.#btnElement?.removeEventListener("click", this.handleButtonClick);
    this.removeEventListener("custom-event", this.handleCustomEvent as EventListener);
  }

  private handleButtonClick = (e: MouseEvent): void => {
    const agora = new Date();
    const horaFormatada = `${agora.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    })}hs`;

    this.#msgElement.innerText = `EVENTO DISPARADO: TIPO CLICK ${horaFormatada}`;
    console.log(e);

    this.dispatchEvent(
      new CustomEvent("custom-event", {
        bubbles: true,
        composed: true,
        detail: { origin: "click interno" }
      })
    );
  };

  private handleCustomEvent = (e: CustomEvent): void => {
    console.log("EVENTO DISPARADO: Custom Event detectado", e.detail);
  };

  private render(): void {
    if (!this.shadowRoot) return;
    this.shadowRoot.adoptedStyleSheets = [_componenteNameStyle];
    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(_componenteNameTemplate.content.cloneNode(true));
  }
}

// Registro do Componente
if (!customElements.get("wc-componentName")) {
  customElements.define("wc-componentName", __ComponentName__);
}

export default __ComponentName__;

/* 
✋ Não esqueça de importar o componente import "../__ComponentName__.ts"

*/
