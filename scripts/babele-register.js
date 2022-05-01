Hooks.once('init', () => {
	game.settings.register("dnd5e_ko-KR", "show-original-name", {
		name: "컴펜디움 원본 명칭 표시",
		hint: "컴펜디움 원본 명칭을 번역된 명칭 옆에 나란히 표시합니다. 예시) 화염구 Fireball",
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
		onChange: _ => window.location.reload()
	});

	if (typeof Babele !== 'undefined') {
		Babele.get().register({
			module: 'dnd5e_ko-KR',
			lang: 'ko',
			dir: 'localization/compendium/ko'
		});

		if (!game.settings.get("dnd5e_ko-KR", "show-original-name")) return;
		TranslatedCompendium.prototype.translateOrigin = TranslatedCompendium.prototype.translate;
		TranslatedCompendium.prototype.translate = function(data) {
			let originalName = data.name;
			let translatedData = this.translateOrigin(data);
			if (originalName !== translatedData.name){
				translatedData.name = translatedData.name + ' ' + originalName;
			}
			return translatedData;
		};
		TranslatedCompendium.prototype.i18nNameOrigin = TranslatedCompendium.prototype.i18nName;
		TranslatedCompendium.prototype.i18nName = function(idx) {
			let translated = this.i18nNameOrigin(idx);
			return translated === idx.name ? translated : translated + ' ' + idx.name;
		};
	}
});
