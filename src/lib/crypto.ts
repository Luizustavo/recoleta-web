import AES from 'crypto-js/aes'
import Utf8 from 'crypto-js/enc-utf8'

export function decrypt(value?: string): string {
  if (!value) {
    throw new Error('No value provided for decryption')
  }
  const bytes = AES.decrypt(value, process.env.SECRET_KEY || 'secret')
  return bytes.toString(Utf8)
}

export function encrypt(value: string): string {
  if (!value) {
    throw new Error('No value provided for encryption')
  }
  
  const encrypted = AES.encrypt(value, process.env.SECRET_KEY || 'secret').toString()
  return encrypted
}
