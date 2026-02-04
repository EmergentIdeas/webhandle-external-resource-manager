import createInitializeWebhandleComponent from "@webhandle/initialize-webhandle-component/create-initialize-webhandle-component.mjs"
import ComponentManager from "@webhandle/initialize-webhandle-component/component-manager.mjs"
import path from "node:path"

let initializeWebhandleComponent = createInitializeWebhandleComponent()

initializeWebhandleComponent.componentName = 'externalResourceManager'
initializeWebhandleComponent.componentDir = import.meta.dirname
initializeWebhandleComponent.defaultConfig = {}
initializeWebhandleComponent.staticFilePaths = ['public']
initializeWebhandleComponent.templatePaths = ['views']

initializeWebhandleComponent.setup = async function(webhandle, config) {
	let manager = new ComponentManager()
	
	// for(let filePath of initializeWebhandleComponent.staticFilePaths) {
	// 	manager.staticPaths.push(webhandle.addStaticDir(path.join(initializeWebhandleComponent.componentDir, filePath)))
	// }
	
	// for(let templatePath of initializeWebhandleComponent.templatePaths) {
	// 	webhandle.addTemplateDir(path.join(initializeWebhandleComponent.componentDir, templatePath))
	// }

	return manager
}

export default initializeWebhandleComponent
