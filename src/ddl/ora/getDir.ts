import type { TResult } from '../../tresult'
import type { TLinkOra, TObjectOra, TSchemaOra } from './getSchemaList'

export function getDir(object: TObjectOra, schema: TSchemaOra, dirList: Record<string, string | undefined>): TResult<string> {
	let dir = dirList[object.kind]
	if (!dir) return { error: 'empty dir', ok: false }

	dir = dir.replaceAll(`{{schema}}`, schema.name)
	dir = dir.replaceAll(`{{${object.kind.toLowerCase()}}}`, object.name)
	if (object.kind === 'TABLE_FILL_FULL' || object.kind === 'TABLE_FILL_DEMO') {
		dir = dir.replaceAll(`{{table}}`, object.name)
	}

	schema.linkList
		.filter(f => f.kind === object.kind && f.name === object.name)
		.forEach(item => {
			dir = dir!.replaceAll(`{{${item.parentKind.toLowerCase()}}}`, item.parentName)
		})

	const matchNonUseReplace = Array.from(dir.matchAll(/{{[^}]+}}/g)).map(m => m[0])
	const matchNonUseReplaceUniq = Array.from(new Set(matchNonUseReplace))

	if (matchNonUseReplaceUniq.length > 0) {
		return { error: `bad filename "${dir}", no find for replace(s) "${matchNonUseReplaceUniq.join('","')}"`, ok: false }
	}

	return { result: dir, ok: true }
}
