// FD-006: Custom Select/Dropdown component

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select...",
  label,
  error,
  disabled = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  const close = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [close]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, close]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          const opt = options[focusedIndex];
          if (opt && !opt.disabled) {
            onChange?.(opt.value);
            close();
          }
        } else {
          setIsOpen(true);
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex((prev) => {
            let next = prev + 1;
            while (next < options.length && options[next].disabled) next++;
            return next < options.length ? next : prev;
          });
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => {
          let next = prev - 1;
          while (next >= 0 && options[next].disabled) next--;
          return next >= 0 ? next : prev;
        });
        break;
    }
  }

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          onKeyDown={handleKeyDown}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`
            w-full flex items-center justify-between
            px-4 py-2.5 bg-[#1a1a1a] rounded-lg
            text-left transition-all duration-100
            focus:outline-none focus:ring-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              error
                ? "border border-red-500 focus:ring-red-500/20"
                : "border border-white/10 focus:border-[#8b5cf6] focus:ring-violet-500/20"
            }
          `}
        >
          <span className={selectedOption ? "text-white" : "text-white/40"}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown
            size={16}
            className={`text-white/40 transition-transform duration-100 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <ul
            ref={listRef}
            role="listbox"
            className="absolute z-50 mt-1 w-full bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-in fade-in duration-100 origin-top scale-in-95"
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                aria-disabled={option.disabled}
                onMouseEnter={() => setFocusedIndex(index)}
                onClick={() => {
                  if (!option.disabled) {
                    onChange?.(option.value);
                    close();
                  }
                }}
                className={`
                  px-4 py-2.5 text-sm cursor-pointer transition-colors duration-50
                  ${option.disabled ? "opacity-40 cursor-not-allowed" : ""}
                  ${option.value === value ? "bg-violet-500/10 text-violet-400" : "text-white"}
                  ${focusedIndex === index && !option.disabled ? "bg-[#222222]" : ""}
                  first:rounded-t-lg last:rounded-b-lg
                `}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
    </div>
  );
}
