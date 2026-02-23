import test from "node:test"
import assert from "node:assert"
import Resource from "../resource.mjs"
import ExternalResourceManager from "../external-resource-manager.mjs"
import createImportmapGenerator from "../importmap-generator-creator.mjs"


let webhandle = {
	development: false
	, resourceVersion: '1234'
}

test("importmaps", async (t) => {

	await t.test('generate', async (t) => {
		let manager = new ExternalResourceManager()
		let rOne = new Resource({
			url: '/js/one.js'
			, mimeType: 'application/javascript'
			, resourceType: 'module'
			, name: '@webhandle/moduleone'
		})
		manager.provideResource(rOne)
		
		let generator = createImportmapGenerator(webhandle)
		let importMap = generator(manager)
		
		assert.equal(importMap,
`<script type="importmap">
{"imports":{"@webhandle/moduleone":"/vrsc/1234/js/one.js"}}
</script>`
			, 'Text does not match.'
		)
		
		webhandle.development = true	
		importMap = generator(manager)
		assert.equal(importMap,
`<script type="importmap">
{
	"imports": {
		"@webhandle/moduleone": "/js/one.js"
	}
}
</script>`
			, 'Text does not match.'
		)
		
		
		webhandle.development = false
		rOne.url = "data:text/javascript;charset=utf-8;base64,ZXhwb3J0IGRlZmF1bHQgeyJwdWJsaWNGaWxlc1ByZWZpeCI6Ii9Ad2ViaGFuZGxlL21hdGVyaWFsLWljb25zL2ZpbGVzIn0="
		importMap = generator(manager)
		
		assert.equal(importMap,
`<script type="importmap">
{"imports":{"@webhandle/moduleone":"data:text/javascript;charset=utf-8;base64,ZXhwb3J0IGRlZmF1bHQgeyJwdWJsaWNGaWxlc1ByZWZpeCI6Ii9Ad2ViaGFuZGxlL21hdGVyaWFsLWljb25zL2ZpbGVzIn0="}}
</script>`
			, 'Text does not match.'
		)

		delete rOne.url  
		rOne.data = {url: '/something/here'}
		importMap = generator(manager)
		
		assert.equal(importMap,
			'<script type="importmap">\n{"imports":{"@webhandle/moduleone":"data:text/javascript,export default {\\"url\\":\\"/something/here\\"}"}}\n</script>'
			, 'Text does not match.'
		)
	})
})