import styled from "styled-components";

interface IProps {
  className?: string;
  hardRight?: boolean;
}

const ActionList = styled.div<IProps>`
  position: absolute;
  top: 50%;
  right: ${({ hardRight }) => (hardRight ? "0" : "20px")};
  transform: translateY(-50%);

  > * {
    margin-left: 10px;
  }
`;

export default ActionList;
