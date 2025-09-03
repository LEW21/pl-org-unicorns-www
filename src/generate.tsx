import { createClient, EntryCollection } from 'contentful'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { App } from './components/App.tsx'
import { pageHref, Skeletons } from './lib/model.ts'

const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

if (!accessToken) {
	throw new Error('Please provide CONTENTFUL_ACCESS_TOKEN.')
}

const client = createClient({
	space: 'oxtz1ngn347h',
	accessToken,
})

function HTML({data, path}: {
	data: EntryCollection<Skeletons, undefined>
	path?: string
}) {
	return <html lang="pl">
		<head>
			<meta charSet="utf-8"/>
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<link rel="stylesheet" href="/static/unicorns.scss"/>
			<script type="module" src="/static/unicorns.ts"></script>
		</head>
		<body>
			<div id="top"></div>
			<div id="app">
				<App data={data} path={path}/>
			</div>
		</body>
	</html>
}

async function run({fetchAssets}: {fetchAssets?: boolean} = {}) {
	const data = await client.getEntries<Skeletons>({limit: 1000})

	if (fetchAssets) {
		for (const asset of data.includes?.Asset ?? []) {
			if (asset.fields.file?.url) {
				const path = pageHref(asset)!
				await mkdir(`./generated/${dirname(path)}`, {recursive: true})
				console.log(path)
				const file = await (await fetch('https:' + asset.fields.file.url)).blob()
				await writeFile(`./generated/${path}`, Buffer.from(await file.arrayBuffer()))
			}
		}
	}

	for (const path of [
		'/',
		...data.items.flatMap(item => pageHref(item) ? [pageHref(item)!] : [])
	]) {
		console.log(path)
		await mkdir(`./generated/${path}`, {recursive: true})
		await writeFile(`./generated/${path}/index.html`, renderToStaticMarkup(<HTML data={data} path={path}/>))
	}
}

await run({fetchAssets: true})
