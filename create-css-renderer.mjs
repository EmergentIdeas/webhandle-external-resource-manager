import createAttributes from "./create-attributes.mjs"
export default function createTextCssRenderer(webhandle) {
	function renderTextCss(resource) {
		
		let vrsc = ''
		if(!webhandle.development && resource.cachable) {
			vrsc = '/vrsc/' + webhandle.resourceVersion
		}
		
		let html = `<link href="${vrsc}${resource.url}" rel="stylesheet" `

		html += createAttributes(resource.attributes)
		html += '/>'
		return html
	}

	return renderTextCss
}