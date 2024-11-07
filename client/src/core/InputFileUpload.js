import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import { isAuth } from "../auth/helpers";
import { useState, useEffect } from "react";

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
    console.log(event);
    const selectedFile = event.target.files[0];
    console.log(selectedFile);

    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
      if (fileExtension !== "pdf") {
        alert("Only PDF files are allowed.");
      } else {
        setFile(selectedFile);
        uploadFile(selectedFile);
      }
    } else {
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

  const getFile = async (event) => {
    console.log(event);
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
        <VisuallyHiddenInput
          type="file"
          // accept="application/pdf"
          onChange={handleFileChange}
        />
      </Button>
    </Box>
  );
}
