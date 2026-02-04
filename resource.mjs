
export default class Resource {
	
	/**
	 * The mime type of this resource e.g. application/javascript, text/css
	 */
	mimeType
	
	/**
	 * The URL of the resource
	 */
	url
	
	/**
	 * Other URLs unnecessary if this resource is included
	 */
	satisfies = []
	
	/**
	 * Atributes that may be needed for the html element
	 */
	attributes = []
	
	
	/**
	 * True if this resource can be set as indefinitely cachable in line with
	 * webhandle's resource version scheme
	 */
	cachable = true
	
	/**
	 * True if the resource has been added to the page
	 */
	rendered = false

	constructor(options) {
		Object.assign(this, options)
	}
}