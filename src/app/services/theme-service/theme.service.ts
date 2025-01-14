import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    private _renderer: Renderer2;
    private _currentTheme: 'light' | 'dark' = 'light';

    constructor(rendererFactory: RendererFactory2) {
        this._renderer = rendererFactory.createRenderer(null, null);
    }

    public get currentTheme(): string {
        return this._currentTheme;
    }

    public toggleTheme(): void {
        this._renderer.removeClass(document.body, `${this._currentTheme}-theme`);

        if (this._currentTheme === 'light') {
            this._currentTheme = 'dark';
        } else {
            this._currentTheme = 'light';
        }

        this._renderer.addClass(document.body, `${this._currentTheme}-theme`);
    }
}
