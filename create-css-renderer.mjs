/** import "./resource.mjs" */

export default function createTextCssRenderer(webhandle) {
	function renderTextCss(resource) {
		
		let vrsc = ''
		if(!webhandle.development && resource.cachable) {
			vrsc = '/vrsc/' + webhandle.resourceVersion
		}
		
		let html = `<link href="${vrsc}${resource.url}" rel="stylesheet" `

		html += Object.entries(resource.attributes).map(entries => {
			return entries[0] + '="' + entries[1] + '"'
		}).join(' ')

		html += '/>'
		return html
	}

	return renderTextCss
}