import React from 'react';

interface Props {
  className: string;
  children?: React.ReactNode;
  onClick?: () => void; //might want to remove the '?' if the button will have functionality
}

const Button: React.FC<Props> = ({ 
    className,
    children,
    onClick
  }) => {
  return (
    <div>
      <button className={className} onClick={onClick}>{children}</button>  
    </div>
  )
}

export default Button;