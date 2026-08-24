import './Button.css';

const Button = ({
  onClick,
  onClickArgs = [],
  className,
  content = '',
}: {
  onClick: (...onClickArgs: unknown[]) => void;
  onClickArgs: unknown[];
  className: string;
  content: string;
}) => {
  return (
    <button
      onClick={(event) => onClick(...onClickArgs, event?.currentTarget)}
      className={className}
    >
      {content}
    </button>
  );
};

export default Button;
