import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat();

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // Kullanılmayan değişkenleri kapat
      "@typescript-eslint/no-explicit-any": "off", // `any` kullanımını serbest bırak
      "react-hooks/exhaustive-deps": "off", // React Hook bağımlılık uyarılarını kapat
      "react/no-unescaped-entities": "off", // HTML içinde doğrudan `'` kullanımı serbest
    },
  },
];

export default eslintConfig;
