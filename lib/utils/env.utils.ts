const secureEnvs = ['prod', 'stage', 'test'];

export const isSecureEnv = (): boolean => {
	return secureEnvs.includes(process.env.NODE_ENV || '');
};
