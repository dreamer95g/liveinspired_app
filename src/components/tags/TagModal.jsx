import React, { useState, useEffect } from "react";
import { Modal, Button, Input, notification } from "antd";

export const TagModal = ({
  action,
  show,
  setShowModal,
  setTagName,
  tag,
  saveTag,
  modifyTag,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setShowModal(false);

    if (action === "save") {
      if (name !== "") {
        saveTag(name);
        setName("");
      } else {
        openNotification("warning", "Atencion", "Llene la Etiqueta!!");
      }
    }

    if (action === "update") {
      if (name !== "") {
        modifyTag(name);
        setName("");
      } else {
        openNotification("warning", "Atencion", "Llene la Etiqueta!!");
      }
    }
  };

  // METODO QUE LANZA LAS NOTIFICACIONES
  const openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  const handleCancel = () => {
    setName("");
    setTagName("");
    setIsModalVisible(false);
    setShowModal(false);
  };

  const handleInputNameChange = ({ target }) => {
    setName(target.value);
    setTagName(name);
  };

  useEffect(() => {
    if (action !== undefined) {
      if (action === "save") {
        setTitle("Agregar Etiqueta");
      } else {
        setTitle("Editar Etiqueta");
        setName(tag);
      }
    }
  }, [action]);

  useEffect(() => {
    if (show !== undefined) {
      if (show) {
        if (action === "update") {
          setTitle("Editar Etiqueta");
          setName(tag);
        }

        showModal();
      } else {
        setIsModalVisible(false);
      }
    }
  }, [show]);

  return (
    <>
      {/* <Button type="primary" onClick={showModal}>
        Open Modal
      </Button> */}
      <Modal
        title={title}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            style={{ borderRadius: "100px" }}
          >
            {action === "save" ? `Agregar` : `Editar`}
          </Button>,
          <Button
            key="back"
            type="danger"
            onClick={handleCancel}
            style={{ borderRadius: "100px" }}
          >
            Cancelar
          </Button>,
        ]}
      >
        <Input
          placeholder="Etiqueta"
          value={name}
          onChange={handleInputNameChange}
          onPressEnter={handleOk}
          style={{ borderRadius: "10px" }}
        />
      </Modal>
    </>
  );
};
