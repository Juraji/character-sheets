import {Injectable} from '@angular/core';
import {mergeMap, Observable} from 'rxjs';

import {Attachment, Character, CharacterListView, SaveAttachmentResponse} from '@db/model';

import {DatabaseService} from './database-service';

const SHEET_IMAGE_NAME = 'sheetImage'

@Injectable()
export class CharacterService extends DatabaseService<Character, CharacterListView> {

    constructor() {
        super('CHARACTER', ['name', 'age', 'species', 'combatClass']);
    }

    public findSheetImage(docId: string): Observable<Optional<Attachment>> {
        return this
            .findAttachment(docId, SHEET_IMAGE_NAME)
            .pipe(this.catchNotFound<Optional<Attachment>>(null))
    }

    public setSheetImage(docId: string, docRev: string, content: Blob): Observable<SaveAttachmentResponse> {
        return this.deleteSheetImage(docId, docRev)
            .pipe(mergeMap(res => this
                .saveAttachment(res._id, res._rev, SHEET_IMAGE_NAME, content)))
    }

    public deleteSheetImage(docId: string, docRev: string) {
        return this.deleteAttachment(docId, docRev, SHEET_IMAGE_NAME);
    }
}
