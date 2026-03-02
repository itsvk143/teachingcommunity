import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';

export default function MultiSelect({ options, selected, onChange, placeholder, disabled = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (option) => {
        if (disabled) return;
        const value = option.value || option;
        if (selected.includes(value)) {
            onChange(selected.filter((item) => item !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    const removeOption = (e, optionValue) => {
        e.stopPropagation();
        onChange(selected.filter((item) => item !== optionValue));
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full min-h-[42px] px-3 py-2 border rounded-lg bg-white flex items-center justify-between cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 transition-all ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-50' : 'border-gray-300'}`}
            >
                <div className="flex flex-wrap gap-1 items-center flex-1">
                    {selected.length === 0 ? (
                        <span className="text-gray-400 text-sm">{placeholder || 'Select options...'}</span>
                    ) : (
                        selected.map((val) => {
                            const optionObj = options.find(o => (o.value || o) === val);
                            const label = optionObj ? (optionObj.label || optionObj) : val;
                            return (
                                <span key={val} className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md">
                                    {label}
                                    <button
                                        type="button"
                                        onClick={(e) => removeOption(e, val)}
                                        className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )
                        })
                    )}
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 shadow-lg rounded-lg max-h-60 overflow-y-auto z-50">
                    {options.length === 0 ? (
                        <div className="p-3 text-sm text-gray-500 text-center">No options available</div>
                    ) : (
                        <div className="p-1">
                            {options.map((option, idx) => {
                                const value = option.value || option;
                                const label = option.label || option;
                                const isSelected = selected.includes(value);

                                return (
                                    <div
                                        key={idx}
                                        onClick={() => toggleOption(option)}
                                        className={`flex items-center px-3 py-2 text-sm cursor-pointer rounded-md transition-colors hover:bg-gray-50 ${isSelected ? 'bg-blue-50/50' : ''}`}
                                    >
                                        <div className={`w-4 h-4 flex-shrink-0 border rounded mr-3 flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                                            {isSelected && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <span className="truncate text-gray-700">{label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
