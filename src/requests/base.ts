import { AxiosResponse } from 'axios';

export type RequestResponse<T> = Promise<{ res: AxiosResponse<T> | null; err: any }>;
