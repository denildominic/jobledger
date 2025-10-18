// lib/auth.ts
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");

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
