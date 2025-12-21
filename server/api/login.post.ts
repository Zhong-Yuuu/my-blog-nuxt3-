import { query } from '~~/server/utils/mysql'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'     // node内置库，无需安装

// 生成简易 Token
const generateToken = (username: string) => {
    const secret = 'my_nuxt3_blog_secret'
    const payload = `${username}_${Date.now()}}`
    // 用 HMAC-SHA256 算法生成签名
    const token = crypto.createHash('sha256').update(payload + secret).digest('hex')
    // Token 拼接有效期
    return `${token}_${Date.now() + 1000 * 60 * 60 * 24 * 7}` // 7天有效期
}

export const verifyToken = (token: string) => {
    try {
        const secret = 'my_nuxt3_blog_secret'
        const [hash, expireTime] = token.split('_')
        // 1.检验是否过期
        if (Number(expireTime) < Date.now()) {
            throw createError({ statusCode: 401, message: 'Token已过期' })
        }

        // 2. 校验签名
        const [username] = hash.split('_')
        const verifyHash = crypto.createHash('sha256').update(`${username}_${Date.now()}}${secret}`).digest('hex')
        return verifyHash === hash
    } catch (error) {
        throw createError({ statusCode: 401, message: 'Token无效' })
    }
}

export default defineEventHandler(async (event) => {
    try {
        // 1. 获取前端传递的用户名/密码
        const { username, password } = await readBody(event)

        // 2. 前端参数校验
        if (!username || !password) {
            throw createError({ statusCode: 400, message: '用户名或密码不能为空' })
        }
        // 限制仅 ZhongYu 登录（你的管理员账号）
        if (username !== 'ZhongYu') {
            throw createError({ statusCode: 403, message: '仅允许管理员账号登录' })
        }

        // 3. 查询数据库（关键修复1：先接收完整数组，避免解构undefined）
        const userList = await query<Array<{
            id: number
            username: string
            password: string
            status: number
            nickname: string
        }>>(`select * from sys_user where username = ?`, [username])
        
        // 安全取第一个元素，无数据则为undefined
        const existingUser = userList && userList.length > 0 ? userList[0] : undefined;
        let currentUser = existingUser; // 全局变量，避免重复声明

        // 4. 核心逻辑：用户不存在 → 自动创建
        if (!existingUser) {
            // 4.1 密码加密
            const hashPassword = bcrypt.hashSync(password, 10);
            // 4.2 插入新用户
            await query(
                `insert into sys_user (username, password, nickname, status) values (?, ?, ?, ?)`,
                [username, hashPassword, '管理员', 1]
            );
            // 4.3 重新查询创建后的用户（关键修复2：同样安全取值）
            const newUserList = await query<Array<{
                id: number
                username: string
                nickname: string
                status: number
            }>>(`select id, username, nickname, status from sys_user where username = ?`, [username]);
            let currentUser = newUserList && newUserList.length > 0 ? newUserList[0] : undefined;

            // 兜底：创建后仍无数据则抛错
            if (!currentUser) {
                throw createError({ statusCode: 500, message: '创建账号失败，请检查数据库表结构' });
            }
        }

        // 5. 密码校验（关键修复3：先校验currentUser存在，再访问password）
        if (existingUser) {
            if (!currentUser) {
                throw createError({ statusCode: 500, message: '用户数据异常' });
            }
            const isPwdValid = bcrypt.compareSync(password, currentUser.password);
            if (!isPwdValid) {
                throw createError({ statusCode: 401, message: '密码错误' })
            }
        }

        // 6. 账号状态校验（关键修复4：先校验currentUser存在，再访问status）
        if (!currentUser) {
            throw createError({ statusCode: 500, message: '用户数据异常' });
        }
        if (currentUser.status === 0) {
            throw createError({ statusCode: 401, message: '账号已被禁用,请联系管理员' })
        }

        // 7. 登录成功，返回用户信息
        const token = generateToken(username)
        const { password: _, ...userInfo } = currentUser;
        return {
            code: 200,
            message: existingUser ? '登录成功' : '首次登录，自动创建账号成功',
            data: {
                ...userInfo,
                token
            }
        }

    } catch (error) {
        // 统一异常处理
        console.error('登录接口异常:', error);
        // 标准化错误抛出
        if (error instanceof Error && (error as any).statusCode) {
            const { statusCode, message } = error as any
            throw createError({ statusCode, message })
        }
        throw createError({ statusCode: 500, message: '服务器异常' })
    }
})