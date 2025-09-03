import { EntryCollection } from 'contentful'
import { getActivityLinks, getIndexLinks, getProjectLinks, pageHref, pageTitle, Skeletons } from '../lib/model.ts'

export function SiteHeader({data}: {
	data: EntryCollection<Skeletons, undefined>
}) {
	const indexLinks = getIndexLinks(data)
	const activities = getActivityLinks(data)
	const projects = getProjectLinks(data)

	return <>
		<header id="site-header">
			<div>
				<div className="site-title-group">
					<a className="site-title" href="/" rel="home">STOWARZYSZENIE UNICORNS</a>
					<div className="site-description">SPORT | KULTURA | ROZRYWKA</div>
				</div>

				{/* @ts-ignore */}
				<button command="--toggle" commandfor="site-header">
					<span className="screen-reader-text">Menu</span>
					<svg className="open" width="24" height="24" viewBox="0 0 24 24">
						<path d="M4 18L20 18"/>
						<path d="M4 12L20 12"/>
						<path d="M4 6L20 6"/>
					</svg>
					<svg className="close" width="24" height="24" viewBox="0 0 24 24">
						<path d="M20 4L4 20M4 4L20 20"/>
					</svg>
				</button>

				<nav id="site-nav">
					<ul>
						<li>
							<div className="ancestor-wrapper">
								<a href="/" className="entry-title">witaj na stronie</a>
							</div>
						</li>
						{indexLinks.map(link => {
							const target = link.data.target
							const children =
								target.fields.slug === 'nasze-aktywnosci' ? activities :
								target.fields.slug === 'nasze-projekty' ? projects :
								undefined
							return <li key={pageHref(target)} id={`site-nav-${target.fields.slug}`}>
								<div className="ancestor-wrapper">
									<a href={pageHref(target)} className="entry-title">{pageTitle(target)}</a>
									{children ?
										/* @ts-ignore */
										<button command="--toggle" commandfor={`site-nav-${target.fields.slug}`}>
											<span className="screen-reader-text">Rozwiń</span>
											<svg width="24" height="24" viewBox="0 0 24 24">
												<path d="M18 8L12.2278 14.7343C12.108 14.8739 11.892 14.8739 11.7722 14.7343L6 8"/>
											</svg>
										</button>
									: <></>}
								</div>
								{children ? <ul className="sub-menu">
									{children.map(child => {
										const target = child.data.target
										return <li key={pageHref(target)}>
											<div className="ancestor-wrapper">
												<a href={pageHref(target)} className="entry-title">{pageTitle(target)}</a>
											</div>
										</li>
									})}
								</ul> : <></>}
							</li>
						})}
					</ul>
				</nav>
			</div>
		</header>
		<div></div>
	</>
}

export function SiteFooter() {
	return <>
		<footer id="site-footer">
			<div>
				<div className="site-copyright-group">
					<p className="site-copyright">&copy; 2025 <a href="/">STOWARZYSZENIE UNICORNS</a></p>
					<p><a href="/nota-prawna/">NOTA PRAWNA</a></p>
				</div>
				<a className="to-the-top" href="#app">
					W górę <span aria-hidden="true">&uarr;</span>
				</a>
			</div>
		</footer>
	</>
}
