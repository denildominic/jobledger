import { SignJWT, jwtVerify } from "jose";

const raw = process.env.JWT_SECRET;
if (!raw) {
  throw new Error("JWT_SECRET is not set. Add it to .env.local and Vercel env.");
}
const secret = new TextEncoder().encode(raw);

export async function signJwt(payload: any, expiresIn = "30d") {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function verifyJwt(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload;
}
