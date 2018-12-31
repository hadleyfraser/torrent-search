import * as React from "react";
import styled from "styled-components";

interface IProps {
  className?: string;
  color: string;
  hardRight?: boolean;
  hoverColor?: string;
  onClick?: () => void;
}

const ActionBase: React.SFC<IProps> = ({ children, className, onClick }) => (
  <div className={className} onClick={onClick}>
    {children}
  </div>
);

const Action = styled(ActionBase)`
  position: absolute;
  top: 50%;
  right: ${({ hardRight }) => (hardRight ? "0" : "20px")};
  transform: translateY(-50%);
  color: ${({ color }) => color || ""};
  transition: 0.2s all;
  ${({ onClick }) => (onClick ? "cursor: pointer" : "")}
  ${({ hoverColor }) =>
    hoverColor
      ? `
        &:hover {
          color: ${hoverColor};
        }`
      : ""}
`;

export default Action;
