import { Asset, Entry, EntryCollection, EntryFieldTypes } from 'contentful'
import * as richtext from './rich-text.ts'

export function isAsset(val: Entry<Skeletons, undefined> | Asset): val is Asset {
	return val.sys.type === 'Asset'
}

export interface StaticPageSkeleton {
	contentTypeId: 'staticPage'
	fields: {
		title: EntryFieldTypes.Text
		slug: EntryFieldTypes.Text
		content: EntryFieldTypes.RichText
	}
}

export function isStaticPage(val: Entry<Skeletons, undefined> | Asset): val is Entry<StaticPageSkeleton, undefined> {
	return val.sys.type === 'Entry' && val.sys.contentType.sys.id === 'staticPage'
}

export interface AllNewsPageSkeleton {
	contentTypeId: 'allNewsPage'
	fields: {
		title: EntryFieldTypes.Text
		slug: EntryFieldTypes.Text
	}
}

export function isAllNewsPage(val: Entry<Skeletons, undefined> | Asset): val is Entry<AllNewsPageSkeleton, undefined> {
	return val.sys.type === 'Entry' && val.sys.contentType.sys.id === 'allNewsPage'
}

export interface ActivitySkeleton {
	contentTypeId: 'activity'
	fields: {
		name: EntryFieldTypes.Text
		slug: EntryFieldTypes.Text
		logo: EntryFieldTypes.AssetLink
		description: EntryFieldTypes.RichText
	}
}

export function isProject(val: Entry<Skeletons, undefined> | Asset): val is Entry<ProjectSkeleton, undefined> {
	return val.sys.type === 'Entry' && val.sys.contentType.sys.id === 'project'
}

export interface ProjectSkeleton {
	contentTypeId: 'project'
	fields: {
		name: EntryFieldTypes.Text
		slug: EntryFieldTypes.Text
	}
}

export function isActivity(val: Entry<Skeletons, undefined> | Asset): val is Entry<ActivitySkeleton, undefined> {
	return val.sys.type === 'Entry' && val.sys.contentType.sys.id === 'activity'
}

export interface ContactMethodSkeleton {
	contentTypeId: 'contactMethod'
	fields: {
		slug: EntryFieldTypes.Text
		smallIcon: EntryFieldTypes.AssetLink
		bigIcon: EntryFieldTypes.AssetLink
		qrCode: EntryFieldTypes.AssetLink
		link: EntryFieldTypes.Text
		color: EntryFieldTypes.Text
	}
}

export function isContactMethod(val: Entry<Skeletons, undefined> | Asset): val is Entry<ContactMethodSkeleton, undefined> {
	return val.sys.type === 'Entry' && val.sys.contentType.sys.id === 'contactMethod'
}

export interface PostSkeleton {
	contentTypeId: 'post'
	fields: {
		title: EntryFieldTypes.Text
		slug: EntryFieldTypes.Text
		publishedOn: EntryFieldTypes.Date
		project: EntryFieldTypes.EntryLink<ProjectSkeleton>
		activities: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<ActivitySkeleton>>
		content: EntryFieldTypes.RichText
	}
}

export function isPost(val: Entry<Skeletons, undefined> | Asset): val is Entry<PostSkeleton, undefined> {
	return val.sys.type === 'Entry' && val.sys.contentType.sys.id === 'post'
}

export type Skeletons = ActivitySkeleton | ProjectSkeleton | StaticPageSkeleton | AllNewsPageSkeleton | ContactMethodSkeleton | PostSkeleton

export function pageTitle(entry: Entry<Skeletons, undefined> | Asset<undefined>) {
	return (
		isActivity(entry) ? entry.fields.name :
		isProject(entry) ? entry.fields.name :
		isStaticPage(entry) ? entry.fields.title :
		isAllNewsPage(entry) ? entry.fields.title :
		isAsset(entry) ? entry.fields.title :
		isPost(entry) ? entry.fields.title :
		undefined
	)
}

const USE_LOCAL_ASSETS = Object.entries(process.env).length ? true : false

export function pageHref(entry: Entry<Skeletons, undefined> | Asset<undefined>) {
	return (
		isActivity(entry) ? `/${entry.fields.slug}/` :
		isProject(entry) ? `/category/${entry.fields.slug}/` :
		isStaticPage(entry) ? `/${entry.fields.slug}/` :
		isAllNewsPage(entry) ? `/category/${entry.fields.slug}/` :
		isAsset(entry) ? (USE_LOCAL_ASSETS ? `/assets/${entry.sys.id}/${entry.fields.file?.fileName}` : entry.fields.file?.url) :
		isPost(entry) ? `/${entry.fields.slug}/` :
		undefined
	)
}

export function pageSrc(entry: Entry<Skeletons, undefined> | Asset<undefined>) {
	const href = pageHref(entry)
	if (href?.startsWith('/assets/')) {
		return `/generated${href}`
	}
	return href
}

export function pagePublishedOn(entry: Entry<Skeletons, undefined> | Asset<undefined>) {
	return (
		isPost(entry) ? entry.fields.publishedOn :
		undefined
	)
}

export function getHomeLogo(data: EntryCollection<Skeletons, undefined>) {
	const index = data.items.filter(item => item.fields.slug === 'indeks')[0] as Entry<StaticPageSkeleton, undefined>
	const logos = (index.fields.content as richtext.Document<Skeletons>).content.filter(node => node.nodeType === richtext.BLOCKS.EMBEDDED_ASSET)
	return logos[0]!
}

export function getIndexLinks(data: EntryCollection<Skeletons, undefined>) {
	const index = data.items.filter(item => item.fields.slug === 'indeks')[0] as Entry<StaticPageSkeleton, undefined>
	const links = (index.fields.content as richtext.Document<Skeletons>).content.filter(node => node.nodeType === richtext.BLOCKS.EMBEDDED_ENTRY)
	return links
}

export function getActivityLinks(data: EntryCollection<Skeletons, undefined>) {
	const index = data.items.filter(item => item.fields.slug === 'nasze-aktywnosci')[0] as Entry<StaticPageSkeleton, undefined>
	const links = (index.fields.content as richtext.Document<Skeletons>).content.filter(node => node.nodeType === richtext.BLOCKS.EMBEDDED_ENTRY)
	return links
}

export function getProjectLinks(data: EntryCollection<Skeletons, undefined>) {
	const index = data.items.filter(item => item.fields.slug === 'nasze-projekty')[0] as Entry<StaticPageSkeleton, undefined>
	const links = (index.fields.content as richtext.Document<Skeletons>).content.filter(node => node.nodeType === richtext.BLOCKS.EMBEDDED_ENTRY)
	return links
}

export function getContactMethods(data: EntryCollection<Skeletons, undefined>) {
	const contact = data.items.filter(item => item.fields.slug === 'kontakt-2')[0] as Entry<StaticPageSkeleton, undefined>
	const contactMethods = (contact.fields.content as richtext.Document<ContactMethodSkeleton>).content.filter(node => node.nodeType === richtext.BLOCKS.EMBEDDED_ENTRY)
	return contactMethods
}
