
export default function createImportmapGenerator(webhandle) {
	function importmapGenerator(manager) {

		let imports = {}

		let found = false
		for (let resource of manager.providedResources) {
			if(resource.rendered) {
				continue
			}
			found = true
			
			if(resource.data && !resource.url) {
				let content = `export default ${JSON.stringify(resource.data)}`
				let url = `data:text/javascript,${content}`
				resource.url = url
			}
			
			let vrsc = ''
			if(!webhandle.development && resource.cachable) {
				if(resource.url && resource.url.startsWith('data:')) {
					// We don't want to prefix a data url
				}
				else {
					vrsc = '/vrsc/' + webhandle.resourceVersion
				}
			}
			if (resource.mimeType === 'application/javascript' && resource.resourceType === 'module') {
				imports[resource.name] = vrsc + resource.url
			}
		}

		let data = {
			imports
		}
		
		let dataText = webhandle.development ? JSON.stringify(data, null, '\t') : JSON.stringify(data)

		let template = found ?
`<script type="importmap">
${dataText}
</script>` : ''
		return template
	}

	return importmapGenerator
}