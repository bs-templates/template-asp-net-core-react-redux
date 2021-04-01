import {
    Pages,
} from '../../components/pages';

const DEFAULT_ROUTE = { private: false, name: "DEFAULT", path: "/", params: [], component: Pages.Home.pages.Index }
const NOTFOUND_ROUTE = { private: false, name: 'NOTFOUND', path: '/*', params: [], component: Pages.NotFound }

const ROUTES = [
    DEFAULT_ROUTE,
    ...Pages.Home.routes,
    ...Pages.Samples.routes,
    //OTHER_ROUTE,
    //SIGNIN_ROUTE,
    NOTFOUND_ROUTE,
];

export default ROUTES;