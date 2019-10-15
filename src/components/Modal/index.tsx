import * as React from "react";
import styled from "styled-components";
import MUIModal, { ModalProps } from "@material-ui/core/Modal";

interface IProps {
  small?: boolean;
}

const ModalContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 80%;
  ${(props: IProps) => (!props.small ? "min-width: 250px;" : "min-width: 90px")}
  overflow: auto;
  background: #fff;
  border-radius: 5px;
  padding: 15px;
  outline: 0;
  text-align: center;
  word-break: break-all;
`;

const Modal: React.SFC<ModalProps & IProps> = ({
  children,
  small,
  ...modalProps
}) => (
  <MUIModal {...modalProps}>
    <ModalContent small={small}>{children}</ModalContent>
  </MUIModal>
);

export default Modal;
