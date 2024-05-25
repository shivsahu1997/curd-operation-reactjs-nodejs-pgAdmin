import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const ModalPopup = ({ show, handleClose, setShow, setShowData, deleteId }) => {
  const handleDeleteData = async (index) => {
    console.log("id", index);
    try {
      const response = await fetch(
        `http://localhost:5000/studentsDataDelete/${index?.id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setShow(false);
        fetch("http://localhost:5000/studentsData")
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            setShowData(data);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Modal show={show} centered>
        <Modal.Header closeButton onHide={handleClose}>
          <Modal.Title>Confirmation Popup</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure?</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            No
          </Button>
          <Button variant='primary' onClick={() => handleDeleteData(deleteId)}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalPopup;
