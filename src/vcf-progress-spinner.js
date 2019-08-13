import { html, PolymerElement } from '@polymer/polymer/polymer-element';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin';
import { ElementMixin } from '@vaadin/vaadin-element-mixin';

class VcfProgressSpinner extends ElementMixin(ThemableMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          --vaadin-progress-stroke-dasharray: 314.16%;
          --vaadin-progress-background-color: rgba(0, 0, 0, 0.1);
          --vaadin-progress-foreground-color: var(--primary-color, rgba(0, 0, 0, 0.5));
          --vaadin-progress-line-width: 2px;
          --vaadin-progress-circle-size: 24px;
          display: block;
          width: calc(var(--vaadin-progress-circle-size) + var(--vaadin-progress-line-width));
          height: calc(var(--vaadin-progress-circle-size) + var(--vaadin-progress-line-width));
          position: relative;
          padding: var(--vaadin-progress-line-width);
          box-sizing: border-box;
          margin: 8px;
        }
        :host([hidden]) {
          display: none !important;
        }
        svg {
          overflow: visible;
        }
        svg circle {
          fill: transparent;
          stroke-width: var(--vaadin-progress-line-width);
        }
        #background {
          stroke: var(--vaadin-progress-background-color);
        }
        #foreground {
          transition: stroke-dashoffset 150ms;
          stroke: var(--vaadin-progress-foreground-color);
          stroke-linecap: butt;
          /* 2 * radius(50%) * PI */
          stroke-dasharray: var(--vaadin-progress-stroke-dasharray);
          /* Start the progress from 12 o'clock */
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
          stroke-dashoffset: calc(var(--vaadin-progress-stroke-dasharray) * (1 - var(--vaadin-progress-value)));
        }
        /* Indeterminate circle */
        :host(:not([value])) #foreground {
          animation: indeterminate-progress-circle 0.7s infinite linear;
          transform: none;
          transition: none;
          stroke-dashoffset: 235%;
        }
        /* TODO WebKit doesn't handle negative dashoffset the same as others, so the animation looks broken */
        @keyframes indeterminate-progress-circle {
          100% {
            transform: rotate(360deg);
          }
        }
      </style>

      <svg id="circle" width="100%" height="100%">
        <circle id="background" r="50%" cx="50%" cy="50%" />
        <circle id="foreground" r="50%" cx="50%" cy="50%" />
      </svg>
    `;
  }

  static get is() {
    return 'vcf-progress-spinner';
  }

  static get version() {
    return '0.1.2';
  }

  static get properties() {
    return {
      /**
       * Current progress value.
       */
      value: {
        type: Number,
        observer: '_valueChanged'
      },
      /**
       * Minimum bound of the progress bar.
       */
      min: {
        type: Number,
        value: 0,
        observer: '_minChanged'
      },
      /**
       * Maximum bound of the progress bar.
       */
      max: {
        type: Number,
        value: 1,
        observer: '_maxChanged'
      },
      /**
       * Indeterminate state of the progress bar.
       * This property takes precedence over other state properties (min, max, value).
       */
      indeterminate: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    };
  }

  static get observers() {
    return ['_normalizedValueChanged(value, min, max)'];
  }

  _normalizedValueChanged(value, min, max) {
    const newNormalizedValue = this._normalizeValue(value, min, max);

    this.style.setProperty('--vaadin-progress-value', newNormalizedValue);

    this.updateStyles({
      '--vaadin-progress-value': String(newNormalizedValue)
    });
  }

  _valueChanged(newV, oldV) {
    this.setAttribute('aria-valuenow', newV);
  }

  _minChanged(newV, oldV) {
    this.setAttribute('aria-valuemin', newV);
  }

  _maxChanged(newV, oldV) {
    this.setAttribute('aria-valuemax', newV);
  }

  /**
   * Percent of current progress relative to whole progress bar (max - min)
   */
  _normalizeValue(value, min, max) {
    let nV;

    if (!value && value != 0) {
      nV = 0;
    } else if (min >= max) {
      nV = 1;
    } else {
      nV = (value - min) / (max - min);

      nV = Math.min(Math.max(nV, 0), 1);
    }

    return nV;
  }
}

customElements.define(VcfProgressSpinner.is, VcfProgressSpinner);

/**
 * @namespace Vaadin
 */
window.Vaadin.VcfProgressSpinner = VcfProgressSpinner;

if (window.Vaadin.runIfDevelopmentMode) {
  window.Vaadin.runIfDevelopmentMode('vaadin-license-checker', VcfProgressSpinner);
}
