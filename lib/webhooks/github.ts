import { createHmac, timingSafeEqual } from "node:crypto";
import "server-only";

export function getGitHubWebhookSecret() {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error("Missing GITHUB_WEBHOOK_SECRET");
  }

  return secret;
}

export function verifyGitHubWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string,
) {
  if (!signature) {
    return false;
  }

  const expected = `sha256=${createHmac("sha256", secret).update(payload).digest("hex")}`;
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, signatureBuffer);
}
