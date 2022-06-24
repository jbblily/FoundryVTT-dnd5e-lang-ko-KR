Hooks.once('init', () => {
	if (typeof Babele !== 'undefined') {
		Babele.get().register({
			module: 'dnd5e-ko',
			lang: 'ko',
			dir: 'localization/compendium/ko'
		});
	}
});
