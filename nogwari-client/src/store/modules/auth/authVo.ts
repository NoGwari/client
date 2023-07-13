export interface IReqBoard {
    page?: number;
}
export interface IBoard {
    categoryId: number
    categoryName: string
    content: string
    createdAt?: string
    dislikes: number
    hidden: number
    hits: number
    id: number
    reported: number
    title: string
    updatedAt?: string
    userGrade: string
    userId: number
    userImg: string
    userNickname: string
    views: number
}