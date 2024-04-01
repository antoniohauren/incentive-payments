import crypto from "node:crypto";

export class HashService {
  generateSalt(): string {
    return crypto.randomBytes(16).toString("hex");
  }

  generateHash(input: string, salt: string): string {
    return crypto.pbkdf2Sync(input, salt, 100, 64, "sha512").toString("hex");
  }

  isValidHash(input: string, salt: string, hash: string): boolean {
    const hashed = this.generateHash(input, salt);

    return hashed === hash;
  }
}
