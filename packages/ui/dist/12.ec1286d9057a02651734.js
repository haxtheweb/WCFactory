(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{398:function(t,e,i){"use strict";i.r(e);var r=i(277),o=i(324),a=i(284),n=i.n(a),s=i(387),c=i(388),l=i(382),d=i(326),p=i(279),u=i(327),h=i(268),m=i(389),y=i(381),b=new l.a({uri:"http://localhost:4000"}),f=new u.a({uri:"ws://localhost:4000/graphql",options:{reconnect:!0}}),v=new y.a,g=Object(p.e)(t=>{var e=t.query,i=Object(h.getMainDefinition)(e),r=i.kind,o=i.operation;return"OperationDefinition"===r&&"subscription"===o},f,b),w=new c.a,x=Object(m.a)({cache:w}),$=new s.a({link:p.a.from([Object(d.a)(t=>{var e=t.graphQLErrors,i=t.networkError;e&&e.map(t=>{var e=t.message,i=t.locations,r=t.path;return console.log(`[GraphQL error]: Message: ${e}, Location: ${i}, Path: ${r}`)}),i&&console.log(`[Network error]: ${i}`)}),x,g,v]),cache:w,connectToDevTools:!1}),k=(i(376),n.a`
  query {
    factories {
      name
      location
    }
  }
`);customElements.define("wcfactory-ui-factories",class extends r.a{static get properties(){return{factories:{type:Array}}}constructor(){super(),this.factories=[];try{$.watchQuery({query:k}).subscribe(t=>{var e=t.data.factories;this.factories=e})}catch(t){}}render(){return r.b`<style>:host {
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
        }</style><div id="list">${this.factories.map(t=>r.b`<a id="list-item" href="/factories/${t.name}"><h2 id="item-title">🏭${t.name}</h2><div id="item-desc">${t.location}</div></a>`)}</div>`}});var E=i(345),S=i.n(E),O=n.a`
  query {
    operations {
      script
      location
    }
  }
`,C=n.a`
  subscription {
    operationsUpdate
  }
`,L=n.a`
  subscription {
    operationsChildProcess
  }
`;customElements.define("wcfactory-ui-scripts",class extends r.a{static get properties(){return{scripts:{type:Array},operations:{type:Array},location:{type:Array},activeScript:{type:String}}}constructor(){super(),this.scripts={},this.operations=[],this.activeScript=""}firstUpdated(){this.subscribeToOperations(),this.subscribeToOperationsChildProcess(),this.fetchOperations()}render(){return r.b`<style>button {
          font-family: inherit;
          border: none;
          margin: 0;
          padding: 0;
          background: none;
          color: inherit;
          cursor: pointer
        }
        .script {
          margin-right: 10px;
          padding: 5px;
        }

        .script[active="true"] {
          background: black;
        }

        #output {
          background: black;
          height: 100px;
        }</style>${this.activeScript} ${this.script} ${this.scripts.map(t=>this.operations.find(e=>e.script===t&&e.location===this.location)?r.b`<span class="script" active="${this.activeScript===t}">🔄${t}</span>`:r.b`<button class="script" @click="${e=>this.runScript(t,this.location)}">🚀${t}</button>`)}<div id="output"></div>`}runScript(t,e){return new Promise(function(i,r){var o=function(){try{return i()}catch(t){return r(t)}},a=function(t){try{return o()}catch(t){return r(t)}};try{return Promise.resolve($.mutate({mutation:n.a`
          mutation($script: String!, $location: String!) {
            runScript(script: $script, location: $location)
          }
        `,variables:{script:t,location:e}})).then(function(t){try{return o()}catch(t){return a()}},a)}catch(t){a()}})}fetchOperations(){try{$.watchQuery({query:O}).subscribe(t=>{var e=t.data.operations;this.operations=e})}catch(t){}}subscribeToOperations(){window.WCFactoryUI=Object.assign({},{SUBSCRIBE_OPERATIONS_UPDATE:"subscribed"}),$.subscribe({query:C}).subscribe(t=>{var e=t.data.operationsUpdate,i=$.readQuery({query:O}),r=JSON.parse(e);i.operations=[...i.operations,r],$.writeQuery({query:O,data:i})})}subscribeToOperationsChildProcess(){window.WCFactoryUI=Object.assign({},{SUBSCRIBE_OPERATIONS_CHILD_PROCESS:"subscribed"}),$.subscribe({query:L}).subscribe(t=>{var e=t.data.operationsChildProcess;this.shadowRoot.getElementById("output").innerHTML=e})}});customElements.define("wcfactory-ui-element",class extends r.a{static get properties(){return{element:{type:Object},operations:{type:Array}}}constructor(){super(),this.element={}}render(){return r.b`<style>:host {
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
        }</style><div id="header"><div id="title">${this.element.name}</div><div id="version">📦${this.element.version}</div></div><div id="middle"><wcfactory-ui-scripts .scripts="${this.element.scripts}" .location="${this.element.location}"></wcfactory-ui-scripts></div><div id="footer"><button id="location" @click="${this._locationClicked}">📁${this.element.location}</button></div>`}_locationClicked(t){this.openLocation(this.element.location)}openLocation(t){$.mutate({mutation:n.a`
        mutation($location: String!) {
          openLocation(location: $location)
        }
      `,variables:{location:t}})}});customElements.define("wcfactory-ui-search",class extends r.a{static get properties(){return{placeholder:{type:String}}}constructor(){super(),this.placeholder=""}render(){return r.b`<style>input {
        }</style><label><slot name="label"></slot></label> <input type="text" placeholder="${this.placeholder}">`}});customElements.define("wcfactory-ui-factory",class extends r.a{static get properties(){return{location:{type:Object},loading:{type:Boolean},factory:{type:Object},activeElement:{type:String},elementFilter:{type:String}}}constructor(){super(),this.factory=null,this.loading=!0,this.activeElement=null,this.elementFilter=""}render(){var t=this.location.params.factory;if(this.fetchFactory(t),this.loading)return r.b`loading...`;if(this.factory){var e=new S.a(this.factory.elements,{keys:["name"],minMatchCharLength:2}),i=""!==this.elementFilter?e.search(this.elementFilter):this.factory.elements;return r.b`<style>:host {
            display: block;
          }
          *[aria-role="button"] {
            cursor: pointer;
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
            max-height: 400px;
            transform: scale(1.1);
            transition: all 0.4s ease-in-out;
            margin-top: -50px;
            box-shadow: 1px 1px 1px rgba(0,0,0, 0.2)
          }</style>Name: ${this.factory.name}<br>Location: ${this.factory.location}<br>Elements: (${this.factory.elements.length})<div id="filter"><wcfactory-ui-search placeholder="element name" @input="${t=>this.elementFilter=t.composedPath()[0].value}"><span slot="label">Filter elements:</span></wcfactory-ui-search></div><div id="elements">${i.map(t=>r.b`<div id="element-container" active="${t.name===this.activeElement}"><div id="element" @click="${this._activateItemHander}" @keypress="${this._activateItemHander}" data-name="${t.name}" aria-role="button" aria-haspopup="true" aria-pressed="${t.name===this.activeElement}" tabindex="1">📦 ${t.name}</div><div id="element-item-container" tabindex="${t.name===this.activeElement?"1":null}"><wcfactory-ui-element .element="${t}" tabindex="${t.name===this.activeElement?"1":null}"></wcfactory-ui-element></div></div>`)}</div>`}}fetchFactory(t){try{$.watchQuery({query:n.a`
        query($name: ID!) {
          factory(name: $name) {
            name
            location
            elements {
              name
              location
              version
              scripts
            }
          }
        }
      `,variables:{name:t}}).subscribe(t=>{var e=t.data.factory;this.loading=!1,this.factory=e})}catch(t){}}_activateItemHander(t){var e=!1;"click"===t.type?e=!0:void 0!==t.keyCode&&(13!==t.keyCode&&32!==t.keyCode||(e=!0)),e&&(this.activeElement=t.target.dataset.name,t.target.nextSibling.focus())}});customElements.define("wcfactory-ui-404",class extends r.a{render(){return r.b`that path does not exist 😔`}});customElements.define("wcfactory-ui",class extends r.a{firstUpdated(){this.addEventListener("wcfactory-ui-open-location",this._openLocationHandler.bind(this)),this.routerSetup()}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("wcfactory-ui-open-location",this._openLocationHandler.bind(this))}render(){return r.b`<style>:host {
          --list-item-hover-background: rgba(255,255,255, 0.1);
        }</style><style>:host {
          display: block;
          max-width: 900px;
          margin: auto;
        }
        h1 {
          text-align: center;
          margin-bottom: 5vw
        }</style><h1>WCFactory</h1><div id="router-outlet"></div>`}routerSetup(){var t=this.shadowRoot.getElementById("router-outlet");new o.a(t).setRoutes([{path:"/",component:"wcfactory-ui-factories"},{path:"/factories",component:"wcfactory-ui-factory"},{path:"/factories/:factory",component:"wcfactory-ui-factory"},{path:"(.*)",component:"wcfactory-ui-404"}])}_openLocationHandler(t){console.log("e:",t)}})}}]);