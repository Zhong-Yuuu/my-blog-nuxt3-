/**
 * @param sql   sql语句
 * @param params  参数
 * @returns 查询结果
 */

import mysql from 'mysql2/promise'
import { useRuntimeConfig } from '#imports'

/**
 * 创建并导出 MySQL 连接池
 * 单例模式：确保整个应用只有一个连接池实例
 */
let pool: mysql.Pool | null = null

export const getMysqlPool = async () => {
    if (pool) return pool

    // 获取运行时配置(读取 .env 中的 NUXT_* 变量)
    const config = useRuntimeConfig()

    // 添加默认值和验证
    const dbConfig = {
        host: config.mysqlHost || 'localhost',
        port: Number(config.mysqlPort) || 3306,
        user: config.mysqlUser || 'root',
        password: config.mysqlPassword || '',
        database: config.mysqlDatabase || 'nuxt_blog',
        connectionLimit: Number(config.mysqlConnectionLimit) || 10
    }

    // 验证必要配置
    if (!dbConfig.host || !dbConfig.user || !dbConfig.database) {
        throw new Error('数据库配置不完整，请检查环境变量设置')
    }

    // 创建连接池
    pool = await mysql.createPool({
        ...dbConfig,
        charset: 'utf8mb4',     // 支持 emoji、中文
        timezone: '+08:00'      // 时区
    })

    return pool
}

export const query = async<T = any>(sql: string, params: any[] = []) => {
    const pool = await getMysqlPool()
    const [rows] = await pool.execute(sql, params)
    return rows as T
}