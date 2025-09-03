import { createClient } from 'contentful'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { Skeletons } from './lib/model.ts'
import { App } from './components/App.tsx'

const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

if (!accessToken) {
	throw new Error('Please provide CONTENTFUL_ACCESS_TOKEN.')
}

const client = createClient({
	space: 'oxtz1ngn347h',
	accessToken,
})

async function run() {
	const data = await client.getEntries<Skeletons>({limit: 1000})

	let container = document.getElementById("app")!
	let root = createRoot(container)
	root.render(
		<StrictMode>
			<App data={data}/>
		</StrictMode>
	)
}

run()
