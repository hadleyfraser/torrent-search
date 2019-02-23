import * as React from "react";
import styled from "styled-components";
import { tintColor } from "src/utils";

interface IProps {
  children?: React.ReactNode;
  className?: string;
  color: string;
  hardRight?: boolean;
  onClick?: () => void;
}

const ActionBase: React.SFC<IProps> = ({ children, className, onClick }) => (
  <div className={className} onClick={onClick}>
    {children}
  </div>
);

const Action = styled(ActionBase)`
  display: inline;
  color: ${({ color }) => color};
  transition: 0.2s all;
  ${({ color, onClick }) =>
    onClick
      ? `
      cursor: pointer
      &:hover {
        color: ${tintColor(color, -10)};
      }
      `
      : ""}
`;

export default Action;
