import * as React from "react";
import styled from "styled-components";
import MUIModal, { ModalProps } from "@material-ui/core/Modal";

const ModalContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 5px;
  padding: 15px;
  outline: 0;
  text-align: center;
  word-break: break-all;
`;

const Modal: React.SFC<ModalProps> = ({ children, ...modalProps }) => (
  <MUIModal {...modalProps}>
    <ModalContent>{children}</ModalContent>
  </MUIModal>
);

export default Modal;
