import {TranslateService} from '@ngx-translate/core';

export const registerLanguagesFactory = (translate: TranslateService) => () => translate.addLangs(['en', 'nl'])
