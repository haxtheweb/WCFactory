import { LitElement, html } from "lit-element";

class HaxStatus extends LitElement {
  static get properties() {
    return {
      status: { type: String },
      _clock: {type: String}
    };
  }
  constructor() {
    super();
    this.status = "loading";
    let clock = 1;
    setInterval(() => {
      if (clock === 1) {
        this._clock = "🕛";
      }
      if (clock === 2) {
        this._clock = "🕒";
      }
      if (clock === 3) {
        this._clock = "🕕";
      }
      if (clock === 4) {
        this._clock = "🕘";
      }
      if (clock === 4) {
        clock = 1;
      }
      else {
        clock = ++clock;
      }
      console.log(clock);
    }, 500);

    fetch("https://haxtheweb.org")
      .then(res => {
        if (res.status === 200) {
          this.status = "up";
        }
        else {
          this.status = "down";
        }
      }).catch(() => {
        this.status = "down";
      })
  }
  render() {
    return html`
      ${this.status === "loading" ? html`${this._clock}` : ''}
      ${this.status === "up" ? html`HAXtheWeb.org is up! 😁` : ''}
      ${this.status === "down" ? html`HAXtheWeb.org is down 😦` : ''}
    `;
  }
}
customElements.define("hax-status", HaxStatus);