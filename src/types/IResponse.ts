export interface IResponse<T> {
    "totalItemsCount": 0,
    "pageSize": 0,
    "totalPagesCount": 0,
    "pageIndex": 0,
    "next": true,
    "previous": true,
    "items": T[]
}