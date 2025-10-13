import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const alg = 'HS256';

export async function signJwt(payload: object) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev_secret_change_me');
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyJwt(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev_secret_change_me');
  const { payload } = await jwtVerify(token, secret, { algorithms: [alg] });
  return payload;
}

export async function getUserFromCookie() {
  const token = (await cookies()).get('token')?.value;
  if (!token) return null;
  try {
    const payload = await verifyJwt(token) as any;
    return payload.user as { id: string, email: string, name: string };
  } catch {
    return null;
  }
}
