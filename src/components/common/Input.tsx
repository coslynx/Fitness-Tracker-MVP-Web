'use client'

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useStore } from '@/store';
import { InputProps } from '@/types/common';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  value: yup.string().required('Value is required'),
});

const Input: React.FC<InputProps> = ({
  type,
  label,
  placeholder,
  value,
  onChange,
  error,
  required,
}) => {
  const [inputValue, setInputValue] = useState<string>(value || '');
  const { register, handleSubmit, formState: { errors }, reset } = useForm<
    { value: string }
  >({
    resolver: yupResolver(schema),
    defaultValues: {
      value: inputValue,
    },
  });

  useEffect(() => {
    setInputValue(value || '');
    reset({
      value: inputValue,
    });
  }, [value, reset]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange && onChange(e);
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={label}>{label}</label>}
      <input
        type={type}
        id={label}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : ''
        }`}
        {...register('value')}
        required={required}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default Input;