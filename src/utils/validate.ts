export function isPhone(value:string):boolean {
    return /^((13[0-9])|(14([0-1]|[4-9]))|(15([0-3]|[5-9]))|(16(2|[5-7]))|(17[1-9])|(18[0-9])|(19[0|1|3])|(19[5-9]))\d{8}$/.test(value)
}

export function isEmail(value:string):boolean {
    return /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)
}