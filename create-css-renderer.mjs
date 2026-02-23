import createAttributes from "./create-attributes.mjs"
import escapeAttributeValue from "./escape-attribute-value.mjs"
export default function createTextCssRenderer(webhandle) {
	function renderTextCss(resource) {

		let vrsc = ''
		if (!webhandle.development && resource.cachable) {
			if (resource.url.startsWith('data:')) {
				// We don't want to prefix a data url
			}
			else {
				vrsc = '/vrsc/' + webhandle.resourceVersion
			}
		}

		let html = `<link href="${vrsc}${escapeAttributeValue(resource.url)}" rel="stylesheet" `

		html += createAttributes(resource.attributes)
		html += '/>'
		return html
	}

	return renderTextCss
}