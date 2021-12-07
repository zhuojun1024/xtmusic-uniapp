export function formatTime (sec) {
  const _sec = Math.ceil(sec || 0)
  const m = parseInt(_sec / 60)
  const s = _sec % 60
  return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`
}
