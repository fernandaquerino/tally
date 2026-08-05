import assert from "node:assert/strict";
import { test } from "node:test";

import { loginSchema, registerSchema } from "./auth.ts";

test("registerSchema aceita dados válidos e normaliza o e-mail", () => {
  const result = registerSchema.safeParse({
    name: "  Rafael  ",
    email: "  Rafael@Example.TEST ",
    password: "segredo123",
  });

  assert.equal(result.success, true);
  assert.equal(result.data?.email, "rafael@example.test");
  assert.equal(result.data?.name, "Rafael");
});

test("registerSchema rejeita senha curta", () => {
  const result = registerSchema.safeParse({
    name: "Rafael",
    email: "rafael@example.test",
    password: "1234",
  });

  assert.equal(result.success, false);
});

test("registerSchema rejeita e-mail inválido", () => {
  const result = registerSchema.safeParse({
    name: "Rafael",
    email: "não-é-email",
    password: "segredo123",
  });

  assert.equal(result.success, false);
});

test("loginSchema exige e-mail e senha", () => {
  assert.equal(
    loginSchema.safeParse({ email: "rafael@example.test", password: "x" })
      .success,
    true,
  );
  assert.equal(
    loginSchema.safeParse({ email: "", password: "" }).success,
    false,
  );
});
