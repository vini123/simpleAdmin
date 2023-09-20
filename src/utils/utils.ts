export function includes(f: string[], s: string[], mustAll: boolean = false): boolean {
  const diff = f.filter((value) => s.includes(value))
  if (mustAll) {
    return diff.length === s.length
  }
  return diff.length > 0
}
