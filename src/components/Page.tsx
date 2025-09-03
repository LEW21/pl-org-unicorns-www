import { Entry, EntryCollection } from 'contentful'
import { Temporal } from 'temporal-polyfill'
import { getContactMethods, getHomeLogo, getIndexLinks, isActivity, isPost, isProject, isStaticPage, pageHref, pagePublishedOn, pageSrc, pageTitle, Skeletons } from '../lib/model.ts'
import * as richtext from '../lib/rich-text.ts'
import { isResolvedAsset, LinkBlock, RichText } from './RichText.tsx'

export function Article({data, article, className}: {
	className?: string
	data: EntryCollection<Skeletons, undefined>
	article: Entry<Skeletons, undefined>
}) {
	const title = pageTitle(article)
	const href = pageHref(article)
	const publishedOn = pagePublishedOn(article)

	return <article className={className}>
		<h1 className="entry-title">{title}</h1>

		{publishedOn ? <>
		<p style={{width: 'auto', color: '#7c7c7c'}}>
			<a href={href} style={{color: 'inherit'}}>{Temporal.PlainDate.from(publishedOn).toLocaleString('pl', {dateStyle: 'long'})}</a>
		</p>
		</> : <></>}

		{
			isStaticPage(article) || isActivity(article) || isPost(article) ? <hr/> :
			<></>
		}
		{
			isActivity(article) ? <img src={isResolvedAsset(article.fields.logo) ? pageSrc(article.fields.logo) : undefined}/> :
			<></>
		}
		{
			isStaticPage(article) ? <RichText text={article.fields.content as richtext.Document<Skeletons>}/> :
			isActivity(article) ? <RichText text={article.fields.description as richtext.Document<Skeletons>}/> :
			isPost(article) ? <RichText text={article.fields.content as richtext.Document<Skeletons>}/> :
			<></>
		}
	</article>
}


export function Page({data, page: page}: {
	data: EntryCollection<Skeletons, undefined>
	page: Entry<Skeletons, undefined>
}) {
	const title = pageTitle(page)

	const posts = (
		isProject(page) ? data.items.flatMap(item => isPost(item) && item.fields.project?.sys.id === page.sys.id ? [item] : []) :
		isActivity(page) ? data.items.flatMap(item => isPost(item) && item.fields.activities?.filter(activity => activity.sys.id === page.sys.id).length > 0 ? [item] : []) :
		page.fields.slug === 'aktualnosci' ? data.items.flatMap(item => isPost(item) ? [item] : []) :
		[]
	).toSorted((a, b) => -Temporal.PlainDate.compare(a.fields.publishedOn, b.fields.publishedOn))

	return <>
		<title>{title?.toLocaleUpperCase('pl')}</title>
		<Article className="primary" data={data} article={page}/>
		{posts.map(post => <Article key={post.sys.id} data={data} article={post}/>).flatMap((el, index) => [el, <hr key={`hr${index}`} className="post-separator" aria-hidden="true"/>])}
	</>
}

export function HomePage({data}: {
	data: EntryCollection<Skeletons, undefined>
}) {
	const homeLogo = getHomeLogo(data)
	const indexLinks = getIndexLinks(data)
	const contactMethods = getContactMethods(data)

	return <article className="primary">
		<title>STOWARZYSZENIE UNICORNS</title>
		<h1 className="entry-title">witaj na stronie</h1>
		<hr/>
		<img src={pageSrc(homeLogo.data.target)} alt="Unicorns"/>
		<hr/>
		<div style={{flexFlow: 'row wrap', justifyContent: 'center'}}>
			{indexLinks.map((linkNode, index) => <LinkBlock key={index} node={linkNode}/>)}
		</div>
		<hr/>
		<div style={{flexFlow: 'row wrap', justifyContent: 'center', gap: '16px'}}>
			{contactMethods.map(contactMethodNode => {
				const {slug, link, smallIcon, color} = contactMethodNode.data.target.fields
				if (isResolvedAsset(smallIcon)) {
					return <a key={slug} href={link} style={{backgroundColor: color ?? '#f0f0f0', borderRadius: '9999px', height: '54px', width: '54px', padding: '10px'}}>
						<img src={pageSrc(smallIcon)}/>
						<span className="screen-reader-text">{slug}</span>
					</a>
				}
			})}
		</div>
	</article>
}
