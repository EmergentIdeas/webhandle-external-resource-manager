import createInitializeWebhandleComponent from "@webhandle/initialize-webhandle-component/create-initialize-webhandle-component.mjs"
import ComponentManager from "@webhandle/initialize-webhandle-component/component-manager.mjs"
import path from "node:path"
import ExternalResourceManager from "./external-resource-manager.mjs"
import createImportmapGenerator from "./importmap-generator-creator.mjs"
import createTextCssRenderer from "./create-css-renderer.mjs"
import createApplicationJavascriptRenderer from "./create-application-javascript-renderer.mjs"

let initializeWebhandleComponent = createInitializeWebhandleComponent()

initializeWebhandleComponent.componentName = 'externalResourceManager'
initializeWebhandleComponent.componentDir = import.meta.dirname
initializeWebhandleComponent.defaultConfig = {}
initializeWebhandleComponent.staticFilePaths = ['public']
initializeWebhandleComponent.templatePaths = ['views']

initializeWebhandleComponent.setup = async function (webhandle, config) {
	let compmanager = new ComponentManager()

	let generator = createImportmapGenerator(webhandle)
	let cssRender = createTextCssRenderer(webhandle)
	let jsRender = createApplicationJavascriptRenderer(webhandle)

	webhandle.routers.preParmParse.use((req, res, next) => {
		let externalResourceManager = new ExternalResourceManager()

		externalResourceManager.preTypeRenderers.push(generator)
		externalResourceManager.renderers['text/css'] = cssRender
		externalResourceManager.renderers['application/javascript'] = jsRender

		res.locals.externalResourceManager = externalResourceManager

		next()
	})

	compmanager.handlers = {
		generator, cssRender, jsRender
	}
	return compmanager
}

export default initializeWebhandleComponent
