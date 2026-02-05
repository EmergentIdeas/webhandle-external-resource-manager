
export default function createImportmapGenerator(webhandle) {
	function importmapGenerator(manager) {

		let imports = {}

		let found = false
		for (let resource of manager.providedResources) {
			if(resource.rendered) {
				continue
			}
			found = true
			let vrsc = ''
			if(!webhandle.development && resource.cachable) {
				vrsc = '/vrsc/' + webhandle.resourceVersion
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