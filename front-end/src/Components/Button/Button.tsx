import './Button.css';

const Button = ({
  onClick,
  onClickArgs,
  className,
}: {
  onClick: (...onClickArgs: unknown[]) => void;
  onClickArgs: unknown[];
  className: string;
}) => {
  return (
    <button
      onClick={(event) => onClick(...onClickArgs, event?.currentTarget)}
      className={className}
    />
  );
};

export default Button;
