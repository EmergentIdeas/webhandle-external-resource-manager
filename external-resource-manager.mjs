
export default class ExternalResourceManager {
	
	includedResources = []
	providedResources = []
	
	/**
	 * Code which can generate html based on all of the entries of the mananger.
	 * Good place form importmap generation or preload generation.
	 */
	preTypeRenderers = []

	/**
	 * Renderers by mime type
	 */
	renderers = {}


	constructor(options) {
		Object.assign(this, options)
	}
	
	includeResource(resource) {

	}
	
	provideResource(resource) {

	}
	
	/**
	 * Adds a piece of code which knows how to turn a resource into html.
	 * @param {string} mimeType 
	 * @param {function} handler Takes a `Resource` object and turns it into a bit of html that can
	 * be included on the page.
	 */
	addTypeHandler(mimeType, handler) {
		this.renderers[mimeType] = handler
	}

	/**
	 * Adds code which will generate html needed before the types are processed individually. Good
	 * place for code which generates importmaps or preload statements. 
	 * @param {function} handler Takes a `ExternalResourceManager` object and turns it into a bit of html that can
	 * be included on the page.
	 */
	addPreTypeRender(handler) {
		this.preTypeRenderers.push(handler)
	}


	
	
}