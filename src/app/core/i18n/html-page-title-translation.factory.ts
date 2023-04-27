import {Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';

export const bindAppTitleToHtmlPageTitle = (translate: TranslateService, title: Title) => () => translate
    .get('app.title')
    .subscribe(t => title.setTitle(t))
