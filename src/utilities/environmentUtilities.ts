export function getEnvVar(varName: string, defaultValue?: string): string {
    const envVarVal = process.env[varName]

    if (envVarVal) return envVarVal;

    if (!defaultValue)
        throw new Error(`Unable to find value for environment variable: '${varName}'`);

    return defaultValue;
}
