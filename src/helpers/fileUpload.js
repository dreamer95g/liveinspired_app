import axios from "axios";
import { url_base } from "../config/app";

export const fileUpload = async (file) => {

  let image = null;

  const token  = localStorage.getItem("_token");

  const url = `${url_base}api/upload`;

  const formData = new FormData();
  formData.append("photo", file);

  const headers = {
    "Authorization": `Bearer ${token}`
  }

  try {
    await axios({
      method: 'post',
      url: url,
      headers: headers,
      data: formData,
    }).then(data => {
      const { data: img } = data;     
      image = img;
});
  } catch (error) {
    return error.message
  }
  return image;
}