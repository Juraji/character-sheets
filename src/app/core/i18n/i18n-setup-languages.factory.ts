import {Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';

export function i18nSetupLanguagesFactory(translate: TranslateService, htmlTitle: Title, localeId: string) {
    return () => {
        const languages = ['en', 'nl']
        const userLang = (navigator.language || ('userLanguage' in navigator ? navigator.userLanguage as string : localeId)).substring(0, 2)

        translate.addLangs(languages)
        translate.use(userLang)

        translate
            .get('common.labels.appName')
            .subscribe(t => htmlTitle.setTitle(t))
    }
}
