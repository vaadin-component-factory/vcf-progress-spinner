/**
 * @license
 * Copyright (C) 2015 Vaadin Ltd.
 * This program is available under Apache License 2.0
 */

import { html, PolymerElement } from '@polymer/polymer/polymer-element';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin';
import { ElementMixin } from '@vaadin/vaadin-element-mixin';

/**
 * `<vcf-progress-spinner>` Web Component for customized progress spinners
 *
 * ```html
 * <vcf-progress-spinner value="0.5"></vcf-progress-spinner>
 * ```
 *
 * ### Styling
 *
 * The following custom properties are available for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|-------------
 * `--vcf-progress-stroke-dasharray` | SVG stroke-dasharray prop, defines dash pattern of circle outline | 314.16%
 * `--vcf-progress-background-color` | Progress circle background color | rgba(0, 0, 0, 0.1)
 * `--vcf-progress-foreground-color` | Progress circle background color | rgba(0, 0, 0, 0.5)
 * `--vcf-progress-line-width` | Progress circle line width | 24px
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------------|----------------
 * `svg` | SVG element
 * `background` | Background circle
 * `foreground` | Foreground circle
 *
 * @memberof Vaadin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @demo demo/index.html
 */
class VcfProgressSpinner extends ElementMixin(ThemableMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          --vcf-progress-stroke-dasharray: 314.16%;
          --vcf-progress-background-color: rgba(0, 0, 0, 0.1);
          --vcf-progress-foreground-color: rgba(0, 0, 0, 0.5);
          --vcf-progress-line-width: 2px;
          --vcf-progress-circle-size: 24px;
          display: block;
          width: calc(var(--vcf-progress-circle-size) + 2 * var(--vcf-progress-line-width));
          height: calc(var(--vcf-progress-circle-size) + 2 * var(--vcf-progress-line-width));
          position: relative;
          padding: var(--vcf-progress-line-width);
          box-sizing: border-box;
          margin: 8px;
        }
        :host([hidden]) {
          display: none !important;
        }
        svg {
          overflow: visible;
          position: absolute;
          width: var(--vcf-progress-circle-size);
          height: var(--vcf-progress-circle-size);
          top: var(--vcf-progress-line-width);
          left: var(--vcf-progress-line-width);
        }
        svg circle {
          fill: transparent;
          stroke-width: var(--vcf-progress-line-width);
        }
        #background {
          stroke: var(--vcf-progress-background-color);
        }
        #foreground {
          transition: stroke-dashoffset 150ms;
          stroke: var(--vcf-progress-foreground-color);
          stroke-linecap: butt;
          /* 2 * radius(50%) * PI */
          stroke-dasharray: var(--vcf-progress-stroke-dasharray);
          /* Start the progress from 12 o'clock */
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
          stroke-dashoffset: calc(var(--vcf-progress-stroke-dasharray) * (1 - var(--vcf-progress-value)));
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

      <svg id="circle" part="svg">
        <circle id="background" r="50%" cx="50%" cy="50%" part="background" />
        <circle id="foreground" r="50%" cx="50%" cy="50%" part="foreground" />
      </svg>
    `;
  }

  static get is() {
    return 'vcf-progress-spinner';
  }

  static get version() {
    return '1.1.1';
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
    this.style.setProperty('--vcf-progress-value', newNormalizedValue);
    this.updateStyles({ '--vcf-progress-value': String(newNormalizedValue) });
  }

  _valueChanged(value) {
    this.setAttribute('aria-valuenow', value);
  }

  _minChanged(min) {
    this.setAttribute('aria-valuemin', min);
  }

  _maxChanged(max) {
    this.setAttribute('aria-valuemax', max);
  }

  /**
   * Percent of current progress relative to whole progress bar (max - min)
   */
  _normalizeValue(value, min, max) {
    let result;
    if (!value && value != 0) {
      result = 0;
    } else if (min >= max) {
      result = 1;
    } else {
      result = (value - min) / (max - min);
      result = Math.min(Math.max(result, 0), 1);
    }
    return result;
  }
}

customElements.define(VcfProgressSpinner.is, VcfProgressSpinner);

/**
 * @namespace Vaadin
 */
window.Vaadin.VcfProgressSpinner = VcfProgressSpinner;
