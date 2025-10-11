export const redisConfig = {
  connection: {
    host: 'localhost',
    port: 6380,
  },
}

// export const redisConfig = {  TEM QUE ALTERAR PRA PROD
//   connection: {
//     host: process.env.REDIS_HOST || 'localhost', // Usa variável de ambiente ou 'localhost' como fallback
//     port: parseInt(process.env.REDIS_PORT || '6379', 10), // Usa variável de ambiente ou 6379 como fallback
//     password: process.env.REDIS_PASSWORD || undefined, // Adiciona suporte para senha, se necessário
//   },
// };