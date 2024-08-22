import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import { isAuth } from "../auth/helpers";
import { useState, useEffect } from "react";

// const express = require("express");
// const router = express.Router();
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function InputFileUpload({ onChange, label }) {
  const [file, setFile] = React.useState(null);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  let email = isAuth().email;

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/getFiles/${email}`
        );

        if (response.data && response.data.files) {
          setUploadedFiles(response.data.files);
          const uploadedFile = response.data.files.find(
            (file) => file.label === label
          );

          if (uploadedFile) {
            setFile({ name: uploadedFile.fileName });
          }
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFiles();
  }, [email, label]);

  const handleFileChange = (event) => {
    // console.log(event);
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
    if (selectedFile) {
      setFile(selectedFile);
      // console.log(file);
      uploadFile(selectedFile);
    }
  };
  const uploadFile = async (file) => {
    console.log(label);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    let user;
    if (isAuth()) {
      user = isAuth();
    }
    formData.append("label", label);
    formData.append("user", JSON.stringify(user));
    // console.log(formData);
    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/upload`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        console.log("success");
      })
      .catch((err) => {
        console.log("Some error");
      });
  };

  // const uploadFile = async (file) => {
  //   console.log(file);
  //   const fileName = file.name;
  //   console.log("-----------------------------");
  //   console.log(fileName);
  //   console.log("-----------------------------");
  //   let user;
  //   if (isAuth()) {
  //     user = isAuth();
  //   }
  //   console.log(user);
  //   await axios({
  //     method: "POST",
  //     url: `${process.env.REACT_APP_API}/upload`,
  //     data: { user, fileName },
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   })
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const getFile = async (event) => {
    // console.log("..........................");
    // console.log(event);
    // console.log("..........................");
    let user;
    if (isAuth()) {
      user = isAuth();
    }
    console.log(user);
    window.open(
      `http://localhost:8000/files/${event.name}`,
      "_blank",
      "noreferer"
    );
    // await axios({
    //   method: "GET",
    //   // url: `${process.env.REACT_APP_API}/getFile/${user.email}`,
    //   // data: user,
    // })
    //   .then((res) => {
    //     console.log("RESPONSE IS :=");
    //     console.log(res.data.files);
    //     // window.open(
    //     //   `http://localhost:8000/files/${event.name}`,
    //     //   "_blank",
    //     //   "noreferer"
    //     // );
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  return (
    <Box textAlign="center">
      {file && (
        <Box
          mb={2}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="subtitle1"
            noWrap
            sx={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              display: "block",
              marginRight: 2,
              maxWidth: "200px",
            }}
          >
            {file.name}
          </Typography>
          {/* <Button */}
          <IconButton
            size="small"
            onClick={() => getFile(file)}
            sx={{
              backgroundColor: "#1976d2",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            <VisibilityIcon />
          </IconButton>
          {/* </Button> */}
        </Box>
      )}
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        sx={{
          backgroundColor: "#1976d2",
          "&:hover": {
            backgroundColor: "#1565c0",
          },
        }}
      >
        {file ? "Re-upload" : "Upload file"}
        <VisuallyHiddenInput type="file" onChange={handleFileChange} />
      </Button>
    </Box>
  );
}

// import * as React from "react";
// import { styled } from "@mui/material/styles";
// import Button from "@mui/material/Button";
// import IconButton from "@mui/material/IconButton";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import PropTypes from "prop-types";
// import axios from "axios";

// const VisuallyHiddenInput = styled("input")({
//   clip: "rect(0 0 0 0)",
//   clipPath: "inset(50%)",
//   height: 1,
//   overflow: "hidden",
//   position: "absolute",
//   bottom: 0,
//   left: 0,
//   whiteSpace: "nowrap",
//   width: 1,
// });

// export default function InputFileUpload({ label }) {
//   const [file, setFile] = React.useState(null);
//   const [uploaded, setUploaded] = React.useState(false);

//   const uploadFile = async (event) => {
//     event.preventDefault();
//     console.log("Inside upload file function");
//     console.log(file);
//     const email_id = "test@example.com";
//     const formData = new FormData();
//     formData.append("email_id", email_id);
//     formData.append("file", file);
//     console.log(formData);
//     try {
//       const result = await axios.post(
//         "https://localhost:3000/dashboard",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             // 'Authorization': Bearer ${token}
//           },
//         }
//       );
//       console.log(result);
//       setUploaded(true); // Set uploaded to true after successful upload
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     }
//   };

//   // const handleDownload = async () => {
//   //   const email_id = 'test@example.com'; // Replace with the actual email id you want to test
//   //   try {
//   //     const response = await axios.get(http://localhost:5000/api/documents/download/${email_id}/${label}, {
//   //       responseType: 'blob',
//   //     });

//   //     const url = window.URL.createObjectURL(new Blob([response.data]));
//   //     const a = document.createElement('a');
//   //     a.href = url;
//   //     a.download = file.name;
//   //     document.body.appendChild(a);
//   //     a.click();
//   //     window.URL.revokeObjectURL(url);
//   //     document.body.removeChild(a);
//   //   } catch (error) {
//   //     console.error('Error downloading file:', error);
//   //   }
//   // };

//   return (
//     <form className="formStyle" onSubmit={uploadFile}>
//       <Box textAlign="center">
//         {file && (
//           <Box
//             mb={2}
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <Typography
//               variant="subtitle1"
//               noWrap
//               sx={{
//                 textOverflow: "ellipsis",
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 display: "block",
//                 marginRight: 2,
//                 maxWidth: "200px",
//               }}
//             >
//               {file.name}
//             </Typography>
//             <IconButton
//               size="small"
//               // onClick={handleDownload}
//               sx={{
//                 backgroundColor: "#1976d2",
//                 color: "#fff",
//                 "&:hover": {
//                   backgroundColor: "#1565c0",
//                 },
//               }}
//               disabled={!uploaded} // Disable the download button until the file is uploaded
//             >
//               <ArrowDownwardIcon />
//             </IconButton>
//           </Box>
//         )}
//         <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
//           <Button
//             component="label"
//             variant="contained"
//             sx={{
//               backgroundColor: "#1976d2",
//               "&:hover": {
//                 backgroundColor: "#1565c0",
//               },
//             }}
//           >
//             Choose File
//             <VisuallyHiddenInput
//               type="file"
//               onChange={(e) => {
//                 setFile(e.target.files[0]);
//                 setUploaded(false); // Reset uploaded state when a new file is chosen
//               }}
//             />
//           </Button>
//           <Button
//             type="submit"
//             variant="contained"
//             startIcon={<CloudUploadIcon />}
//             sx={{
//               backgroundColor: "#1976d2",
//               "&:hover": {
//                 backgroundColor: "#1565c0",
//               },
//             }}
//             disabled={!file}
//           >
//             Upload
//           </Button>
//         </Box>
//       </Box>
//     </form>
//   );
// }

// InputFileUpload.propTypes = {
//   onChange: PropTypes.func.isRequired,
//   label: PropTypes.string.isRequired,
// };
