import React from 'react'
import { Modal, Button } from "react-bootstrap";
 
const AlertDeleteModal = ({ showModal, hideModal, confirmModal, id, type, message,categoryd, dId}) => {
    return (
        <Modal id="AlertDeleteModal" show={showModal} onHide={hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body><div className="alert alert-danger">{message}</div></Modal.Body>
        <Modal.Footer>
          <Button variant="default" onClick={hideModal}>  Cancel </Button>
          <Button variant="danger" onClick={() => confirmModal(type, id,categoryd, dId) }> Delete </Button>
        </Modal.Footer>
      </Modal>
    )
}
 
export default AlertDeleteModal;