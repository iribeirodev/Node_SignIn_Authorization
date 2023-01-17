import jwt, { SignOptions } from 'jsonwebtoken';
import config from 'config';

/**
 * Gerar um JSON Web Token com a chave privada
 * @param payload 
 * @param options 
 * @returns 
 */
export const signJwt = (payload: Object, options: SignOptions = {}) => {
  const privateKey = Buffer.from(
    config.get<string>('accessTokenPrivateKey'),
    'base64'
  ).toString('ascii');
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
};

/**
 * Checar um JSON Web Token com a chave pública
 * @param token 
 * @returns 
 */
export const verifyJwt = <T>(token: string): T | null => {
  try {
    const publicKey = Buffer.from(
      config.get<string>('accessTokenPublicKey'),
      'base64'
    ).toString('ascii');
    return jwt.verify(token, publicKey) as T;
  } catch (error) {
    return null;
  }
};