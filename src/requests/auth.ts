import { axios } from 'boot/axios';
import { ResponseData, useReqWrapper } from 'src/compositions/useRequest';
import { RequestResponse } from 'src/requests/base';

const { req } = useReqWrapper();

interface registerParams {
    email: string;
    name: string;
    password: string;
    passwordAgain: string;
    verifyNumber: string | number;
}

interface resetParams {
    email: string;
    password: string;
    passwordAgain: string;
    emailVerifyNumber: string | number;
}

interface CaptchaResponse extends ResponseData {
    captcha: {
        ID: string;
        img: string;
    };
}

interface RegisterResponse extends ResponseData {
    email: string;
}

interface LoginResponse extends RegisterResponse {
    token: string;
    refreshToken: string;
}

interface AuthRequests {
    login: (email: string, password: string) => RequestResponse<LoginResponse>;
    register: (params: registerParams) => RequestResponse<RegisterResponse>;
    getCaptcha: () => RequestResponse<CaptchaResponse>;
    refreshCaptcha: (id: string) => RequestResponse<CaptchaResponse>;
    sendAddressVerifyMail: (email: string) => RequestResponse<ResponseData>;
    sendPasswordResetMail: (email: string) => RequestResponse<ResponseData>;
    verifyCaptcha: (id: string, digitalStr: string) => RequestResponse<ResponseData>;
    resetPassword: (params: resetParams) => RequestResponse<ResponseData>;
}

export const authRequests: AuthRequests = {
    login: (email, password) => {
        return req(
            axios.post('/api/user/login', {
                email: email,
                password: password
            })
        );
    },
    register: (params: registerParams) => {
        return req(
            axios.post('/api/user/register', {
                email: params.email,
                name: params.name,
                password: params.password,
                passwordAgain: params.passwordAgain,
                verifyNumber: params.verifyNumber
            })
        );
    },
    getCaptcha: () => {
        return req(axios.get('/api/public/getCaptcha'));
    },
    refreshCaptcha: (id) => {
        return req(axios.get(`/api/public/refreshCaptcha?id=${id}`));
    },
    sendAddressVerifyMail: (email) => {
        return req(axios.get(`/api/user/sendRegisterVerifyEmail?email=${email}`));
    },
    sendPasswordResetMail: (email) => {
        return req(axios.get(`/api/user/sendPasswordResetMail?email=${email}`));
    },
    verifyCaptcha: (id, digitalStr) => {
        return req(
            axios.post('/api/public/verifyCaptcha', {
                ID: id,
                digitalStr
            })
        );
    },
    resetPassword: (params) => {
        return req(
            axios.post('/api/user/resetPassword', {
                email: params.email,
                password: params.password,
                passwordAgain: params.passwordAgain,
                emailVerifyNumber: params.emailVerifyNumber
            })
        );
    }
};
