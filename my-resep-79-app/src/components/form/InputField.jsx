const InputField = ({ label, name, type, placeholder, value, onChange, error }) => (
    <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor={name}>
            {label}
        </label>
        <input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`w-full px-4 py-3 rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200`}
        />
        {error && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
        )}
    </div>
);

export default InputField;