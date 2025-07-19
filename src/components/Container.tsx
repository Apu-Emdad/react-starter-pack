import { ReactNode } from "react";

type TContainerProps = {
  children?: ReactNode;
  className?: string;
};

const Container = ({ children, className, ...rest }: TContainerProps) => {
  return (
    <div className={`w-full px-5 md:px-20  ${className ? className : ""}`} {...rest}>
      {children}
    </div>
  );
};

export default Container;
