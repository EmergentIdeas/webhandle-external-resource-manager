import Resource from "./resource.mjs"

export default class ExternalResourceManager {
	
	/**
	 * Resources for which we have a directive to include on the page
	 */
	includedResources = new Set()
	
	/**
	 * Resources which are available to provide content
	 */
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

	/**
	 * The set of urls which are known to have been satisfied by some other resource
	 */
	alreadySatisfied = new Set()
	
	/**
	 * Resources that we were directed to include, but are not going to, because
	 * some other resource satisfies the url.
	 */
	differentlySatisfiedResource = []
	
	/**
	 * To make sure we don't render a resource to the page twice, we'll keep track
	 * of the URLs we've already rendered here.
	 */
	alreadyRenderedUrls = new Set()

	constructor(options) {
		Object.assign(this, options)
	}
	
	
	_noteSatisfies(resource) {
		if(resource.satisfies && Array.isArray(resource.satisfies)) {
			for(let url of resource.satisfies) {
				this.alreadySatisfied.add(url)
			}
		}
	}
	
	includeResource(resource) {
		if(!resource) {
			return
		}
		if(typeof resource === 'object' && resource instanceof Resource === false) {
			resource = new Resource(resource)
		}
		this._noteSatisfies(resource)
		if(this.alreadySatisfied.has(resource.url)) {
			// We've already got a resource which satisfies this url
			this.differentlySatisfiedResource.push(resource)
			return
		}
		if(resource.satisfies && Array.isArray(resource.satisfies)) {
			// We're going to remove any previously included resource which is satisfied
			// by this resource
			for(let included of this.includedResources) {
				if(resource.satisfies.includes(included.url)) {
					this.includedResources.delete(included)
					this.differentlySatisfiedResource.push(resource)
				}
			}
			this._noteSatisfies(resource)
		}
		this.includedResources.add(resource)
	}
	
	provideResource(resource) {
		this.providedResources.push(resource)
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

	render() {
		let result = ''
		for(let renderer of this.preTypeRenderers) {
			result += renderer(this)
		}

		for(let resource of this.includedResources) {
			if(this.alreadyRenderedUrls.has(resource.url) || this.alreadySatisfied.has(resource.url)) {
				// A late in the game catch to make sure we don't output to the page a url that has
				// already been used or a url which we know gets satisfied elsewhere
				resource.rendered = true
				continue
			}
			let renderer = this.renderers[resource.mimeType]
			if(renderer && !resource.rendered) {
				result += '\n'
				result += renderer(resource)	
				resource.rendered = true
			}
			this.alreadyRenderedUrls.add(resource.url)
		}
		
		result += '\n'
		for(let provided of this.providedResources) {
			provided.rendered = true
		}
		
		return result
	}
	
	
}