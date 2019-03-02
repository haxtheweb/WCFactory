import { LitElement, html } from 'lit-element';
import {Router} from '@vaadin/router';
import './wcfactory-ui-factories.js'
import './wcfactory-ui-404.js'

class WCFactoryUI extends LitElement {
  firstUpdated() {
    this.routerSetup()
  }

  render() {
    return html`
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
      {path: '(.*)', component: 'wcfactory-ui-404'},
    ]);
  }
}

customElements.define('wcfactory-ui', WCFactoryUI);