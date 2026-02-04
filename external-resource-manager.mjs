
export default class ExternalResourceManager {
	
	includedResources = []
	providedResources = []
	
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
	
	
}