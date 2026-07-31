import React, { ReactNode } from 'react';
import * as LucideIcons from 'lucide-react';

// ─── Icon ──────────────────────────────────────────────────────────────────

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({ name, size = 16, className, style }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LucideIcon = (LucideIcons as any)[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} className={className} style={style} />;
};

// ─── Button ────────────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  icon?: string;
  children?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary', size = 'md', icon, children, className = '', ...rest
}) => {
  return (
    <button
      className={`btn btn-${variant} ${size === 'sm' ? 'btn-sm' : ''} ${!children ? 'btn-icon' : ''} ${className}`}
      {...rest}
    >
      {icon && <Icon name={icon} size={14} />}
      {children}
    </button>
  );
};

// ─── Input ────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => (
  <input className={`input ${className}`} {...props} />
);

// ─── Textarea ─────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  mono?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({ className = '', mono, ...props }) => (
  <textarea className={`textarea ${mono ? 'mono' : ''} ${className}`} {...props} />
);

// ─── Select ───────────────────────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ options, className = '', ...props }) => (
  <select className={`select ${className}`} {...props}>
    {options.map((o) => (
      <option key={o.value} value={o.value}>{o.label}</option>
    ))}
  </select>
);

// ─── Toggle ───────────────────────────────────────────────────────────────

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => (
  <label className="toggle">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <span className="toggle-track" />
  </label>
);

// ─── FormGroup ────────────────────────────────────────────────────────────

interface FormGroupProps {
  label?: string;
  hint?: string;
  children: ReactNode;
}

export const FormGroup: React.FC<FormGroupProps> = ({ label, hint, children }) => (
  <div className="form-group">
    {label && <label className="form-label">{label}</label>}
    {children}
    {hint && <span className="form-hint">{hint}</span>}
  </div>
);

// ─── Tooltip ──────────────────────────────────────────────────────────────

export const Tooltip: React.FC<{ text: string; children: ReactNode }> = ({ text, children }) => (
  <div className="tooltip-wrapper">
    {children}
    <div className="tooltip-content">{text}</div>
  </div>
);

// ─── Segmented Control ────────────────────────────────────────────────────

interface SegmentedProps<T extends string> {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}

export function Segmented<T extends string>({ value, onChange, options }: SegmentedProps<T>) {
  return (
    <div className="segmented">
      {options.map((o) => (
        <button
          key={o.value}
          className={`segmented-option ${value === o.value ? 'active' : ''}`}
          onClick={() => onChange(o.value)}
          type="button"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  large?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ title, onClose, children, footer, large }) => {
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal ${large ? 'modal-lg' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <Button variant="ghost" icon="X" onClick={onClose} aria-label="Close" />
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};
