import { query } from '~~/server/utils/mysql'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
    try {
        // 1. 获取前端传递的用户名/密码
        const { username, password } = await readBody(event)

        // 2. 前端参数校验（可额外限制用户名，比如仅允许 admin）
        if (!username || !password) {
            throw createError({ statusCode: 400, message: '用户名或密码不能为空' })
        }
        // 可选：限制仅能使用 admin 作为用户名（个人博客专属）
        if (username !== 'admin') {
            throw createError({ statusCode: 403, message: '仅允许管理员账号登录' })
        }

        // 3. 查询数据库（参数化查询防SQL注入）
        // 注意：query 返回的是数组，需取 [0] 判断是否存在用户
        const [user] = await query<Array<{
            id: number
            username: string
            password: string
            status: number
            nickname: string
        }>>(`select * from user where username = ?`, [username])

        let currentUser = user;
        // 4. 核心逻辑：用户不存在 → 自动创建（首次登录即注册）
        if (!currentUser) {
            // 4.1 密码加密（加盐值，不可逆）
            const hashPassword = bcrypt.hashSync(password, 10); // 10是加盐强度，推荐值
            // 4.2 插入新用户到数据库
            await query(
                `insert into user (username, password, nickname, status) values (?, ?, ?, ?)`,
                [username, hashPassword, '管理员', 1] // 固定昵称+启用状态
            );
            // 4.3 重新查询创建后的用户（获取自动生成的id等信息）
            const [newUser] = await query<Array<{
                id: number
                username: string
                nickname: string
                status: number
            }>>(`select id, username, nickname, status from user where username = ?`, [username]);
            let currentUser = newUser;
        }

        // 5. 密码校验（仅用户已存在时校验，首次创建无需校验）
        if (user) { // 只有用户已存在，才需要校验密码
            const isPwdValid = bcrypt.compareSync(password, currentUser.password);
            if (!isPwdValid) {
                throw createError({ statusCode: 401, message: '密码错误' })
            }
        }

        // 6. 账号状态校验(1-启用，0-禁用)
        if (currentUser.status === 0) {
            throw createError({ statusCode: 401, message: '账号已被禁用,请联系管理员' })
        }

        // 7. 登录成功，返回用户信息（隐藏密码）
        const { password: _, ...userInfo } = currentUser;
        return {
            code: 200,
            message: user ? '登录成功' : '首次登录，自动创建账号成功',
            data: userInfo
        }

    } catch (error) {
        // 统一异常处理
        console.error('登录接口异常:', error);
        // 如果是自定义错误，则直接抛出，否则返回500
        if (error instanceof Error && (error as any).statusCode) {
            throw error
        }
        throw createError({ statusCode: 500, message: '服务器异常' })
    }
})