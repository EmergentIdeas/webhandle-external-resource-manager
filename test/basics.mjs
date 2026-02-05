import test from "node:test"
import assert from "node:assert"
import createTextCssRenderer from "../create-css-renderer.mjs"
import createApplicationJavascriptRenderer from "../create-application-javascript-renderer.mjs"
import Resource from "../resource.mjs"
import ExternalResourceManager from "../external-resource-manager.mjs"


let webhandle = {
	development: false
	, resourceVersion: '1234'
}

function getUrls(resources) {
	let urls = [...resources].map(resource => resource.url)
	return urls.join(',')
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

		resource.attributes.defer = ""
		assert.equal(cssRender(resource), '<link href="/css/pages.css" rel="stylesheet" type="img/png" defer=""/>', 'Rendered html did not match')
		
		
		let jsRender = createApplicationJavascriptRenderer(webhandle)
		resource = new Resource()
		
		resource.url = '/js/pages.mjs'
		resource.mimeType = 'application/javascript'
		assert.equal(jsRender(resource), '<script src="/js/pages.mjs" ></script>', 'Rendered html did not match')

		resource.attributes.defer = undefined
		resource.attributes.type = 'module'
		
		assert.equal(jsRender(resource), '<script src="/js/pages.mjs" defer type="module"></script>', 'Rendered html did not match')
		
		webhandle.development = false
		assert.equal(jsRender(resource), '<script src="/vrsc/1234/js/pages.mjs" defer type="module"></script>', 'Rendered html did not match')
		
		
		resource = new Resource({
			url: '/js/pages.mjs'
			, mimeType: 'application/javascript'
			, resourceType: 'module'
		})
		assert.equal(jsRender(resource), '<script src="/vrsc/1234/js/pages.mjs"  type="module"></script>', 'Rendered html did not match')
	})

	webhandle = {
		development: false
		, resourceVersion: '1234'
	}

	await t.test('test including satisfied url', async (t) => {
		let manager = new ExternalResourceManager()
		
		let rOne = new Resource({
			url: '/js/one.js'
		})

		let rTwo = new Resource({
			url: '/js/two.js'
		})
		let rThree = new Resource({
			url: '/js/three.js'
			, satisfies: ['/js/one.js']
		})
		
		let rFour = new Resource({
			url: '/js/four.js'
			, satisfies: ['/js/five.js']
		})

		let rFive = new Resource({
			url: '/js/five.js'
		})
		
		manager.includeResource(rOne)
		assert.equal(getUrls(manager.includedResources), '/js/one.js', 'Rendered html did not match')
		
		
		manager.includeResource(rTwo)
		assert.equal(getUrls(manager.includedResources), '/js/one.js,/js/two.js', 'Rendered html did not match')
		
		manager.includeResource(rThree)
		assert.equal(getUrls(manager.includedResources), '/js/two.js,/js/three.js', 'Rendered html did not match')
		
		
		manager.includeResource(rFour)
		manager.includeResource(rFive)
		assert.equal(getUrls(manager.includedResources), '/js/two.js,/js/three.js,/js/four.js', 'Rendered html did not match')
		
		manager = new ExternalResourceManager()
		manager.includeResource(rFive)
		manager.includeResource(rFour)
		manager.includeResource(rThree)
		manager.includeResource(rTwo)
		manager.includeResource(rOne)
		assert.equal(getUrls(manager.includedResources), '/js/four.js,/js/three.js,/js/two.js', 'Rendered html did not match')

	})
})