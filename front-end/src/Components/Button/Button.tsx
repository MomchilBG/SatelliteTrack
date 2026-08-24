import type { CSSProperties } from 'react';
import './Button.css';

const Button = ({
  onClick,
  onClickArgs = [],
  id = '',
  className = 'custom-button',
  content = '',
  style = {},
  disabled = false,
}: {
  onClick: (...onClickArgs: unknown[]) => void;
  onClickArgs: unknown[];
  id: string;
  className: string;
  content: string;
  style: CSSProperties;
  disabled: boolean;
}) => {
  return (
    <button
      id={id}
      onClick={(event) => onClick(...onClickArgs, event?.currentTarget)}
      className={className}
      style={style}
      disabled={disabled}
    >
      {content}
    </button>
  );
};

export default Button;
