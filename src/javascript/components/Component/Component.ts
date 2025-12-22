import componente__Template from "./ComponentTemplate.ts";
import CSS from "./component.css?inline";

const ComponentNameCSS = new CSSStyleSheet();
ComponentNameCSS.replaceSync(CSS);
/**
 * Interface para definir a estrutura de props ou estado se necessário
 * interface ComponenteProps {
 * titulo?: string;
 * }
 */

class ComponentName extends HTMLElement {
	// 1. Definição dos atributos observados
	static get observedAttributes(): string[] {
		return ["titulo"];
	}

	// Elementos internos do ShadowDOM (Cache/Seletores)
	#msgElement!: HTMLSpanElement;
	#btnElement!: HTMLButtonElement;

	constructor() {
		super();
		// Cria o Shadow DOM
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
	attributeChangedCallback(
		name: string,
		oldValue: string,
		newValue: string,
	): void {
		if (oldValue === newValue) return;

		console.log(
			`[Lifecycle] Atributo '${name}' mudou de '${oldValue}' para '${newValue}'`,
		);

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

	/**
	 * Padrão de Captura de Elementos
	 * Armazena referências para evitar querySelector repetitivo
	 */

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

	// ... (seu código inicial permanece igual)

	private cacheDomElements(): void {
		this.#msgElement = this.getElement<HTMLSpanElement>("span");
		this.#btnElement = this.getElement<HTMLButtonElement>("#action-btn");
	} // <--- Esta chave estava fechando a CLASSE antes, agora fecha só o método.

	/**
	 * Gerenciamento de Listeners
	 */
	private addEventListeners(): void {
		this.#btnElement.addEventListener("click", this.handleButtonClick);

		this.addEventListener(
			"custom-event",
			this.handleCustomEvent as EventListener,
		);
	}

	private removeEventListeners(): void {
		this.#btnElement?.removeEventListener("click", this.handleButtonClick);
		this.removeEventListener(
			"custom-event",
			this.handleCustomEvent as EventListener,
		);
	}

	private handleButtonClick = (e: MouseEvent): void => {
		const agora = new Date();
		const horaFormatada = `${agora.toLocaleTimeString("pt-BR", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		})}hs`;

		this.#msgElement.innerText = `EVENTO DISPARADO: TIPO CLICK ${horaFormatada}`;
		console.log(e);

		this.dispatchEvent(
			new CustomEvent("custom-event", {
				bubbles: true,
				composed: true,
				detail: { origin: "click interno" },
			}),
		);
	};

	private handleCustomEvent = (e: CustomEvent): void => {
		console.log("EVENTO DISPARADO: Custom Event detectado", e.detail);
	};

	private render(): void {
		if (!this.shadowRoot) return;
		this.shadowRoot.adoptedStyleSheets = [ComponentNameCSS];
		// Limpa antes de renderizar para não duplicar conteúdo
		this.shadowRoot.innerHTML = "";
		this.shadowRoot.appendChild(componente__Template.content.cloneNode(true));
	}
}

// Registro do Componente
if (!customElements.get("wc-component")) {
	customElements.define("wc-component", ComponentName);
}

export default ComponentName;
