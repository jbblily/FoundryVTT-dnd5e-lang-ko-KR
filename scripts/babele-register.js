/* babele-register.js
 * 이 스크립트는 컴펜디움 번역 기능을 설정하고, 원어 병기 옵션을 처리합니다.
 */
import {TranslatedCompendium} from "../../babele/script/translated-compendium.js";

/* 월드 설정에 옵션 등록 */
Hooks.once('init', () => {
	game.settings.register("dnd5e-ko", "show-original-name", {
		name: "컴펜디움 원어 병기",
		hint: "컴펜디움 원본 명칭을 번역된 명칭 옆에 나란히 표시합니다. 예시) 화염구 Fireball",
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
		onChange: _ => window.location.reload()
	});

	// 컴펜디움 번역 기능이 활성화되어 있는지 확인
	if (typeof Babele !== 'undefined') {
		game.babele.register({
			module: 'dnd5e-ko',
			lang: 'ko',
			dir: 'localization/compendium/ko'
		});

		// 컴펜디움 번역 변환기 등록
		game.babele.registerConverters({
			dndpages(pages, translations) {
				return pages.map((document) => {
					if (!translations) {
						return document;
					}

					let translation;

					if (Array.isArray(translations)) {
						translation = translations.find((t) => t.id === document._id || t.id === document.name);
					} else {
						translation = translations[document.name];
					}

					if (!translation) {
						return document;
					}
					return mergeObject(document, {
						name: translation.name,
						image: { caption: translation.caption ?? document.image?.caption },
						src: translation.src ?? document.src,
						text: { content: translation.text ?? document.text?.content },
						video: {
							width: translation.width ?? document.video?.width,
							height: translation.height ?? document.video?.height
						},
						system: translation.system ?? document.system,
						translated: true
					});
				});
			}
		});

		// 원어 병기 기능
		// 원어 병기 기능이 활성화되어 있는 경우, 컴펜디움 원본 이름을 추가합니다.
		if (!game.settings.get("dnd5e-ko", "show-original-name")) return;
		TranslatedCompendium.prototype.translateOrigin = TranslatedCompendium.prototype.translate;
		TranslatedCompendium.prototype.translate = function(document) {
			let originalName = document.name;
			let translatedData = this.translateOrigin(document);
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