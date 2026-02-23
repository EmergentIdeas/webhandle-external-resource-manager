import createAttributes from "./create-attributes.mjs"
import escapeAttributeValue from "./escape-attribute-value.mjs"

export default function createApplicationJavascriptRenderer(webhandle) {
	function renderApplicationJS(resource) {

		let vrsc = ''
		if (!webhandle.development && resource.cachable) {
			if (resource.url.startsWith('data:')) {
				// We don't want to prefix a data url
			}
			else {
				vrsc = '/vrsc/' + webhandle.resourceVersion
			}
		}

		let html = `<script src="${vrsc}${escapeAttributeValue(resource.url)}" `

		html += createAttributes(resource.attributes)
		if ('type' in resource.attributes === false && resource.resourceType === 'module') {
			html += ' type="module"'
		}
		html += '></script>'
		return html
	}

	return renderApplicationJS
}