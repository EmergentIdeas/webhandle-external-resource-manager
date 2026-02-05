import test from "node:test"
import assert from "node:assert"
import Resource from "../resource.mjs"
import ExternalResourceManager from "../external-resource-manager.mjs"
import createImportmapGenerator from "../importmap-generator-creator.mjs"
import createTextCssRenderer from "../create-css-renderer.mjs"
import createApplicationJavascriptRenderer from "../create-application-javascript-renderer.mjs"


let webhandle = {
	development: false
	, resourceVersion: '1234'
}

let generator = createImportmapGenerator(webhandle)
let cssRender = createTextCssRenderer(webhandle)
let jsRender = createApplicationJavascriptRenderer(webhandle)

test("the render function", async (t) => {

	await t.test('generate', async (t) => {
		let manager = new ExternalResourceManager()
		manager.preTypeRenderers.push(generator)
		manager.renderers['text/css'] = cssRender
		manager.renderers['application/javascript'] = jsRender

		let rOne = new Resource({
			url: '/js/one.js'
			, mimeType: 'application/javascript'
			, resourceType: 'module'
			, name: '@webhandle/moduleone'
		})
		manager.provideResource(rOne)
		

		
		let js = new Resource({
			mimeType: 'application/javascript'
			, url: '/js/one.js'
		})
		
		let css = new Resource({
			mimeType: 'text/css'
			, url: '/css/one.css'
		})
		
		let css2 = new Resource()

		manager.includeResource(js)
		manager.includeResource(css)
let expected =
`<script type="importmap">
{"imports":{"@webhandle/moduleone":"/vrsc/1234/js/one.js"}}
</script>
<script src="/vrsc/1234/js/one.js" ></script>
<link href="/vrsc/1234/css/one.css" rel="stylesheet" />
`		
		assert.equal(manager.render(), expected, 'Rendered html did not match')

		assert.equal(manager.render(), '\n', 'Rendered html did not match')
		
		manager.includeResource({
			mimeType: 'text/css'
			, url: '/css/two.css'
		})
expected =
`
<link href="/vrsc/1234/css/two.css" rel="stylesheet" />
`
		assert.equal(manager.render(), expected, 'Rendered html did not match')
	})
	await t.test('multiple resources, same url', async (t) => {
		let manager = new ExternalResourceManager()
		manager.preTypeRenderers.push(generator)
		manager.renderers['text/css'] = cssRender
		manager.renderers['application/javascript'] = jsRender
		
		let rOne = new Resource({
			mimeType: 'text/css'
			, url: '/js/one.js'
		})

		let rTwo = new Resource({
			mimeType: 'text/css'
			, url: '/js/one.js'
		})
		manager.includeResource(rOne)
		manager.includeResource(rTwo)
		
		let expected =
`
<link href="/vrsc/1234/js/one.js" rel="stylesheet" />
`
		let actual = manager.render()
		assert.equal(actual, expected, 'Rendered html did not match')
	})
})