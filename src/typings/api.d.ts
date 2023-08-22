// 分页
declare interface PaginateReq {
    limit: number
    page: number
}

// 带有父级的分页
declare interface ParentPaginateReq extends PaginateReq {
    parent_id?: number
}

// 数字 boolean 型
declare type NumberBoolean = 0 | 1

// 性别
declare type Gender = 1 | 2 | 0