export default function useUtils() {
    const jobFilter = (val: string) => {
        switch (val) {
            case 'master':
                return '会长';
            case 'submaster':
                return '副会长';
            case 'employed':
                return '会员';
        }
    }
    return {
        jobFilter
    }
}
