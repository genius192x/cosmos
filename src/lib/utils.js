import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function valueUpdater(updaterOrValue, ref) {
  ref.value =
    typeof updaterOrValue === 'function'
      ? updaterOrValue(ref.value)
      : updaterOrValue;
}

export function parseAcl(rawAcl) {
  const aclMap = {}

  rawAcl.forEach(company => {
    const companyId = company.company_id
    aclMap[companyId] = {}

    company.allowedGroups.forEach(group => {
      const groupName = group.name
      aclMap[companyId][groupName] = {}

			group.action.forEach(actionItem => {
				console.log('actionItem', actionItem);

        const action = actionItem.name
        const groups = actionItem.groups.map(item => item)
        aclMap[companyId][groupName][action] = groups
      })
    })
  })

  return aclMap
}

export function checkPermission(aclMap, companyIds, groupName, actionName, userGroups) {
  // Приводим companyIds к массиву, если передан один id
  const ids = Array.isArray(companyIds) ? companyIds : [companyIds]

  // Проверяем наличие доступа хотя бы для одной компании
  return ids.some(companyId => {
    const company = aclMap[companyId]
    if (!company) return false

    const group = company[groupName]
    if (!group) return false

    const allowedGroups = group[actionName]
    if (!allowedGroups) return false

    return allowedGroups.some(group => userGroups.includes(group))
  })
}
