import defaultSettings from '@/settings'

const title = defaultSettings.title || '早癌筛查智能管理平台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
