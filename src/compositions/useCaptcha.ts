import { ref, watch } from 'vue';
import { Captcha } from 'src/models/captcha';
import { authRequests } from 'src/requests/auth';
import useRequests from 'src/compositions/useRequest';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';

export default function useCaptcha() {
    const { ajaxCallback } = useRequests();
    const captcha = ref({
        ID: '',
        img: '',
        captchaLoadingState: false,
        validated: false
    } as Captcha);
    const disableSendMail = ref(true);
    const captchaDigital = ref('');

    const rules = {
        captchaDigital: {
            required,
            minLength: minLength(6)
        }
    };

    const cv$ = useVuelidate(rules, { captchaDigital });

    authRequests
        .getCaptcha()
        .then(({ res }) => {
            if (res) {
                captcha.value.ID = res.data.captcha.ID;
                captcha.value.img = res.data.captcha.img;
            }
        })
        .catch((err) => {
            console.log(err);
        });

    const refreshCaptcha = async () => {
        const { res, err } = await authRequests.refreshCaptcha(captcha.value.ID);
        if (err) console.log(err);
        if (res) {
            ajaxCallback(res.data, null, () => {
                captcha.value.ID = res.data.captcha.ID;
                captcha.value.img = res.data.captcha.img;
            }).catch((err) => {
                console.log(err);
            });
            captcha.value.validated = false;
        }
    };

    watch(captchaDigital, async (val) => {
        console.log(val);
        console.log(cv$.value.captchaDigital.$error);
        if (!cv$.value.captchaDigital.$error) {
            const { res, err } = await authRequests.verifyCaptcha(captcha.value.ID, val);
            if (err) console.log(err);
            console.log(res);
            if (res) {
                ajaxCallback(
                    res.data,
                    null,
                    () => {
                        captcha.value.captchaLoadingState = false;
                        captcha.value.validated = true;
                        disableSendMail.value = false;
                    },
                    () => {
                        captcha.value.captchaLoadingState = false;
                    }
                ).catch((err) => {
                    console.log(err);
                });
            }
        }
    });

    return {
        captcha,
        disableSendMail,
        captchaDigital,
        cv$,
        refreshCaptcha
    };
}
