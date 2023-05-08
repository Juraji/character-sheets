import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {ImageCropperComponent, ImageCropperModule, OutputFormat} from 'ngx-image-cropper';
import {map, Observable, Subject} from 'rxjs';

import {NotPipe} from '@components/pipes';

@Component({
    selector: 'app-cropped-image-input',
    standalone: true,
    imports: [CommonModule, ImageCropperModule, NotPipe, TranslateModule],
    templateUrl: './cropped-image-input.component.html',
    styleUrls: ['./cropped-image-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CroppedImageInputComponent {
    private readonly _selectedFile: Subject<Optional<File>> = new Subject()
    public readonly selectedFile: Observable<Optional<File>> = this._selectedFile

    @Input()
    public aspectRatio = 1

    @Input()
    public contentTypeOut = 'image/png'

    @Output()
    public readonly imageChange: EventEmitter<Blob> = new EventEmitter()

    @Output()
    public readonly cropActive: Observable<boolean> = this._selectedFile
        .pipe(map(it => !!it))

    @ViewChild('cropper', {read: ImageCropperComponent})
    public cropper: Optional<ImageCropperComponent>;

    constructor() {
    }

    public onFileSelected(e: Event) {
        const target = e.target as HTMLInputElement
        const file = target.files?.item(0)
        target.files = null

        if (!!file) this._selectedFile.next(file)
    }


    public onAcceptCrop() {
        const e = this.cropper?.crop()
        if (!!e && !!e.base64) {
            this.imageChange.next(this.b64toBlob(e.base64))
        }
        this.cancelCrop()
    }

    public asFormat(contentType: string): OutputFormat {
        return contentType.substring(contentType.indexOf('/')) as OutputFormat
    }

    public cancelCrop() {
        this._selectedFile.next(null)
    }

    private b64toBlob(dataUri: string, sliceSize = 512) {
        const unpackRegex = /data:([a-z/]+);base64,(.*)/
        const unpacked = unpackRegex.exec(dataUri) ?? []

        const byteCharacters: string = atob(unpacked[2]);
        const byteArrays: Uint8Array[] = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, {type: unpacked[1]});
    }
}
