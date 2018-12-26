export function parseList(str) {
  return str.split(',');
}

export function getEnvConfig(program, configEnv) {
  Object.keys(configEnv).forEach(fieldName => {
    const envVarName = configEnv[fieldName];
    const envVarValue = process.env[envVarName];
    if (envVarValue) {
      program[fieldName] = envVarValue; // eslint-disable-line
    }
  });
}
