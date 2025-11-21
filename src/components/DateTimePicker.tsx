import React from "react";

type DateTimePickerProps = {
    label?: string;
    value: string;
    onChange: (value: string) => void;

    /** Không cho chọn trước thời gian này */
    min?: string;

    /** Không cho chọn sau thời gian này */
    max?: string;

    /** Hiển thị lỗi */
    error?: string;
};

const DateTimePicker: React.FC<DateTimePickerProps> = ({
    label,
    value,
    onChange,
    min,
    max,
    error,
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block mb-1 font-medium text-left">
                    {label}
                </label>
            )}

            <input
                type="datetime-local"
                value={value}
                min={min}
                max={max}
                onChange={(e) => onChange(e.target.value)}
                className={`
                    w-full p-3 rounded border bg-white text-black
                    ${error ? "border-red-500" : "border-gray-300"}
                `}
            />

            {error && (
                <p className="text-red-500 text-sm mt-1 text-left">{error}</p>
            )}
        </div>
    );
};

export default DateTimePicker;
