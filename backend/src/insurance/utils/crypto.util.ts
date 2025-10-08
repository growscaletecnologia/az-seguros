import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

export class CryptoUtil {
  private static readonly algorithm = 'aes-256-gcm'
  private static readonly keyLength = 32 // 256 bits

  static generateKey(): Buffer {
    return randomBytes(this.keyLength)
  }

  static async encrypt(text: string, key: Buffer): Promise<string> {
    const iv = randomBytes(12)
    const cipher = createCipheriv(this.algorithm, key, iv)

    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])

    const authTag = cipher.getAuthTag()

    // Combine IV, auth tag, and encrypted content
    const combined = Buffer.concat([iv, authTag, encrypted])

    return combined.toString('base64')
  }

  static async decrypt(encryptedText: string, key: Buffer): Promise<string> {
    const combined = Buffer.from(encryptedText, 'base64')

    // Extract the components
    const iv = combined.slice(0, 12)
    const authTag = combined.slice(12, 28)
    const encrypted = combined.slice(28)

    const decipher = createDecipheriv(this.algorithm, key, iv)
    decipher.setAuthTag(authTag)

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])

    return decrypted.toString('utf8')
  }
}
