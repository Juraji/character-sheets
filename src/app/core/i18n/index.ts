import {HttpClient} from '@angular/common/http';
import {APP_INITIALIZER, LOCALE_ID, Provider} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {
    DEFAULT_LANGUAGE,
    FakeMissingTranslationHandler,
    MissingTranslationHandler,
    TranslateCompiler,
    TranslateDefaultParser,
    TranslateFakeCompiler,
    TranslateLoader,
    TranslateParser,
    TranslateService,
    TranslateStore,
    USE_DEFAULT_LANG,
    USE_EXTEND,
    USE_STORE
} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {i18nSetupLanguagesFactory} from './i18n-setup-languages.factory';

export function provideI18n(): Provider[] {
    return [
        {provide: TranslateLoader, useClass: TranslateHttpLoader, deps: [HttpClient]},
        {provide: TranslateCompiler, useClass: TranslateFakeCompiler},
        {provide: TranslateParser, useClass: TranslateDefaultParser},
        {provide: MissingTranslationHandler, useClass: FakeMissingTranslationHandler},
        {provide: TranslateStore, useClass: TranslateStore},
        {provide: TranslateService, useClass: TranslateService},
        {provide: USE_STORE, useValue: true},
        {provide: USE_DEFAULT_LANG, useValue: false},
        {provide: USE_EXTEND, useValue: true},
        {provide: DEFAULT_LANGUAGE, useValue: 'en'},
        {
            provide: APP_INITIALIZER,
            useFactory: i18nSetupLanguagesFactory,
            deps: [TranslateService, Title, LOCALE_ID],
            multi: true
        },
    ]
}

