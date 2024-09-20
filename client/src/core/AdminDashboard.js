import React, { useState } from "react";
import { styled } from "@mui/system";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import {
  Close as CloseIcon,
  CloudDownload as CloudDownloadIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
// import { getData } from "../../../server/controllers/user";
import { useEffect } from "react";
import axios from "axios";

const PREFIX = "MuiTable";

const classes = {
  table: `${PREFIX}-table`,
  lightRow: `${PREFIX}-lightRow`,
  darkRow: `${PREFIX}-darkRow`,
  iconButton: `${PREFIX}-iconButton`,
  search: `${PREFIX}-search`,
  paginationContainer: `${PREFIX}-pagination-container`,
  paginationButton: `${PREFIX}-pagination-button`,
  paginationActive: `${PREFIX}-pagination-active`,
};

const Root = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: "200vh",
  padding: theme.spacing(7),
  marginLeft: "15px",
  [`& .${classes.table}`]: {
    minWidth: 650,
  },
  [`& .${classes.lightRow}`]: {
    backgroundColor: "#F1F3F6",
  },
  [`& .${classes.darkRow}`]: {
    backgroundColor: "#E4E5E6",
  },
  [`& .${classes.iconButton}`]: {
    padding: theme.spacing(1),
  },
  [`& .${classes.paginationContainer}`]: {
    marginTop: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
  },
  [`& .${classes.paginationButton}`]: {
    margin: "0 5px",
    padding: "5px 10px",
    border: "1px solid #ccc",
    cursor: "pointer",
    backgroundColor: "#E4E5E6",
    "&:hover": {
      backgroundColor: "#ddd",
    },
  },
  [`& .${classes.paginationActive}`]: {
    fontWeight: "bold",
    backgroundColor: "#F1F3F6",
  },
}));

const TableToolbar = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  marginBottom: theme.spacing(2),
  [`& .${classes.search}`]: {
    marginLeft: "10px",
    marginBottom: "50px",
  },
}));

const createData = (
  rollNumber,
  aadhar,
  pan,
  bankPassbook,
  photo,
  ssc,
  inter,
  f11,
  f12,
  f21,
  f22,
  f31,
  f32,
  f41,
  f42,
  resume
) => {
  return {
    rollNumber,
    aadhar,
    pan,
    bankPassbook,
    photo,
    ssc,
    inter,
    f11,
    f12,
    f21,
    f22,
    f31,
    f32,
    f41,
    f42,
    resume,
  };
};

// const data = [
//   //   createData(
//   //     "21B81A1201",
//   //     true,
//   //     false,
//   //     true,
//   //     true,
//   //     false,
//   //     true,
//   //     true,
//   //     false,
//   //     true,
//   //     true,
//   //     false,
//   //     false,
//   //     true,
//   //     false,
//   //     true
//   //   ),
//   //   createData(
//   //     "21B81A1202",
//   //     true,
//   //     true,
//   //     true,
//   //     true,
//   //     false,
//   //     true,
//   //     false,
//   //     true,
//   //     false,
//   //     true,
//   //     true,
//   //     true,
//   //     false,
//   //     true,
//   //     false
//   //   ),
//   //   createData(
//   //     "21B81A1203",
//   //     true,
//   //     true,
//   //     true,
//   //     false,
//   //     true,
//   //     true,
//   //     false,
//   //     true,
//   //     false,
//   //     true,
//   //     true,
//   //     true,
//   //     false,
//   //     true,
//   //     false
//   //   ),
//   //   createData(
//   //     "21B81A1204",
//   //     true,
//   //     true,
//   //     true,
//   //     false,
//   //     true,
//   //     true,
//   //     false,
//   //     true,
//   //     false,
//   //     true,
//   //     true,
//   //     true,
//   //     false,
//   //     true,
//   //     false
//   //   ),
//   //   createData(
//   //     "21B81A1205",
//   //     true,
//   //     true,
//   //     true,
//   //     true,
//   //     false,
//   //     true,
//   //     false,
//   //     true,
//   //     false,
//   //     true,
//   //     true,
//   //     true,
//   //     false,
//   //     true,
//   //     false
//   //   ),
//   //   createData(
//   //     "21B81A1206",
//   //     true,
//   //     true,
//   //     true,
//   //     true,
//   //     false,
//   //     true,
//   //     false,
//   //     true,
//   //     false,
//   //     true,
//   //     true,
//   //     true,
//   //     false,
//   //     true,
//   //     false
//   //   ),
//   //   // Add remaining rows as needed...
// ];

const labels = [
  "Aadhar",
  "PAN",
  "BankPassbook",
  "PassportSize_Photo",
  "SSC",
  "Intermediate",
  "1-1 Memo",
  "1-2 Memo",
  "2-1 Memo",
  "2-2 Memo",
  "3-1 Memo",
  "3-2 Memo",
  "4-1 Memo",
  "4-2 Memo",
  "Resume",
];

const MuiTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  let [filteredData, setFilteredData] = useState([]);
  // let [filenames, setFileNames] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/getData`
        );
        console.log(response);
        storeUsers(response.data.users, searchQuery);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);
  const storeUsers = (response, searchQuery) => {
    console.log(searchQuery);
    response.forEach((user) => {
      const email = user.email;
      const rollNo = email.substring(0, 10);
      const files = user.files;
      const myLabels = [];
      let labls = {};
      let fileNames = [];
      files.forEach((file) => {
        myLabels.push(file.label);
        fileNames.push(file.fileName);
      });
      // setFileNames([...fileNames]);
      // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      // console.log(fileNames);
      // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      labels.forEach((label) => {
        if (myLabels.includes(label)) {
          labls = { ...labls, [label]: true };
        }
      });
      // users.push({ rollNo: rollNo, myFiles: labls });
      // users.push({ rollNo: rollNo, myFiles: labls, filenames: fileNames });
      users.push({ rollNo: rollNo, myFiles: files, labls: labls });
      setUsers([...users]);
      setFilteredData([...users]);
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      console.log(users);
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

      // users.map((row, index) => {
      //   console.log(row);
      //   console.log(".............................");
      //   const ind = row.myFiles.find((file) => file.label === "Resume");
      //   console.log(ind);
      //   console.log(".............................");
      // });
    });

    // console.log(filteredData);
  };

  // const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 10; // Number of rows per page

  const handleSearchChange = (event) => {
    console.log(event);
    setSearchQuery(event.target.value);
    setPage(0); // Reset page when search query changes
    console.log(searchQuery);
    filteredData = users.filter((row) => {
      console.log(row);
      return row.rollNo.includes(searchQuery);
    });

    setFilteredData([...filteredData]);
    console.log(filteredData);
  };

  // const filteredData = users.filter((row) => {
  //   console.log(row);
  //   return row.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
  // });

  // console.log(filteredData);

  const totalPages = Math.ceil(users.length / rowsPerPage);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const getFileNameByLabel = (files, label) => {
    const file = files.find((f) => f.label === label);
    return file ? file.fileName : null;
  };

  const getFile = async (event) => {
    console.log("..........................");
    console.log(event);
    console.log("..........................");
    let user;
    // if (isAuth()) {
    //   user = isAuth();
    // }
    console.log(user);
    window.open(`http://localhost:8000/files/${event}`, "_blank", "noreferer");
  };
  const renderCellContent = (row, label, fileUploaded) => {
    let fname;
    if (fileUploaded) {
      console.log(row.myFiles);
      fname = getFileNameByLabel(row.myFiles, label);
    }
    return fileUploaded ? (
      <IconButton
        className={classes.iconButton}
        color="primary"
        onClick={() => getFile(fname)}
      >
        <CloudDownloadIcon />
      </IconButton>
    ) : (
      <IconButton
        className={classes.iconButton}
        color="error"
        onClick={() => alert("File not uploaded.")}
      >
        <CloseIcon />
      </IconButton>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) {
      return null;
    }

    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <Button
          key={i}
          className={`${classes.paginationButton} ${
            i === page ? classes.paginationActive : ""
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i + 1}
        </Button>
      );
    }
    return <div className={classes.paginationContainer}>{pages}</div>;
  };

  return (
    <Root>
      <TableToolbar>
        <TextField
          className={classes.search}
          label="Search by Roll Number"
          variant="outlined"
          // size="small"
          color="primary"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: <SearchIcon />,
          }}
        />
      </TableToolbar>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#E4E5E6" }}>
              <TableCell align="center">Roll Number</TableCell>
              <TableCell align="center">Aadhar Card</TableCell>
              <TableCell align="center">Pan Card</TableCell>
              <TableCell align="center">Bank Passbook</TableCell>
              <TableCell align="center">Photo</TableCell>
              <TableCell align="center">SSC</TableCell>
              <TableCell align="center">Inter</TableCell>
              <TableCell align="center">1-1</TableCell>
              <TableCell align="center">1-2</TableCell>
              <TableCell align="center">2-1</TableCell>
              <TableCell align="center">2-2</TableCell>
              <TableCell align="center">3-1</TableCell>
              <TableCell align="center">3-2</TableCell>
              <TableCell align="center">4-1</TableCell>
              <TableCell align="center">4-2</TableCell>
              <TableCell align="center">Resume</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row, index) => (
              <TableRow
                key={row.rollNo}
                className={index % 2 === 0 ? classes.lightRow : classes.darkRow}
              >
                <TableCell component="th" scope="row" align="center">
                  {row.rollNo}
                </TableCell>
                <TableCell align="center">
                  {renderCellContent(row, "Aadhar", row.labls.Aadhar)}
                </TableCell>
                <TableCell align="center">
                  {renderCellContent(row, "PAN", row.labls.PAN)}
                </TableCell>
                <TableCell align="center">
                  {renderCellContent(
                    row,
                    "BankPassbook",
                    row.labls.BankPassbook
                  )}
                </TableCell>
                <TableCell align="center">
                  {renderCellContent(
                    row,
                    "PassportSize_Photo",
                    row.labls.PassportSize_Photo
                  )}
                </TableCell>
                <TableCell align="center">
                  {renderCellContent(row, "SSC", row.labls.SSC)}
                </TableCell>
                <TableCell align="center">
                  {renderCellContent(
                    row,
                    "Intermediate",
                    row.labls.Intermediate
                  )}
                </TableCell>
                <TableCell align="center">
                  {renderCellContent(row, "1-1 Memo", row.labls["1-1 Memo"])}
                </TableCell>
                <TableCell align="center">
                  {renderCellContent(row, "1-2 Memo", row.labls["1-2 Memo"])}
                </TableCell>
                <TableCell align="center">
                  {renderCellContent(row, "2-1 Memo", row.labls["2-1 Memo"])}
                </TableCell>
                <TableCell align="center">
                  {renderCellContent(row, "2-2 Memo", row.labls["2-2 Memo"])}
                </TableCell>
                <TableCell align="center">
                  {renderCellContent(row, "3-1 Memo", row.labls["3-1 Memo"])}
                </TableCell>
                <TableCell align="center">
                  {renderCellContent(row, "3-2 Memo", row.labls["3-2 Memo"])}
                </TableCell>
                <TableCell align="center">
                  {renderCellContent(row, "4-1 Memo", row.labls["4-1 Memo"])}
                </TableCell>
                <TableCell align="center">
                  {renderCellContent(row, "4-2 Memo", row.labls["4-2 Memo"])}
                </TableCell>
                <TableCell align="center">
                  {renderCellContent(row, "Resume", row.labls.Resume)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* <TableBody>
            <p>Hello</p>
          </TableBody> */}
        </Table>
      </TableContainer>
      {renderPagination()}
    </Root>
  );
};

export default MuiTable;
