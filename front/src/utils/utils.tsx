import { URL_SERVER } from "./backend";
import Cookies from 'js-cookie';

export const getCookieToken = () => {
    return Cookies.get('access_token');
};
export const getImage = (image: string) => URL_SERVER+`/image/${image}`

export function declOfHours(number: number) {
    if (number === 1) {
        return 'час';
    } else if (number >= 2 && number <= 4) {
        return 'часа';
    } else {
        return 'часов';
    }
}