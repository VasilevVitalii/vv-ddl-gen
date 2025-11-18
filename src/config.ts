import { vvConfigJsonc, Type, type Static } from 'vv-config-jsonc'
import { join } from 'path'
import { fsWriteFileSync } from './util/fsWriteFile'
import { readFileSync } from 'fs'
import { ELoggerMode } from './logger'
import { SConnectionOra } from './db/ora'
import { SConnectionPg } from './db/pg'
import { SConnectionMssql } from './db/mssql'

export enum EDdlKind {
	ORA = 'ORA',
	PG = 'PG',
	MSSQL = 'MSSQL',
}

export enum EUseMode {
	INCLUDE = 'INCLUDE',
	EXCEPT = 'EXCEPT',
}

export const SConfigOra = Type.Object({
	kind: Type.Literal(EDdlKind.ORA, { description: 'specifies that this configuration is for Oracle Database' }),
	connection: SConnectionOra,
	objects: Type.Object({
		schema: Type.Object({
			list: Type.Array(Type.String(), { description: 'list of schemas to process', default: [ 'MY_SCHEMA1', 'MY_SCHEMA2'] }),
			mode: Type.Enum(EUseMode, { description: 'INCLUDE: process only schemas from the list; EXCEPT: process all schemas except those in the list', default: 'INCLUDE' }),
		}),
		table: Type.Object({
			dir: Type.Optional(Type.String({ description: 'path template for storing table DDL scripts; supports placeholders {{schema}} and {{table}}', default: 'path/to/ddl/{{schema}}/TABLE/{{schema}}.TBL.{{table}}.sql' })),
			allowStorage: Type.Boolean({ description: 'if true, include STORAGE parameters (INITIAL, NEXT, MINEXTENTS, etc.) in the table DDL (also use for [materialized view])', default: false }),
			allowTablespace: Type.Boolean({ description: 'if true, include TABLESPACE clause in the table DDL (also use for [materialized view])', default: false }),
		}),
		view: Type.Object({
			dir: Type.Optional(Type.String({ description: 'path template for storing view DDL scripts; supports placeholders {{schema}} and {{view}}', default: 'path/to/ddl/{{schema}}/VIEW/{{schema}}.VIE.{{view}}.sql' })),
		}),
		materialized_view: Type.Object({
			dir: Type.Optional(Type.String({ description: 'path template for storing materialized view DDL scripts; supports placeholders {{schema}} and {{materialized_view}}', default: 'path/to/ddl/{{schema}}/MVIEW/{{schema}}.MVW.{{materialized_view}}.sql' })),
		}),
		index: Type.Object({
			dir: Type.Optional(Type.String({ description: 'path template for storing index DDL scripts; supports placeholders {{schema}}, {{table}} and {{index}}', default: 'path/to/ddl/{{schema}}/INDEX/{{schema}}.TBL.{{table}}.IDX.{{index}}.sql' })),
		}),
		trigger: Type.Object({
			dir: Type.Optional(Type.String({ description: 'path template for storing trigger DDL scripts; supports placeholders {{schema}} and {{trigger}}', default: 'path/to/ddl/{{schema}}/TRIGGER/{{schema}}.TRG.{{trigger}}.sql' })),
		}),
		package: Type.Object({
			dir: Type.Optional(Type.String({ description: 'path template for storing package specification DDL scripts; supports placeholders {{schema}} and {{package}}.', default: 'path/to/ddl/{{schema}}/PACKAGE/{{schema}}.PHD.{{package}}.sql' })),
		}),
		package_body: Type.Object({
			dir: Type.Optional(
				Type.String({
					description: 'path template for storing package body DDL scripts; If not set, spec and body are stored in one file; supports placeholders {{schema}} and {{package_body}}',
					default: 'path/to/ddl/{{schema}}/PACKAGEBODY/{{schema}}.PBY.{{package_body}}.sql',
				}),
			),
		}),
		procedure: Type.Object({
			dir: Type.Optional(Type.String({ description: 'path template for storing procedure DDL scripts; supports placeholders {{schema}} and {{procedure}}', default: 'path/to/ddl/{{schema}}/PROCEDURE/{{schema}}.PRC.{{procedure}}.sql' })),
		}),
		function: Type.Object({
			dir: Type.Optional(Type.String({ description: 'path template for storing function DDL scripts; supports placeholders {{schema}} and {{function}}', default: 'path/to/ddl/{{schema}}/FUNCTION/{{schema}}.FUN.{{function}}.sql' })),
		}),
		type: Type.Object({
			dir: Type.Optional(Type.String({ description: 'path template for storing type DDL scripts; supports placeholders {{schema}} and {{type}}', default: 'path/to/ddl/{{schema}}/TYPE/{{schema}}.TYP.{{type}}.sql' })),
		}),
		type_body: Type.Object({
			dir: Type.Optional(
				Type.String({
					description: 'path template for storing type body DDL scripts; If not set, spec and body are stored in one file; supports placeholders {{schema}} and {{type_body}}',
					default: 'path/to/ddl/{{schema}}/TYPEBODY/{{schema}}.TYB.{{type_body}}.sql',
				}),
			),
		}),
		sequence: Type.Object({
			dir: Type.Optional(Type.String({ description: 'path template for storing sequence DDL scripts; supports placeholders {{schema}} and {{sequence}}', default: 'path/to/ddl/{{schema}}/SEQUENCE/{{schema}}.SEQ.{{sequence}}.sql' })),
		}),
		synonym: Type.Object({
			dir: Type.Optional(Type.String({ description: 'path template for storing synonym DDL scripts; supports placeholders {{schema}} and {{synonym}}', default: 'path/to/ddl/{{schema}}/SYNONYM/{{schema}}.SYN.{{synonym}}.sql' })),
		}),
		job: Type.Object({
			dir: Type.Optional(Type.String({ description: 'path template for storing job DDL scripts; supports placeholders {{schema}} and {{job}}', default: 'path/to/ddl/{{schema}}/JOB/{{schema}}.SEQ.{{job}}.sql' })),
		}),
		table_fill_full: Type.Object({
			dir: Type.Optional(Type.String({ description: 'path template for storing full data insert scripts for tables; supports placeholders {{schema}} and {{table}}', default: 'path/to/ddl/{{schema}}/TABLE.FILL.FULL/{{schema}}.TBL.{{table}}.FF.sql' })),
			list: Type.Array(Type.String(), { description: 'list of tables for which to generate full data insert scripts; example: ["schema1.table1", "schema2.table1"]', default: ['schema1.table1', 'schema2.table1'] }),
		}),
		table_fill_demo: Type.Object({
			dir: Type.Optional(Type.String({ description: 'path template for storing demo data insert scripts (few records) for tables. supports placeholders {{schema}} and {{table}}', default: 'path/to/ddl/{{schema}}/TABLE.FILL.DEMO/{{schema}}.TBL.{{table}}.FD.sql' })),
			count: Type.Optional(Type.Integer({ description: 'number of records to include in the demo data script', default: 3, minimum: 0 })),
			ignore_exists: Type.Optional(Type.Boolean({ description: 'if true, do not regenerate the script if the file already exists', default: false })),
		}),
	}),
})
export type TConfigOra = Static<typeof SConfigOra>

export const SConfigPg = Type.Object({
	kind: Type.Literal(EDdlKind.PG, { description: 'work with PostgreSQL database' }),
	connection: SConnectionPg,
	objects: Type.Object({
		table: Type.Object({
			dir: Type.String({ description: 'full path to store dll script for table', default: 'path/to/DDL/TABLE' }),
		}),
	}),
})
export type TConfigPg = Static<typeof SConfigPg>

export const SConfigMssql = Type.Object({
	kind: Type.Literal(EDdlKind.MSSQL, { description: 'work with Microsoft SQL database' }),
	connection: SConnectionMssql,
	objects: Type.Object({
		table: Type.Object({
			dir: Type.String({ description: 'full path to store dll script for table', default: 'path/to/DDL/TABLE' }),
		}),
	}),
})
export type TConfigMssql = Static<typeof SConfigMssql>

export const SConfig = Type.Object({
	log: Type.Object({
		dir: Type.String({ description: 'full path to log file', default: 'path/to/log' }),
		mode: Type.Enum(ELoggerMode, {
			description: 'REWRITE - write log to file "vv-ddl-gen.log"; APPEND - write log to files vv-ddl-gen.YYYYMMDD-HHMMSS.log',
			default: 'REWRITE'
		}),
	}),
	db: Type.Union([SConfigOra, SConfigPg, SConfigMssql]),
})
export type TConfig = Static<typeof SConfig>

export function ConfigGerenate(fullPath: string, kind: EDdlKind): { error?: string; success?: string } {
	const fullFileName = join(fullPath, `vv-ddl-get.config.TEMPLATE.${kind}.jsonc`)
	try {
		const conf = new vvConfigJsonc(SConfig).getDefault([{ path: 'db.kind', value: kind }])
		const resWrite = fsWriteFileSync(fullFileName, conf.text)
		if (resWrite.error) {
			return { error: `on create default config: ${resWrite.error}` }
		}
		return { success: `config create "${fullFileName}"` }
	} catch (err) {
		return { error: `on create default config: ${err}` }
	}
}

export function ConfigRead(fullFileName: string): { error?: string; conf?: TConfig } {
	try {
		const text = readFileSync(fullFileName, 'utf-8')
		const conf = new vvConfigJsonc(SConfig).getConfig(text)
		if (conf.errors.length > 0) {
			return { error: `error(s) in config "${fullFileName}": ${conf.errors.join('; ')}` }
		}
		fsWriteFileSync(fullFileName, conf.text)
		return { conf: conf.config }
	} catch (err) {
		return { error: `error read config "${fullFileName}": ${err}` }
	}
}
