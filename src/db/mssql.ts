import { Type, type Static } from 'vv-config-jsonc'

export const SConnectionMssql = Type.Object(
	{
		host: Type.String({ default: 'localhost' }),
		port: Type.Integer({ default: 1433 }),
		database: Type.String({ default: 'tempdb' }),
		login: Type.String({ default: 'USER' }),
		password: Type.String({ default: '123456' }),
	},
	{ description: 'connection to Microsoft SQL' },
)
export type TConnectionMssql = Static<typeof SConnectionMssql>
