import { Store } from 'vuex';
import { MainState } from 'src/store';
import { AxiosStatic } from 'axios';
import { Router } from 'vue-router';

declare module '@vue/runtime-core' {
    // declare your own store states
    //     interface State {
    //         count: number
    //     }

    // provide typings for this.$store
    interface ComponentCustomProperties {
        $store: Store<MainState>;
        $axios: AxiosStatic;
        $router: Router;
    }
}
