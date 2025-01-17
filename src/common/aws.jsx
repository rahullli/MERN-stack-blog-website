import axios from "axios";

// This will upload the img to AWS S3
export const uploadImage = async(img) => {
  let imgUrl = null;
  axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/get-upload-url")
    .then(async ( { data : { uploadURL }}) =>{
        await axios({
            method: 'PUT',
            url: uploadURL,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: img
        })
        .then(({})=>{
            imgUrl = uploadURL.split('?')[0];
        })
        .catch((err)=>{
            console.log(err);
        })
    })  

    return imgUrl;
};
