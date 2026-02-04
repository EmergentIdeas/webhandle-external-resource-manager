import test from "node:test"
import assert from "node:assert"
import createTextCssRenderer from "../create-css-renderer.mjs"
import Resource from "../resource.mjs"


let webhandle = {
	development: false
	, resourceVersion: '1234'
}


test("basic tests", async (t) => {

	await t.test('test renderers', async (t) => {
		let cssRender = createTextCssRenderer(webhandle)
		
		let resource = new Resource()
		
		resource.url = '/css/pages.css'
		resource.mimeType = 'text/css'
		
		assert.equal(cssRender(resource), '<link href="/vrsc/1234/css/pages.css" rel="stylesheet" />', 'Rendered html did not match')
		
		resource.cachable = false
		assert.equal(cssRender(resource), '<link href="/css/pages.css" rel="stylesheet" />', 'Rendered html did not match')

		resource.cachable = true
		webhandle.development = true
		assert.equal(cssRender(resource), '<link href="/css/pages.css" rel="stylesheet" />', 'Rendered html did not match')

		resource.attributes.type = 'img/png'
		assert.equal(cssRender(resource), '<link href="/css/pages.css" rel="stylesheet" type="img/png"/>', 'Rendered html did not match')

		resource.attributes.defer = null
		assert.equal(cssRender(resource), '<link href="/css/pages.css" rel="stylesheet" type="img/png" defer/>', 'Rendered html did not match')

		resource.attributes.defer = undefined
		assert.equal(cssRender(resource), '<link href="/css/pages.css" rel="stylesheet" type="img/png" defer/>', 'Rendered html did not match')
	})
})