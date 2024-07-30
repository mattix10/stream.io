import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { License } from 'src/app/core/models/responses/license-response';
import { AuthService } from 'src/app/core/services/auth.service';
import { LicenseService } from '../../services/license.service';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [AsyncPipe, CommonModule],
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnInit {
  @Input() isLicenseValid = false;
  _license?: License;

  @Input() set license(license: License) {
    if (license) {
      this._license = license;
    }
    console.log(this._license);
  }

  source?: string;
  readonly #authService = inject(AuthService);
  readonly #licenseService = inject(LicenseService);
  readonly isLoggedIn$ = this.#authService.isLoggedIn$;

  @Input() set movieLink(source: string) {
    this.source = source;
  }

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  async ngAfterViewInit()
  {
    await this.initializeVideo();
  }

  async initializeVideo() {
    console.log('video!!!!!!!!!!!!!');
    if (!this.source) return;
    console.log('video!!!!!!!!!!!!!');
    const video = document.querySelector('video');
    if (!video) return;

    console.log('video!!!!!!!!!!!!!');
    // this.#licenseService.getLicense(this.contentId).subscribe(
    //   x =>
    //   {
    //     console.log(x);
    //   });
    const keyData = await this.fetchKey();
    const encryptedVideoResponse = await fetch(this.source);
    const encryptedVideoBuffer = await encryptedVideoResponse.arrayBuffer();

    const key = this.base64ToArrayBuffer(keyData.Key);
    const iv = this.base64ToArrayBuffer(keyData.IV);

    const decryptedBuffer = await this.decryptAES(encryptedVideoBuffer, key, iv);

    const blob = new Blob([decryptedBuffer], { type: 'video/mp4' });
    video.src = URL.createObjectURL(blob);
    video.load();
    video.play();
  }

  async fetchKey(): Promise<any> {
    const response = await this.http.get('path/to/keys.json').toPromise();
    return response;
  }

  async decryptAES(encryptedData: ArrayBuffer, key: ArrayBuffer, iv: ArrayBuffer): Promise<ArrayBuffer> {
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'AES-CBC' },
      false,
      ['decrypt']
    );

    return await crypto.subtle.decrypt(
      { name: 'AES-CBC', iv: iv },
      cryptoKey,
      encryptedData
    );
  }

  base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
