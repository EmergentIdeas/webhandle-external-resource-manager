# @webhandle/external-resource-manager

Coordinates which external resources like scripts and css get put on
a page.

## Install

```bash
npm install @webhandle/external-resource-manager
```

## Purpose

Integrating components written by different people at different times is messy.

One approach is the one Wordpress uses: every component includes its own css files
and scripts and there's a dependency system to make sure dependencies get loaded and
get loaded before the dependents. This is kinda complicated and results in every page
having a million little files that the browser has to fetch.

Another approach is to use Webpack or Browserify to compile all the small files into
one larger file, and just have the page load that. This also works, but now the complication
is that you have to figure out all of the files to be compiled and if a compoment adds a
file, now the page is broken.

External Resource Manager represents a third approach, allowing the component flexibility
to include what it wants and the ability to combine files for performance.

## Usage

The two main setup functions are:

```js
externalResourceManager.includeResource({
	mimeType: type
	, url: url
})
```

and 

```js
externalResourceManager.provideResource({
	mimeType: type
	, url: url
	, name: name
	, resourceType: subType
})
```

`includeResource` is a directive to include a resource in the page. It will result in a
`link` element or `script` element or whatever is appropriate for its type.

`provideResource` lets components state that a resource is available for use, if somebody
wants to use it. It does not necessarily result in anything getting loaded by the browser.

Components all given a chance to call these function with middleware that they add to the
express routers.

Later, when html for the page is being created, `externalResourceManager.render()` can be
called, which creates html to include the resource. It's safe to call `render` multiple 
times because subsequent calls will only create html for resources added since the last call
to `render`. This means templates themselves can include resesources on the page, so long
as those resources can tolerate being included in the body.

To specify the additional attributes that are sometimes used with elements, you can call like:

```js
externalResourceManager.includeResource({
	mimeType: 'application/javascript'
	, url: '/js/pages.mjs'
	, attributes: {
		defer: undefined
	}
	, cachable: false
})
```

Any attribute with a `null` or `undefined` value will/should be rendered to the page as an
attribute without a value like:

```html
<script src="/js/pages.mjs" defer ></script>
```

As you can see in the example above, resources may also have a `cachable` attribute, which is
true by default. Whether or not this resource ever actually has cache headers or version
url parameters applied to it depends on the renderers being used. The attribute just signifies
this resource is eligible to be used with whatever caching mechanism the site is using and isn't
some sort of url which resolves to dynamic code and only looks like a file URL.

## How does this help with dependencies?

`ExternalResourceManager` guarantees that it will not include a url twice, so any component
is free to explicitly add a resource or call a function from the dependency which adds a
resource without fear that it will be included multiple times. Resources are rendered in the
order added, so as long as a component includes its dependencies first, everything should work
out. This avoids having named resources and a dependency tree at the small cost of having code
which should understand its dependencies call a function on them.

Further, `ExternalResourceManager` makes use of javascript modules and importmap scripts. This
allows a component to provide functionality to the page which will get loaded ONLY if it's needed.
To provide a module to a page, we call like:

```js
externalResourceManager.provideResource({
	url: '/js/one.js'
	, mimeType: 'application/javascript'
	, resourceType: 'module'
	, name: '@webhandle/moduleone'
})
```

This will produce an entry in an importmap so that any javascript which makes a call like:

```js
import myImportantFunction from "@webhandle/moduleone"
```
will cause the browser to load the module from the server. In this way you can add substantial
libraries of modules to the page with a performance hit since they're only loaded at need.
Additionally, because the importmap is parsed by the browser before any of the modules are actually
loaded, it doesn't matter what order the modules are added via `provideResource`.

A note: at the time of this writing, Firefox does not support multiple importmaps, so if possible,
components which provide resources should try to do so before rendering starts. Since providing a
resource does not result in any extra requests to the server, this should be safe to do in middle
for any request which might even potentially make use of the component.

## How does this get rid of the million requests problem?

Inlcuded resources are able to say that they "satisfy" other included URLs. For instance, let's say
individual components have included css files that they need.

```js
externalResourceManager.includeResource({
	mimeType: 'text/css'
	, url: '/small/package/level.css'
})

externalResourceManager.includeResource({
	mimeType: 'text/css'
	, url: '/small/package/level-too.css'
})
```
We can at any time, either before those components include their resources or after, have code
like the following:

```js
externalResourceManager.includeResource({
	mimeType: 'text/css'
	, url: '/css/compiled.css'
	, satisfies: [
		'/small/package/level.css'
		, '/small/package/level-too.css'
	]
})
```

This will cause `/css/compiled.css` to get included on the page while `/small/package/level.css`
and `/small/package/level-too.css` will not.

This is "satisfies" instead of "contains" because `/css/compiled.css` may not actually have the
code from `level.css` in it at all. However, it claims to be functionally equivalent. This lets
us replace styles we don't like with styles we do like, as well as just bundling thing up for 
performance reasons.

This works so long as all these call are made before `render` is called.

In this way, we can get the best of both worlds for very little cost. We can add a new component
to the site and just have it work. After adding too many new components, we can set up builds to 
combine those small files and just have those loaded (and not even have to worry about trying to
tell the component not to load its resources). And when we add a new component, no problem,
this small dependencies will get added to the page until we include them in the build.


## Usage in Webhandle

In Webhandle, every response has its own `ExternalResourceManager` at `res.locals.externalResourceManager`

That's kind of a weird place to put it, I know, but this allows any template to include a resource
and allows any template to call `render`.

### Resource Type Support

Currently there's code to include mime types `application/javascript` and `text/css`. There's also
code to create an importmap based on mime type `application/javascript` with resource type `module`.
`ExternalResourceManager` works internally by having code registered to handle different mime types,
so extensability is really easy if you wanted to add `meta` element or `title` element handling
(or something).

### Data URLs

It's also possible to pass data as part of the provided resource. This is good if you need a configuration
for the javascript on the page. Be careful with this though because it can result in some really big pages.

```js
externalResourceManager.provideResource({
	mimeType: 'application/javascript'
	, resourceType: 'module'
	, name: '@webhandle/moduleone/configuration'
	, data: {url: '/something/here'}
})
```
It results in an importmap entry like:

```
"@webhandle/module-one/configuration":"data:text/javascript,export default {\"url\":\"/something/here\"}"
```




### Integration

As you'd expect, this can be integrated into webhandle by calling:

```js
import setup from "@webhandle/external-resource-manager/initialize-webhandle-component.mjs"
await setup(myWebhandleInstance, options)
```




