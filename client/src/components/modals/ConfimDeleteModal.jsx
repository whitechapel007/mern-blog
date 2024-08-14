import { Button, Modal } from "flowbite-react";
import { useDispatch } from "react-redux";
import { closeModal } from "../../app/modal/modalSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";

import { PropTypes } from "prop-types";
const ConfimDeleteModal = ({ showModal, confirmText, onClick }) => {
  const dispatch = useDispatch();
  return (
    <Modal
      show={showModal}
      onClose={() => dispatch(closeModal())}
      popup
      size="md"
    >
      <Modal.Header />

      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />

          <h3 className="mb-5 text-lg text-gray-600 dark:text-gray-400 ">
            Are you sure you want to delete {confirmText} ?
          </h3>

          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={onClick}>
              Yes, i&apos;m sure
            </Button>
            <Button color="gray" onClick={() => dispatch(closeModal())}>
              No, Cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

ConfimDeleteModal.propTypes = {
  showModal: PropTypes.boolean.isRequired,
  confirmText: PropTypes.string,
  onClick: PropTypes.function,
};
export default ConfimDeleteModal;
