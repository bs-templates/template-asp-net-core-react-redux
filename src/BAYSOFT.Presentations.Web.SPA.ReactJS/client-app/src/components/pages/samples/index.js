import IndexPage, { routes as IndexRoutes } from './IndexPage';
import CreatePage, { routes as CreateRoutes } from './CreatePage';
import EditPage, { routes as EditRoutes } from './EditPage';
import DeletePage, { routes as DeleteRoutes } from './DeletePage';

export default {
    routes: [
        ...IndexRoutes,
        ...CreateRoutes,
        ...EditRoutes,
        ...DeleteRoutes,
    ],
    pages: {
        Index: IndexPage,
        Create: CreatePage,
        Edit: EditPage,
        Delete: DeletePage
    }
};