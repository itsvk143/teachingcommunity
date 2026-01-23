import React, { useState } from 'react';
import { X } from 'lucide-react';

const TagInput = ({ label, value = [], onChange, placeholder, icon: Icon, className = "" }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className={`relative group ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-3 text-gray-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <div className={`w-full min-h-[46px] p-2 bg-white border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all flex flex-wrap gap-2 ${Icon ? 'pl-10' : ''}`}>
          {value.map((tag, index) => (
            <span key={index} className="inline-flex items-center px-2.5 py-1 rounded md:rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 animate-in fade-in zoom-in-50 duration-200">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1.5 text-blue-400 hover:text-blue-600 focus:outline-none p-0.5 hover:bg-blue-100 rounded-full transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={addTag}
            placeholder={value.length === 0 ? placeholder : ''}
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 min-w-[120px] py-1"
          />
        </div>
      </div>
      <p className="text-[10px] text-gray-400 mt-1 ml-1 flex items-center gap-1">
        <span className="bg-gray-100 px-1 rounded text-gray-500 border border-gray-200">Enter</span> to add multiple
      </p>
    </div>
  );
};

export default TagInput;
