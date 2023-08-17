// 分页
declare interface PaginateReq {
    limit: number
    page: number
}

// 带有父级的分页
declare interface ParentPaginateReq extends PaginateReq {
    parent_id?: number
}