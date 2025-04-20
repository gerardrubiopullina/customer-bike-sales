
interface SelectorProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
}

export function Selector({ options, value, onChange }: SelectorProps) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border rounded p-1 text-sm text-gray-800"
        >
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    )
}
