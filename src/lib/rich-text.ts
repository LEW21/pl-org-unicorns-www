import * as crtt from '@contentful/rich-text-types'
import { Asset, Entry, EntrySkeletonType } from 'contentful'

export * from '@contentful/rich-text-types'

export interface EntryLinkBlock<Skeleton extends EntrySkeletonType> extends crtt.Block {
	nodeType: crtt.BLOCKS.EMBEDDED_ENTRY
	data: {
		//target: types.Link<'Entry'>
		target: Entry<Skeleton, undefined>
	}
	content: []
}

export interface AssetLinkBlock extends crtt.Block {
	nodeType: crtt.BLOCKS.EMBEDDED_ASSET
	data: {
		//target: types.Link<'Asset'>
		target: Asset<undefined>
	}
	content: []
}

export interface EntryLinkInline<Skeleton extends EntrySkeletonType> extends crtt.Inline {
	nodeType: crtt.INLINES.EMBEDDED_ENTRY
	data: {
		//target: types.Link<'Entry'>
		target: Entry<Skeleton, undefined>
	}
	content: []
}

export interface EntryHyperlink<Skeleton extends EntrySkeletonType> extends crtt.Inline {
	nodeType: crtt.INLINES.ENTRY_HYPERLINK
	data: {
		//target: types.Link<'Entry'>
		target: Entry<Skeleton, undefined>
	}
	content: crtt.Text[]
}

export interface AssetHyperlink extends crtt.Inline {
	nodeType: crtt.INLINES.ASSET_HYPERLINK
	data: {
		//target: types.Link<'Asset'>
		target: Asset<undefined>
	}
	content: crtt.Text[]
}

export type TopLevelBlock<Skeleton extends EntrySkeletonType> = crtt.Heading1 | crtt.Heading2 | crtt.Heading3 | crtt.Heading4 | crtt.Heading5 | crtt.Heading6 | crtt.Paragraph | crtt.Quote | crtt.Hr | EntryLinkBlock<Skeleton> | AssetLinkBlock

export type Block<Skeleton extends EntrySkeletonType> = TopLevelBlock<Skeleton>

export type Inline<Skeleton extends EntrySkeletonType> = EntryLinkInline<Skeleton> | EntryHyperlink<Skeleton> | AssetHyperlink | crtt.Hyperlink

export type Node<Skeleton extends EntrySkeletonType> = TopLevelBlock<Skeleton> | Inline<Skeleton> | crtt.Text

export interface Document<Skeleton extends EntrySkeletonType> extends crtt.Document {
	content: TopLevelBlock<Skeleton>[]
}
