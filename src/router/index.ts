import {
    createRouter,
    createWebHashHistory,
    createWebHistory,
    createMemoryHistory
} from 'vue-router';

import routes from './routes';

const routerMode = process.env.VUE_ROUTER_MODE;

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */
export default function (/* { store, ssrContext } */) {
    const createHistory = process.env.SERVER
        ? createMemoryHistory
        : routerMode === 'history'
        ? createWebHistory
        : createWebHashHistory;

    return createRouter({
        scrollBehavior: () => {
            return Promise.resolve().then(() => {
                return { left: 0, top: 0 };
            });
        },
        routes,

        // Leave these as they are and change in quasar.conf.js instead!
        // quasar.conf.js -> build -> vueRouterMode
        // quasar.conf.js -> build -> publicPath
        history: createHistory(process.env.MODE === 'ssr' ? undefined : process.env.VUE_ROUTER_BASE)
    });
}
