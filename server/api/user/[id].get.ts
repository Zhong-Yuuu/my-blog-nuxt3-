import { query } from '~~/server/utils/mysql'

export default defineEventHandler(async (event) => {
    // 获取 URL 参数(id)
    const { id } = getRouterParams(event)
    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: '用户ID不能为空'
        })
    }

    // 执行 SQL (参数化查询，防止 SQL 注入)
    const user = await query('SELECT * FROM user WHERE id = ?', [id])

    if (!user) {
        throw createError({
            statusCode: 404,
            statusMessage: '用户不存在'
        })
    }

    return {
        code: 200,
        data: user,
        message: '查询成功'
    }
})