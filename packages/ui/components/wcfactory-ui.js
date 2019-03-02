import { LitElement, html } from 'lit-element';
import {Router} from '@vaadin/router';
import './wcfactory-ui-factories.js'
import './wcfactory-ui-factory.js'
import './wcfactory-ui-404.js'

class WCFactoryUI extends LitElement {
  firstUpdated() {
    this.routerSetup()
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
          max-width: 900px;
          margin: auto;
        }
        h1 {
          text-align: center;
          margin-bottom: 5vw
        }
      </style>
      <h1>Web Component Factory</h1>
      <div id="router-outlet"></div>
    `;  
  }

  /**
   * Sets up the router
   */
  routerSetup() {
    const outlet = this.shadowRoot.getElementById('router-outlet')
    const router = new Router(outlet);
    router.setRoutes([
      {path: '/', component: 'wcfactory-ui-factories'},
      {path: '/factories', component: 'wcfactory-ui-factory'},
      {path: '/factories/:factory', component: 'wcfactory-ui-factory'},
      {path: '(.*)', component: 'wcfactory-ui-404'},
    ]);
  }
}

customElements.define('wcfactory-ui', WCFactoryUI);