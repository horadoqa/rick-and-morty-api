export function validateSchema(schema, data) {
  const result = schema.safeParse(data);

  if (!result.success) {
    console.error('\n❌ Schema inválido!\n');

    result.error.issues.forEach((issue) => {
      console.error(`Campo: ${issue.path.join('.')}`);
      console.error(`Erro:  ${issue.message}`);
      console.error(`Código: ${issue.code}`);
      console.error('---');
    });

    return false;
  }

  console.log('✅ Schema válido!');

  return true;
}