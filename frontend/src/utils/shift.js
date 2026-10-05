export function getShiftProgress(start, end, now = new Date()) {
  const currentHours = now.getHours() + now.getMinutes() / 60
  const totalHours = end - start

  if (currentHours < start) {
    const remaining = start - currentHours
    return {
      percentage: 0,
      status: `Comienza en ${remaining.toFixed(1)}h`,
    }
  }

  if (currentHours >= end) {
    return { percentage: 100, status: 'Jornada completada' }
  }

  const percentage = Math.min(100, Math.max(0, ((currentHours - start) / totalHours) * 100))
  return {
    percentage,
    status: `En curso (${Math.round(percentage)}%)`,
  }
}
