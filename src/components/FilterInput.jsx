import { Input } from '@/components/ui/input'

/**
 * A controlled text input for filtering users by username.
 *
 * @param {Object} props
 * @param {string} props.value - The current filter string.
 * @param {Function} props.onChange - Called with the new string value on every keystroke.
 */
export function FilterInput({ value, onChange }) {
  return (
    <Input
      type="text"
      placeholder="Filter by username..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full"
    />
  )
}
