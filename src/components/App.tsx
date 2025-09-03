import { Entry, EntryCollection } from 'contentful'
import { pageHref, Skeletons } from '../lib/model.ts'
import { HomePage, Page } from './Page.tsx'
import { SiteFooter, SiteHeader } from './Site.tsx'

export function Main({data, path}: {
	data: EntryCollection<Skeletons, undefined>
	path: string
}) {
	const pages = new Map<string, Entry<Skeletons, undefined>>([
		...data.items.flatMap(item => pageHref(item) ? [[pageHref(item)!, item] as const] : []),
	])
	const item = pages.get(path)

	return <main>
		{path == '/' ? <HomePage data={data}/> : item ? <Page data={data} page={item}/> : <></>}
	</main>
}

export function App({data, path}: {
	data: EntryCollection<Skeletons, undefined>
	path?: string
}) {
	return <>
		<SiteHeader data={data}/>
		<Main data={data} path={path ?? location.pathname}/>
		<SiteFooter/>
	</>
}
