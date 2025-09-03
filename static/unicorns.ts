interface CommandEvent extends Event {
	command: string
}

// @ts-ignore
document.addEventListener('command', (ev: CommandEvent) => {
	if (ev.command === '--toggle') {
		((ev.target as HTMLElement).classList.toggle('expanded'))
	}
}, {
	capture: true
})

const o = new IntersectionObserver(([entry]) => document.documentElement.classList.toggle('on-top', entry?.isIntersecting))
o.observe(document.getElementById('top')!)
