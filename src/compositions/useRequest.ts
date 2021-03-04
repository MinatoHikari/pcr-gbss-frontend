import { axios } from 'boot/axios';
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { RequestResponse } from 'src/requests/base';

interface AxiosCommon {
    Authorization: string
}

interface AxiosHeaders {
    common: AxiosCommon
}

export interface ResponseData {
    code: -1 | 0 | 1 | 2
    message?: string
}

export interface AuthResponseData extends ResponseData {
    token?: string
}

export type Req = <T>(req: AxiosPromise<T>, cache?: boolean) => RequestResponse<T>

export default function useRequests() {
    const $q = useQuasar();
    const router = useRouter()

    const setAuthorization = () => {
        (axios.defaults.headers as AxiosHeaders).common.Authorization = `Bearer ${ $q.localStorage.getItem(
            'JWT-token'
        ) as string || '' }`;
    }

    const clearJwt = () => {
        $q.localStorage.remove('JWT-token');
        $q.localStorage.remove('JWT-Refresh-token');
    }

    const redirectToLogin = () => {
        router.replace('/auth/login').catch((err) => {
            console.log(err)
        });
    }

    setAuthorization()

    const ajaxCallback = async (data: ResponseData, cacheKey: AxiosRequestConfig | null, success?: CallableFunction, error?: CallableFunction) => {
        if (data.code === 1) {
            if ('message' in data) {
                $q.notify({
                    type: 'positive',
                    message: data.message
                });
            }

            success && success();
        } else if (data.code === 2) {
            if (cacheKey) {
                const result = await refreshToken(cacheKey);
                if (result) {
                    const { res, err } = result
                    if (err) return err
                    if (res) {
                        ajaxCallback(res.data as ResponseData, null, success, error).catch((err) => {
                            console.log(err)
                        })
                    }
                }
            }
        } else {
            if ('message' in data) {
                $q.notify({
                    type: 'negative',
                    message: data.message
                });
            }

            error && error();

            if (data.code === -1) {
                $q.localStorage.remove('JWT-token');
                router.replace('/auth/login').catch((err) => {
                    console.log(err)
                });
            }
        }
    }

    const refreshToken = async (cacheKey: AxiosRequestConfig) => {
        return axios
            .post(
                '/api/public/refreshToken',
                {
                    reqtype: 'user',
                    token: $q.localStorage.getItem('JWT-token')
                },
                {
                    headers: {
                        Authorization: `Bearer ${ $q.localStorage.getItem(
                            'JWT-Refresh-token'
                        ) as string || '' }`
                    }
                }
            )
            .then((r: AxiosResponse<AuthResponseData>) => {
                switch (r.data.code) {
                    case 1:
                        console.log(r);
                        $q.localStorage.set('JWT-token', r.data.token as string);
                        setAuthorization()
                        return req(axios.request(cacheKey))
                    case -1:
                        $q.notify({
                            type: 'negative',
                            message: r.data.message
                        });
                        clearJwt()
                        redirectToLogin()
                        break;
                    case 0:
                        $q.notify({
                            type: 'negative',
                            message: r.data.message
                        });
                        clearJwt()
                        redirectToLogin()
                        break;
                }
            }).catch((err) => {
                console.log(err)
            });
    }

    const configMap = new WeakMap()

    const req: Req = (req, cache) => {
        return new Promise((resolve) => {
            req.then((res) => {
                if (cache) {
                    if (!configMap.has(res.config)) {
                        configMap.set(res.config, res.config)
                    }
                }
                resolve({ res, err: null })
            }).catch((err) => {
                resolve({ res: null, err })
            })
        })
    }

    return {
        ajaxCallback,
        refreshToken,
        req
    }
}
