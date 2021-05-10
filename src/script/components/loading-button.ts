import { LitElement, css, html } from 'lit';
import { customElement, property } from "lit/decorators.js"
import { smallBreakPoint, mediumBreakPoint } from '../utils/css/breakpoints';
import { AppButtonElement } from '../utils/interfaces.components';

import '../components/app-button';
import { FastButtonAppearance } from '../utils/fast-element';

@customElement('loading-button')
export class LoadingButton extends LitElement implements AppButtonElement {
  @property({ type: String }) type = 'submit';
  @property({ type: String }) colorMode = 'primary';
  @property({ type: String }) appearance: FastButtonAppearance = 'neutral';
  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean }) disabled = false;

  static get styles() {
    return css`
      fast-progress-ring {
        height: 1.8em;
        width: 1.8em;

        --accent-foreground-rest: white;
      }

      app-button::part(underlying-button) {
        height: 100%;
        font-size: inherit;
      }

      ${smallBreakPoint(css`
        app-button {
          width: 176px;
          height: var(--mobile-button-height);
        }

        fast-button::part(control) {
          font-size: var(--mobile-button-fontsize);
        }
      `)}

      ${mediumBreakPoint(css`
        app-button {
          width: 176px;
          height: var(--mobile-button-height);
        }
      `)}
    `;
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <app-button
        part="underlying-button"
        .appearance=${this.appearance}
        .type=${this.type}
        .colorMode=${this.colorMode}
        ?disabled=${this.disabled || this.loading}
      >
        ${this.loading
          ? html`<fast-progress-ring></fast-progress-ring>`
          : html`<slot></slot>`}
      </app-button>
    `;
  }
}