import { url_base } from "../../config/app";
import React, { useState, useEffect } from "react";
import { Upload, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export const ProfilePhotoInput = ({ setPhoto, action, selectedImage }) => {
  const urlBase = url_base;

  const initialState = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
  };

  const [state, setState] = useState(initialState);

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCancel = () =>
    setState({ previewVisible: false, fileList: fileList });

  const handlePreview = async (file) => {
    if (file.preview === undefined && file.url === undefined) {
      file.preview = await getBase64(file.originFileObj);

      setState({
        previewImage: file.preview,
        previewVisible: true,
        previewTitle: "Foto",
        fileList: [file],
      });
    } else if (file.preview !== undefined && file.url === undefined) {
      setState({
        previewImage: file.preview,
        previewVisible: true,
        previewTitle: "Foto",
        fileList: [file],
      });
    } else if (file.url !== undefined) {
      setState({
        previewImage: file.url,
        previewVisible: true,
        previewTitle: "Foto",
        fileList: [file],
      });
    }
  };

  const handleChange = ({ fileList }) => {
    if (fileList !== undefined && fileList.length !== 0) {
      setState({ fileList });

      const { originFileObj: file } = fileList[0];

      //console.table(file);

      setPhoto(file);
    }

    setState({ fileList });
  };

  const setImageToFileList = (selectedImage) => {
    if (selectedImage !== undefined) {
      const { id, name } = selectedImage;

      // const url = `${url_base}assets/${name}`;
      const url = name;

      let elem = {
        uid: "-1",
        name: "",
        status: "done",
        url: url,
      };

      setState({ fileList: [elem] });

      //console.table(state.fileList);
    }
  };

  const { previewVisible, previewImage, previewTitle, fileList } = state;

  const statusDone = () => {
    if (fileList !== undefined) {
      const count = fileList.length;
      if (count !== 0) fileList[0].status = "done";
    }
  };

  useEffect(() => {
    statusDone();
  }, [state]);

  useEffect(() => {
    if (action === "update" && selectedImage !== undefined) {
      setImageToFileList(selectedImage);
    }
  }, [selectedImage]);

  const uploadButton = (
    <div>
      {/* <PlusOutlined />
      <div style={{ marginTop: 8 }}>Foto</div> */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </div>
  );

  return (
    <div>
      <Upload
        action=""
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        style={{ borderRadius: "10px" }}
      >
        {fileList !== undefined && fileList.length >= 1 ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
        style={{ borderRadius: "10px" }}
      >
        <img
          alt="example"
          style={{ width: "100%", height: "400px", borderRadius: "10px" }}
          src={previewImage}
        />
      </Modal>
    </div>
  );
};
