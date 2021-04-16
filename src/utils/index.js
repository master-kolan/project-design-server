/**
 * 返回的response body
 * @param {object} data
 * @param {number} errorCode
 * @param {string} errorMessage
 */
export function generateResponse(data, errorCode = 200, errorMessage = "成功") {
    return {
        code: errorCode,
        errorMessage: errorMessage,
        data: data
    };
}

export function UUID() {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const h = date.getHours();
    const minute = date.getMinutes();
    return  '_' + y + m + d + h + minute + Math.random().toString(36).substr(2);
}

export const SECRET = 'jwt_secret';