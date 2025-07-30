export const uploadToCloudinary = async (pics: any) => {

  const cloud_name = "dcn8rcg4j"
  const upload_preset = "TanPhat"
  if (pics) {

    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", upload_preset);
    // data.append("cloud_name", cloud_name);

    const res = await
      fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
        method: "post",
        body: data,
      })

    const fileData = await res.json();
    console.log("url : ", fileData);
    return fileData.url

  } else {
    console.log("error");
  }
};