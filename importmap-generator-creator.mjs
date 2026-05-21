
export default function createImportmapGenerator(webhandle) {
	function importmapGenerator(manager) {

		let imports = {}

		let found = false
		for (let resource of manager.providedResources) {
			if(resource.rendered) {
				continue
			}
			
			if(manager.alreadyProvidedNames.has('module:' + resource.name)) {
				resource.rendered = true
				continue
			}

			found = true
			if(resource.data && !resource.url) {
				let d = JSON.stringify(resource.data)
				// # in the value trigger a problem in the browser where it doesn't think #
				// are valid for the types of URLs it's looking for. That's a little weird
				// given that this is a data url. It's possible these values should be 
				// fully URI encoded, but other values which would normally need that
				// don't seem to cause problems.
				d = d.split('#').join('%23')
				let content = `export default ${d}`
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
				manager.alreadyProvidedNames.add('module:' + resource.name)
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