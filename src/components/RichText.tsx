import { Asset, UnresolvedLink } from 'contentful'
import { isActivity, isAsset, isContactMethod, pageSrc, pageTitle, Skeletons } from '../lib/model.ts'
import * as richtext from '../lib/rich-text.ts'

export function RichNode({node}: {node: richtext.Node<Skeletons> | richtext.Document<Skeletons>}) {
	return <>
		{
			node.nodeType === 'text' ? <Text node={node}/> :
			node.nodeType === richtext.BLOCKS.DOCUMENT ? <NodeContent node={node}/> :
			node.nodeType === richtext.BLOCKS.HR ? <HR node={node}/> :
			node.nodeType === richtext.BLOCKS.HEADING_1 ? <H1 node={node}/> :
			node.nodeType === richtext.BLOCKS.HEADING_2 ? <H2 node={node}/> :
			node.nodeType === richtext.BLOCKS.HEADING_3 ? <H3 node={node}/> :
			node.nodeType === richtext.BLOCKS.HEADING_4 ? <H4 node={node}/> :
			node.nodeType === richtext.BLOCKS.HEADING_5 ? <H5 node={node}/> :
			node.nodeType === richtext.BLOCKS.HEADING_6 ? <H6 node={node}/> :
			node.nodeType === richtext.BLOCKS.PARAGRAPH ? <Paragraph node={node}/> :
			node.nodeType === richtext.BLOCKS.QUOTE ? <Quote node={node}/> :
			node.nodeType === richtext.BLOCKS.EMBEDDED_ENTRY ? <LinkBlock node={node}/> :
			node.nodeType === richtext.BLOCKS.EMBEDDED_ASSET ? <LinkBlock node={node}/> :
			node.nodeType === richtext.INLINES.EMBEDDED_ENTRY ? <LinkInline node={node}/> :
			node.nodeType === richtext.INLINES.ENTRY_HYPERLINK ? <Hyperlink node={node}/> :
			node.nodeType === richtext.INLINES.ASSET_HYPERLINK ? <Hyperlink node={node}/> :
			node.nodeType === richtext.INLINES.HYPERLINK ? <ExternalHyperlink node={node}/> :
			<UnknownNode node={node}/>
		}
	</>
}

function UnknownNode({node}: {node: richtext.Block<Skeletons> | richtext.Inline<Skeletons>}) {
	console.warn('Unknown node', node)
	return <NodeContent node={node}/>
}

function NodeContent({node}: {node: richtext.Block<Skeletons> | richtext.Inline<Skeletons> | richtext.Document<Skeletons>}) {
	// TODO type node.content
	return <>{node.content?.map((node, index) => <RichNode key={index} node={node as richtext.Node<Skeletons>}/>)}</>
}

function Text({node}: {node: richtext.Text}) {
	const marks = new Set(node.marks.map(mark => mark.type))
	if (marks.has('bold')) {
		return <strong style={{whiteSpace: 'pre-line'}}>{node.value}</strong>
	}
	return <span style={{whiteSpace: 'pre-line'}}>{node.value}</span>
}

export function isResolvedAsset(assetLink: UnresolvedLink<'Asset'> | Asset | undefined): assetLink is Asset {
	return assetLink?.sys.type === 'Asset'
}

export function LinkBlock({node}: {node: richtext.AssetLinkBlock | richtext.EntryLinkBlock<Skeletons>}) {
	const target = node.data.target

	if (isContactMethod(target)) {
		const {link, bigIcon, qrCode} = target.fields
		return <a href={link} target="_blank" style={{alignSelf: 'stretch', display: 'flex', flexFlow: 'row', gap: 'var(--wp--style--unstable-gallery-gap, 16px)'}}>
			{isResolvedAsset(bigIcon) ?
				<img src={pageSrc(bigIcon)} style={{width: 'calc(50% - var(--wp--style--unstable-gallery-gap, 16px)*.5)'}} />
			: <></>}
			{isResolvedAsset(qrCode) ?
				<img src={pageSrc(qrCode)} style={{width: 'calc(50% - var(--wp--style--unstable-gallery-gap, 16px)*.5)'}} />
			: <></>}
		</a>
	}

	const title = pageTitle(target)

	if (isActivity(target)) {
		const {logo} = target.fields
		return <a href={pageSrc(target)}>
			<img src={isResolvedAsset(logo) ? pageSrc(logo) : undefined} alt={title} />
		</a>
	}

	if (isAsset(target) && target.fields.file?.contentType.startsWith('image')) {
		return <img src={pageSrc(target)} alt={title} />
	}

	return <a href={pageSrc(target)} className="entry-title button">{title}</a>
}

function LinkInline({node}: {node: richtext.EntryLinkInline<Skeletons>}) {
	const target = node.data.target
	const title = pageTitle(target)
	const href = pageSrc(target)
	return <a href={href} className="entry-title">{title}</a>
}

function Hyperlink({node}: {node: richtext.EntryHyperlink<Skeletons> | richtext.AssetHyperlink}) {
	const target = node.data.target
	const href = pageSrc(target)
	return <a href={href}><NodeContent node={node}/></a>
}

function ExternalHyperlink({node}: {node: richtext.Hyperlink}) {
	const href = node.data.uri
	return <a href={href}><NodeContent node={node}/></a>
}

function H1({node}: {node: richtext.Heading1}) {
	return <h2><NodeContent node={node}/></h2>
}

function H2({node}: {node: richtext.Heading2}) {
	return <h3><NodeContent node={node}/></h3>
}

function H3({node}: {node: richtext.Heading3}) {
	return <h4><NodeContent node={node}/></h4>
}

function H4({node}: {node: richtext.Heading4}) {
	return <h5><NodeContent node={node}/></h5>
}

function H5({node}: {node: richtext.Heading5}) {
	return <h6><NodeContent node={node}/></h6>
}

function H6({node}: {node: richtext.Heading6}) {
	return <h6><NodeContent node={node}/></h6>
}

function Paragraph({node}: {node: richtext.Paragraph}) {
	return <p><NodeContent node={node}/></p>
}

function Quote({node}: {node: richtext.Quote}) {
	return <blockquote><NodeContent node={node}/></blockquote>
}

export function HR({}: {node?: richtext.Hr}) {
	return <hr/>
}

export function RichText({text}: {text: richtext.Document<Skeletons>}) {
	return <RichNode node={text}/>
}
