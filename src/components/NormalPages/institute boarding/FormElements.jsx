import { useState, useRef, useEffect } from 'react';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaCaretDown, FaTimes } from 'react-icons/fa';


const TextInput = (props) => {
    const { value, onChange, errorMessage, ...inputProps } = props;

    return (
        <div className="w-full text-black/30 font-medium">
            <input {...inputProps} value={value} onChange={onChange} type="text" className=" w-full pl-8 py-4 rounded-[20px] border border-[#A2A2A2]/40 shadow-custom-field"  />
            <span className="text-red-500 text-xs mt-1">{errorMessage}</span>
        </div>
    );
};

const NumberInput = (props) => {
    const { value, onChange, errorMessage, ...inputProps } = props;

    return (
        <div className="w-full md:w-[350px] text-black/30 font-medium">
            <input {...inputProps} value={value} onChange={onChange} type="number" className=" w-full pl-8 py-4 rounded-[20px] border border-[#A2A2A2]/40 shadow-custom-field"  />
            <span className="text-red-500 text-xs mt-1">{errorMessage}</span>
        </div>
    );
};

const EmailInput = (props) => {
    const { value, onChange, errorMessage, ...inputProps } = props;

    return (
        <div className="formInput w-full">
            <input {...inputProps} value={value} onChange={onChange} type="email" className=" w-full pl-8 py-4 rounded-[20px] border border-[#A2A2A2]/40 shadow-custom-field" />
            <span className="text-red-500 text-xs mt-1">{errorMessage}</span>
        </div>
    );
};

const PasswordInput = ({ value, onChange, errorMessage, ...inputProps }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="formInput relative w-full">
      <input
        {...inputProps}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        className="w-full pl-8 pr-12 py-4 rounded-[20px] border border-[#A2A2A2]/40 shadow-custom-field"
      />
      <div
        className="absolute top-1/2 right-6 transform -translate-y-1/2 cursor-pointer"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
      </div>

      <span className="text-red-500 text-xs mt-1">{errorMessage}</span>
    </div>
  );
};

const SelectInput = ({ options = [], value, onChange, placeholder, name }) => {
  const [open, setOpen] = useState(false);
  const selectRef = useRef(null);
  const [width, setWidth] = useState('auto');

  useEffect(() => {
    if (selectRef.current) {
      setWidth(`${selectRef.current.offsetWidth}px`);
    }
  }, []);

  return (
    <div className="relative w-full text-gray-400 font-medium" ref={selectRef}>
      <button
        type="button"
        className="w-full pl-8 pr-10 py-4 text-left rounded-[20px] border border-[#A2A2A2]/40 shadow-custom-field"
        onClick={() => setOpen(!open)}
      >
        {value || placeholder}
        <FaCaretDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4" />
      </button>

      {open && (
        <ul
          className="absolute z-10 bg-white mt-2 p-4 rounded-[20px] border border-[#A2A2A2]/40 shadow-lg overflow-hidden"
          style={{ width }}
        >
          {options.map((opt, idx) => (
            <li
              key={idx}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[16px]"
              onClick={() => {
                onChange({ target: { name, value: opt } });
                setOpen(false);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const TextArea = ({ label, value, onChange, errorMessage, ...inputProps }) => {
  return (
    <div className="w-full text-black/30 font-medium">
        <label className="text-black font-medium text-[16px] ml-[15px] mb-[15px]">{label}</label>
      <textarea {...inputProps} value={value} onChange={onChange} rows={4} className="w-full mt-2 px-8 py-4 rounded-[20px] border border-[#A2A2A2]/40 shadow-custom-field overflow-y-auto hide-scrollbar" />
      <span className="text-red-500 text-xs mt-1">{errorMessage}</span>
    </div>
  );
};


const MultiSelectInput = ({ label, options = [], value = [], onChange, placeholder, name }) => {
  const [open, setOpen] = useState(false);
  const selectRef = useRef(null);
  const [width, setWidth] = useState('auto');

  useEffect(() => {
    if (selectRef.current) {
      setWidth(`${selectRef.current.offsetWidth}px`);
    }
  }, []);

  const toggleOption = (option) => {
    const updated =
      value.includes(option) ? value.filter((val) => val !== option) : [...value, option];
    onChange({ target: { name, value: updated } });
  };

  const removeOption = (option) => {
    const updated = value.filter((val) => val !== option);
    onChange({ target: { name, value: updated } });
  };

  return (
    <div className="relative w-full text-black/30 font-medium items-center" ref={selectRef}>
        <label className="text-black font-medium text-[16px] ml-[15px]">{label}</label>
      <button
        type="button"
        className="w-full px-8 py-4 mt-2 text-left rounded-[20px] border border-[#A2A2A2]/40 shadow-custom-field min-h-[56px] flex flex-wrap gap-2"
        onClick={() => setOpen(!open)}
      >
        {value.length === 0 ? (
          <span className="text-gray-400">{placeholder}</span>
        ) : (
          value.map((val, i) => (
            <span
              key={i}
              className="bg-[#D9D9D9]/30 text-black/60 text-sm px-6 py-4 rounded-full flex items-center gap-2 text-[10px]"
              onClick={(e) => e.stopPropagation()}
            >
              {val}
              <FaTimes
                className="cursor-pointer w-3 h-3 font-medium text-black/60"
                onClick={() => removeOption(val)}
              />
            </span>
          ))
        )}
        <FaCaretDown className="absolute right-4 w-4 h-4 text-gray-400" />
      </button>

      {open && (
        <ul
          className="absolute z-10 bg-white mt-2 p-4 rounded-[20px] border border-[#A2A2A2]/40 shadow-lg max-h-[200px] overflow-auto"
          style={{ width }}
        >
          {options.map((opt, idx) => (
            <li
              key={idx}
              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-[16px] ${
                value.includes(opt) ? 'bg-[#D9D9D9]/30 text-black/60' : ''
              }`}
              onClick={() => toggleOption(opt)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const CheckboxGroup = ({ options, name, selectedValues = [], onChange }) => {
  const handleChange = (e) => {
    const { value, checked } = e.target;
    let updated = [...selectedValues];

    if (checked) {
      updated.push(value);
    } else {
      updated = updated.filter((val) => val !== value);
    }

    onChange({ target: { name, value: updated } });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-3">
      {options.map((option, index) => (
        <label key={index} className="flex items-center gap-2 text-sm text-black cursor-pointer">
          <input
            type="checkbox"
            name={name}
            value={option}
            checked={selectedValues.includes(option)}
            onChange={handleChange}
            className="w-4 h-4 accent-primary"
          />
          {option}
        </label>
      ))}
    </div>
  );
};

const RankingInputGroup = ({ title, rankings, onAdd, onRemove }) => {
  const [name, setName] = useState('');
  const [rank, setRank] = useState('');

  const handleAdd = () => {
    if (name && rank) {
      onAdd({ name, rank });
      setName('');
      setRank('');
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-[16px] font-semibold text-primary mb-2">{title}</h3>
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className='flex flex-col gap-4 sm:flex-row'>
          <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <input
          type="number"
          placeholder="Rank"
          value={rank}
          onChange={(e) => setRank(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="bg-primary min-w-[200px] text-white px-6 py-2 rounded-full text-xs font-medium"
        >
        Add {title}
        </button>
      </div>

      <div className="flex flex-wrap mt-4 gap-2">
        {rankings.map((item, index) => (
          <span
            key={index}
            className="bg-primary/10 text-primary text-sm px-4 py-1 rounded-full flex items-center gap-2"
          >
            {item.name} - {item.rank}
            <button
              onClick={() => onRemove(index)}
              className="text-primary hover:text-red-600"
            >
             <FaTimes
                className="cursor-pointer w-3 h-3 font-medium text-black/60"
              />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

const UrlInput = ({value, onChange, errorMessage, ...inputProps}) => {
  return (
    <div className="w-full md:w-[350px] text-black/30 font-medium">
      <input {...inputProps} value={value} onChange={onChange} type="url" className=" w-full pl-8 py-4 rounded-[20px] border border-[#A2A2A2]/40 shadow-custom-field"  />
      <span className="text-red-500 text-xs mt-1">{errorMessage}</span>
    </div>
  );
};

export { TextInput, NumberInput, EmailInput, PasswordInput, SelectInput, TextArea, MultiSelectInput, CheckboxGroup, RankingInputGroup, UrlInput };
