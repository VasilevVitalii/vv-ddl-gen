#!/usr/bin/env bun

import { EDdlKind, EUseMode } from '../src/config'
import { Go } from '../src/go'
import { ELoggerMode } from '../src/logger'

Go({
	log: {
		dir: './debug/log',
		mode: ELoggerMode.REWRITE,
	},
	db: {
		kind: EDdlKind.ORA,
		connection: {
			host: 'localhost',
			port: 51521,
			service: 'XEPDB1',
			login: 'sys',
			password: 'mysecurepassword',
			passwordCrypted: false,
		},
		objects: {
			schema: {
				list: [],
				mode: EUseMode.EXCEPT,
			},
			table: {
				dir: './debug/ddl/{{schema}}/TABLE/{{schema}}.TBL.{{table}}.sql',
				allowStorage: true,
				allowTablespace: true,
			},
			view: {
				dir: './debug/ddl/{{schema}}/VIEW/{{schema}}.VIE.{{view}}.sql',
			},
			index: {
				dir: './debug/ddl/{{schema}}/INDEX/{{schema}}.TBL.{{table}}.IDX.{{index}}.sql',
			},
			trigger: {
				dir: './debug/ddl/{{schema}}/TRIGGER/{{schema}}.TRG.{{trigger}}.sql',
			},
			package: {
				dir: './debug/ddl/{{schema}}/PACKAGE/{{schema}}.PHD.{{package}}.sql',
			},
			package_body: {
				dir: undefined, // './debug/ddl/{{schema}}/PACKAGEBODY/{{schema}}.PBY.{{package_body}}.sql',
			},
			procedure: {
				dir: './debug/ddl/{{schema}}/PROCEDURE/{{schema}}.PRC.{{procedure}}.sql',
			},
			function: {
				dir: './debug/ddl/{{schema}}/FUNCTION/{{schema}}.FUN.{{function}}.sql',
			},
			type: {
				dir: './debug/ddl/{{schema}}/TYPE/{{schema}}.TYP.{{type}}.sql',
			},
			sequence: {
				dir: './debug/ddl/{{schema}}/SEQUENCE/{{schema}}.SEQ.{{sequence}}.sql',
			},
			synonym: {
				dir: './debug/ddl/{{schema}}/SYNONYM/{{schema}}.SYN.{{synonym}}.sql',
			},
			job: {
				dir: './debug/ddl/{{schema}}/JOB/{{schema}}.SEQ.{{job}}.sql',
			},
			table_fill_full: {
				dir: './debug/ddl/{{schema}}/TABLEFILLFULL/{{schema}}.TBL.{{table}}.FILLFULL.sql',
				list: ['HR.COUNTRIES', 'HR.JOBS'],
			},
			table_fill_demo: {
				dir: './debug/ddl/{{schema}}/TABLEFILLDEMO/{{schema}}.TBL.{{table}}.FILLDEMO.sql',
				count: 3,
				ignore_exists: false
			},
		},
	},
})
