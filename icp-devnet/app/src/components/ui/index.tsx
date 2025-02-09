// components/ui/index.tsx
import React from "react";

export const Input = ({ type, value, onChange, placeholder, min, required }: any) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      required={required}
      className="custom-input"
    />
  );
};

export const Button = ({ children, onClick, disabled, type }: any) => {
  return (
    <button onClick={onClick} disabled={disabled} type={type} className="custom-button">
      {children}
    </button>
  );
};

export const Label = ({ children }: any) => {
  return <label className="custom-label">{children}</label>;
};

export const Select = ({ children, onChange }: any) => {
  return <select onChange={onChange} className="custom-select">{children}</select>;
};

export const SelectItem = ({ value, children }: any) => {
  return <option value={value}>{children}</option>;
};
