import config from "@tally/config/eslint";

export default [
  // Client gerado pelo Prisma não deve ser lintado.
  { ignores: ["src/generated/**", "dist/**"] },
  ...config,
];
