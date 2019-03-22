(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{555:function(t,e,i){"use strict";i.r(e);var r=i(299),o=i(418),a=i(279),c=i.n(a),n=i(542),s=i(540),l=i(538),p=i(420),d=i(304),u=i(421),f=i(273),h=i(539),y=i(536),m=new l.a({uri:"http://localhost:4000"}),v=new u.a({uri:"ws://localhost:4000/graphql",options:{reconnect:!0}}),g=Object(d.e)(t=>{var e=t.query,i=Object(f.getMainDefinition)(e),r=i.kind,o=i.operation;return"OperationDefinition"===r&&"subscription"===o},v,m),b=new s.a({cacheRedirects:{Query:{operations:(t,e,i)=>{var r=i.getCacheKey;return e.ids.map(t=>r({__typename:"Book",id:t}))}}}}),w=new y.a,$=Object(h.a)({cache:b}),x=new n.a({link:d.a.from([Object(p.a)(t=>{var e=t.graphQLErrors,i=t.networkError;e&&e.map(t=>{var e=t.message,i=t.locations,r=t.path;return console.log(`[GraphQL error]: Message: ${e}, Location: ${i}, Path: ${r}`)}),i&&console.log(`[Network error]: ${i}`)}),w,$,g]),cache:b,connectToDevTools:!0}),k=(i(533),c.a`
  query {
    factories {
      name
      location
    }
  }
`);customElements.define("wcfactory-ui-factories",class extends r.a{static get properties(){return{factories:{type:Array}}}constructor(){super(),this.factories=[];try{x.watchQuery({query:k}).subscribe(t=>{var e=t.data.factories;this.factories=e})}catch(t){}}render(){return r.b`<style>:host {
          display: block;

        }
        #list {
          display: flex;
          flex-direction: column;
        }
        #list-item {
          display: flex;
          padding: 10px;
          color: inherit;
          text-decoration: none;
        }
        #list-item:hover, #list-item:focus {
          background: --list-item-hover-background;
        }
        #item-title {
          flex: 1 1 auto;
          margin: 0;
          font-size: 18px;
        }
        #item-desc {
          opacity: 0.7;
        }</style><div id="list">${this.factories.map(t=>r.b`<a id="list-item" href="/factories/${t.name}"><h2 id="item-title">🏭${t.name}</h2><div id="item-desc">${t.location}</div></a>`)}</div>`}});var E=i(439),S=i.n(E),z=i(327),q=(i(545),c.a`
  mutation($script: String!, $location: String!) {
    runScript(script: $script, location: $location) {
      id
      location
      script
    }
  }
`);customElements.define("wcfactory-ui-script-run",class extends z.a{static get properties(){return{script:{type:String},location:{type:String}}}render(){return this.client=x,this.mutation=q,this.variables={script:this.script,location:this.location},z.c`
      <style>
        :host {
          --wcfactory-ui-script-font-size: 12px;
          font-size: var(--wcfactory-ui-script-font-size);
        }
        button {
          font-family: inherit;
          border: none;
          margin: 0;
          padding: 0;
          background: none;
          color: inherit;
          cursor: pointer;
          font-size: var(--wcfactory-ui-script-font-size);
        }
        .script {
          cursor: pointer;
          padding: calc(var(--wcfactory-ui-script-font-size) * .6);
        }

        .script[active="true"] {
          background: black;
        }
      </style>

      <button
        class="script"
        @click=${this.mutate}>
          🚀${this.script}
      </button>
    `}});var L=c.a`
  mutation($script: String!, $location: String!) {
    stopScript(script: $script, location: $location)
  }
`;customElements.define("wcfactory-ui-script-stop",class extends z.a{static get properties(){return{script:{type:String},location:{type:String}}}render(){return this.client=x,this.mutation=L,this.variables={script:this.script,location:this.location},this.onUpdate=((t,e)=>{if(e.data.stopScript){var i=t.readQuery({query:F}),r=i.operations.filter(t=>!(t.script===this.script&&t.location===this.location));t.writeQuery({query:F,data:Object.assign({},i,{operations:r})})}}),z.c`
      <style>
        :host {
          --wcfactory-ui-script-font-size: 12px;
          font-size: var(--wcfactory-ui-script-font-size);
        }
        button {
          font-family: inherit;
          border: none;
          margin: 0;
          padding: 0;
          background: none;
          color: inherit;
          cursor: pointer;
          font-size: var(--wcfactory-ui-script-font-size);
        }
        .script {
          cursor: pointer;
          padding: calc(var(--wcfactory-ui-script-font-size) * .6);
        }

        .script[active="true"] {
          background: black;
        }
      </style>

      <button
        class="script"
        @click=${this.mutate}>
          ❌ ${this.script}
      </button>
    `}});var F=c.a`
  query operationsList {
    operations {
      id
      location
      script
    }
  }
`;customElements.define("wcfactory-ui-script",class extends z.b{static get properties(){return{script:{type:String},location:{type:String}}}constructor(){super(),this.client=x,this.query=F}render(){return this.data.operations.find(t=>t.script===this.script&&t.location===this.location)?z.c`
        <wcfactory-ui-script-stop .script=${this.script} .location=${this.location}></wcfactory-ui-script-stop>
      `:z.c`
        <wcfactory-ui-script-run .script=${this.script} .location=${this.location}></wcfactory-ui-script-run>
      `}});customElements.define("wcfactory-ui-scripts",class extends r.a{static get properties(){return{scripts:{type:Array},location:{type:String}}}render(){return r.b`${this.scripts.map(t=>r.b`<wcfactory-ui-script .script="${t}" .location="${this.location}"></wcfactory-ui-script>`)}`}});var O=c.a`
  mutation($location: String!) {
    openLocation(location: $location)
  }
`;customElements.define("wcfactory-ui-location",class extends z.a{static get properties(){return{location:{type:String}}}render(){return this.client=x,this.mutation=O,this.variables={location:this.location},z.c`
      <style>
        :host {
          display: block;
        }
        #location {
          cursor: pointer;
        }
      </style>
      <div id="location" @click=${this.mutate}>
        📁 ${this.location}
      </div>
    `}});customElements.define("wcfactory-ui-element",class extends r.a{static get properties(){return{element:{type:Object}}}constructor(){super(),this.element={}}render(){return r.b`<style>:host {
          display: flex;
          background: var(--wcfactory-ui-secondary-color);
          padding: 10px;
          min-height: 100px;
          flex-direction: column;
        }
        button {
          font-family: inherit;
          border: none;
          margin: 0;
          padding: 0;
          background: none;
          color: inherit;
          cursor: pointer
        }
        button:hover, button:focus {
          color: white;
        }
        #header {
          display: flex;
        }
        #title {
          flex: 1 1 auto;
        }
        #middle {
          flex: 1 1 auto;
          font-size: 14px;
          opacity: 0.7;
          font-family: inherit;
          border: none;
          margin: 0;
          padding: 0;
          background: none;
          color: inherit;
          margin: 10px 0;
        }
        #location {
          font-size: 14px;
          opacity: 0.7;
          font-family: inherit;
          border: none;
          margin: 0;
          padding: 0;
          background: none;
          color: inherit;
          cursor: pointer;
        }</style><div id="header"><div id="title">${this.element.name}</div><div id="version">📦${this.element.version}</div></div><div id="middle"><wcfactory-ui-scripts .scripts="${this.element.scripts}" .location="${this.element.location}"></wcfactory-ui-scripts></div><div id="footer"><wcfactory-ui-location .location="${this.element.location}"></wcfactory-ui-location></div>`}});customElements.define("wcfactory-ui-search",class extends r.a{static get properties(){return{placeholder:{type:String}}}constructor(){super(),this.placeholder=""}render(){return r.b`<style>input {
        }</style><label><slot name="label"></slot></label> <input type="text" placeholder="${this.placeholder}">`}});customElements.define("wcfactory-ui-factory",class extends r.a{static get properties(){return{location:{type:Object},loading:{type:Boolean},factory:{type:Object},activeElement:{type:String},elementFilter:{type:String}}}constructor(){super(),this.factory=null,this.loading=!0,this.activeElement=null,this.elementFilter=""}render(){var t=this.location.params.factory;if(this.fetchFactory(t),this.loading)return r.b`loading...`;if(this.factory){var e=new S.a(this.factory.elements,{keys:["name"],minMatchCharLength:2}),i=""!==this.elementFilter?e.search(this.elementFilter):this.factory.elements;return r.b`<style>:host {
            --wcfactory-ui-factory-font-size: 16px;
            display: block;
            font-size: var(--wcfactory-ui-factory-font-size);
          }
          *[aria-role="button"] {
            cursor: pointer;
          }
          #factory-info {
            background: rgba(0,0,0, 0.1);
            padding: calc(var(--wcfactory-ui-factory-font-size) * 1.2);
          }
          #factory-info wcfactory-ui-scripts {
            --wcfactory-ui-scripts-font-size: 14px;
          }
          #factory-info + #filter {
            --wcfactory-ui-factory-filter-margin-top: 3em;
            margin-top: var(--wcfactory-ui-factory-filter-margin-top);
          }
          #element-container {
            display: block;
            font-family: inherit;
            border: none;
            padding: 0;
            margin: 0;
            color: inherit;
          }
          #element {
            display: flex;
            flex-direction: column;
            padding: 10px;
          }
          #element:hover, #element:focus {
            background-color: var(--list-item-hover-background);
          }
          #element-item-container {
            max-height: 0;
            display: block;
            overflow: hidden;
          }
          #element-container[active="true"] {
            margin: 20px;
          }
          #element-container[active="true"] #element-item-container {
            max-height: 100vh;
            transform: scale(1.1);
            transition: all 0.4s ease-in-out;
            margin-top: -50px;
            box-shadow: 1px 1px 1px rgba(0,0,0, 0.2)
          }</style><div id="factory-info">Name: <span class="name">${this.factory.name}</span><br>Location:<wcfactory-ui-location location="${this.factory.location}"></wcfactory-ui-location><br><wcfactory-ui-scripts .scripts="${this.factory.scripts}" .location="${this.factory.location}"></wcfactory-ui-scripts><br></div><div id="filter">Elements: (${this.factory.elements.length})<wcfactory-ui-search placeholder="element name" @input="${t=>this.elementFilter=t.composedPath()[0].value}"><span slot="label">Filter elements:</span></wcfactory-ui-search></div><div id="elements">${i.map(t=>r.b`<div id="element-container" active="${t.name===this.activeElement}"><div id="element" @click="${this._activateItemHander}" @keypress="${this._activateItemHander}" data-name="${t.name}" aria-role="button" aria-haspopup="true" aria-pressed="${t.name===this.activeElement}" tabindex="1">📦 ${t.name}</div><div id="element-item-container" tabindex="${t.name===this.activeElement?"1":null}"><wcfactory-ui-element .element="${t}" tabindex="${t.name===this.activeElement?"1":null}"></wcfactory-ui-element></div></div>`)}</div>`}}fetchFactory(t){try{x.watchQuery({query:c.a`
        query($name: ID!) {
          factory(name: $name) {
            name
            location
            scripts
            elements {
              id
              name
              location
              version
              scripts
            }
          }
        }
      `,variables:{name:t}}).subscribe(t=>{var e=t.data.factory;this.loading=!1,this.factory=e})}catch(t){}}_activateItemHander(t){var e=!1;"click"===t.type?e=!0:void 0!==t.keyCode&&(13!==t.keyCode&&32!==t.keyCode||(e=!0)),e&&(this.activeElement=t.target.dataset.name,t.target.nextSibling.focus())}});customElements.define("wcfactory-ui-404",class extends r.a{render(){return r.b`that path does not exist 😔`}});var j=c.a`
  query {
    operations {
      pid
      location
      script
      element {
        name
      }
    }
  }
`;customElements.define("wcfactory-ui-active-scripts",class extends z.b{constructor(){super(),this.client=x,this.query=j}render(){var t=this.data;return this.error,this.loading,z.c`
      ${t.operations.map(t=>z.c`
          <div>
            <wcfactory-ui-active-script .script=${t}></wcfactory-ui-active-script>
          </div>
        `)}
    `}});customElements.define("wcfactory-ui",class extends r.a{firstUpdated(){this.addEventListener("wcfactory-ui-open-location",this._openLocationHandler.bind(this)),this.routerSetup()}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("wcfactory-ui-open-location",this._openLocationHandler.bind(this))}render(){return r.b`<style>:host {
          --list-item-hover-background: rgba(255,255,255, 0.1);
        }
        h1 a {
          color: inherit;
          text-decoration: inherit;
        }</style><style>:host {
          display: block;
          max-width: 900px;
          margin: auto;
        }
        h1 {
          text-align: center;
          margin-bottom: 5vw
        }</style><h1><a href="/">WCFactory</a></h1><wcfactory-ui-active-scripts></wcfactory-ui-active-scripts><div id="router-outlet"></div>`}routerSetup(){var t=this.shadowRoot.getElementById("router-outlet");new o.a(t).setRoutes([{path:"/",component:"wcfactory-ui-factories"},{path:"/factories",component:"wcfactory-ui-factory"},{path:"/factories/:factory",component:"wcfactory-ui-factory"},{path:"(.*)",component:"wcfactory-ui-404"}])}_openLocationHandler(t){console.log("e:",t)}})}}]);