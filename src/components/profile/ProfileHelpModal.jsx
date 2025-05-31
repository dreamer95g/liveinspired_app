import React, { useState, useEffect } from "react";
import { Modal, Button, Input, notification } from "antd";
import { url_base } from "../../config/app";

export const ProfileHelpModal = ({ showHelpModal, setShowHelpModal }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [name, setName] = useState("");
  const [title, setTitle] = useState(
    `Live Inspired ${new Date().getFullYear()}`
  );

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setShowHelpModal(false);
  };

  // METODO QUE LANZA LAS NOTIFICACIONES
  const openNotification = (type, message, description,placement) => {
    notification[type]({
      message: message,
      description: description,
      placement:placement
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setShowHelpModal(false);
  };

  const handleInputNameChange = ({ target }) => {
    setName(target.value);
    setCategoryName(name);
  };

  useEffect(() => {
    if (showHelpModal) {
      showModal();
    }
  }, [showHelpModal]);

  return (
    <>
      <Modal
        title={title}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <div>
            <h1 className="text-md text-center">
              Duda o Sugerencia a:{" "}
              <a className="text-blue-700 hover:underline hover:text-blue-500">
                gabry95g@gmail.com
              </a>
            </h1>
          </div>,
        ]}
        style={{ textAlign: "center" }}
      >
        <div>
          <img
            className="w-32 h-32 mx-auto content-center my-auto rounded-full cursor-pointer"
            src={`${url_base}assets/images/logo.png`}
            alt="brand"
          />
          {/* <hr className="my-4 "></hr> */}
        </div>
      </Modal>
    </>
  );
};
