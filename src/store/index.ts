// default src/store/index.ts content:
import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import user from './user';
import { UserState } from 'src/store/user/state';
// import example from './module-example'
const debugging = process.env.DEBUGGING;

console.log(debugging);

export type MainState = {
    user: UserState;
}

// define injection key
export const key: InjectionKey<Store<MainState>> = Symbol('InjectionKey');

export default function (/* { ssrContext } */): Store<MainState> {
    return createStore({
        modules: {
            // example
            user
        },

        // enable strict mode (adds overhead!)
        // for dev mode and --debug builds only
        strict: !!debugging
    });
}

export function useStore(): Store<MainState> {
    return baseUseStore(key);
}
