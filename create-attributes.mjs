import escapeAttributeValue from "./escape-attribute-value.mjs"

/**
 * Creates an html attributes string based on the members of an object
 * @param {object} attributes 
 */
export default function createAttributes(attributes) {
	let html = Object.entries(attributes).map(entries => {
		if (entries[1] === null || entries[1] === undefined) {
			return entries[0]
		}
		else {
			return entries[0] + '="' + escapeAttributeValue(entries[1]) + '"'
		}
	}).join(' ')
	return html
}