import React from 'react';
import Gateway from "./views/gateways/details/Details";

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Gateways = React.lazy(() => import('./views/gateways/list/List'));
const GatewayCreate = React.lazy(() => import('./views/gateways/create/CreateContainer'));
const GatewayUpdate = React.lazy(() => import('./views/gateways/update/UpdateContanier'));
const PeripheralCreate = React.lazy(() => import('./views/peripherals/create/CreateContainer'));
const PeripheralUpdate = React.lazy(() => import('./views/peripherals/update/UpdateContanier'));

// routes path
export const GATEWAYS = '/gateways';
export const GATEWAYS_CREATE = '/gateways/create';
export const GATEWAYS_DETAIL = '/gateways/detail/:gateway';
export const GATEWAYS_UPDATE = '/gateways/update/:gateway';

export const PERIPHERALS_CREATE = '/peripherals/create/:gateway';
export const PERIPHERALS_UPDATE = '/peripherals/update/:peripheral';

const routes = [
  {path: '/', exact: true, name: 'Home'},
  {path: '/dashboard', name: 'Dashboard', component: Dashboard},
  // gateways
  {path: GATEWAYS, exact: true, name: 'Gateways', component: Gateways, breadcrumb: 'Gateways'},
  {
    path: GATEWAYS_CREATE,
    exact: true,
    name: 'Create gateway',
    component: GatewayCreate,
  },
  {
    path: GATEWAYS_DETAIL,
    exact: true,
    name: 'Gateway Details',
    component: Gateway,
  },
  {
    path: GATEWAYS_UPDATE,
    exact: true,
    name: 'Update gateway',
    component: GatewayUpdate,
  },
  {
    path: PERIPHERALS_CREATE,
    exact: true,
    name: 'Create peripheral',
    component: PeripheralCreate,
  },
  {
    path: PERIPHERALS_UPDATE,
    exact: true,
    name: 'Update peripheral',
    component: PeripheralUpdate,
  },
];

export default routes;
