import {Router} from '@vaadin/router';

const outlet = document.getElementById('outlet');
const router = new Router(outlet);
router.setRoutes([
  {path: '/',     component: 'x-home-view'},
  {path: '/users',  component: 'x-user-list'},
  {path: '/users/:user', component: 'x-user-profile'},
  {path: '(.*)', component: 'x-not-found-view'},
]);