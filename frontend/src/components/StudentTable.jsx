import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import {
  Button,
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Box,
  Flex,
  Stack,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import "../App.css";

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const history = useHistory();

  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const toast = useToast();

  const getStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/student");
      setStudents(response.data.studentData);
      setFilteredStudents(response.data.studentData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewClick = (student) => {
    setSelectedStudent(student);
    onViewOpen();
  };

  const handleEditClick = (student) => {
    setEditStudent({ ...student });
    setIsEditing(true);
    onEditOpen();
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditStudent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/student/${editStudent.rollNumber}`,
        editStudent
      );
      const updatedStudents = students.map((student) =>
        student.rollNumber === editStudent.rollNumber ? response.data : student
      );
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
      onEditClose();
      toast({
        title: "Student updated.",
        description: "The student details have been updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
         position : "top"
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error.",
        description: "An error occurred while updating student details.",
        status: "error",
        duration: 5000,
        isClosable: true,
         position : "top"
      });
    }
  };

  const generateInvoiceContent = (student) => {
    return `
      Name: ${student.studentName}
      Roll Number: ${student.rollNumber}
      Fees: ${student.fees}
      Payment Status: ${student.paymentStatus}
    `;
  };

  const downloadInvoice = (invoiceContent) => {
    const blob = new Blob([invoiceContent], {
      type: "text/plain;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "invoice.txt";
    link.click();
  };

  const invoiceHandler = (student) => {
    if (student.paymentStatus === "Unpaid") {
      const invoiceContent = generateInvoiceContent(student);
      downloadInvoice(invoiceContent);
      toast({
        title: "Invoice Generated",
        description: `Invoice for ${student.studentName} has been generated and downloaded.`,
        status: "success",
        duration: 5000,
        isClosable: true,
         position : "top"
      });
    } else {
      toast({
        title: "Payment Status",
        description: `Payment status is ${student.paymentStatus}.`,
        status: "info",
        duration: 5000,
        isClosable: true,
         position : "top"
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const columns = [
    {
      name: "Student_Name",
      selector: (row) => row.studentName,
    },
    {
      name: "Roll_Number",
      selector: (row) => row.rollNumber,
    },
    {
      name: "Fees",
      selector: (row) => row.fees,
    },
    {
      name: "Payment_Status",
      selector: (row) => row.paymentStatus,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Button colorScheme="blue" size="sm" onClick={() => handleEditClick(row)}>
            Edit
          </Button>
          <Button colorScheme="teal" size="sm" ml={2} onClick={() => handleViewClick(row)}>
            View
          </Button>
          <Button colorScheme="purple" size="sm" ml={2} onClick={() => invoiceHandler(row)}>
            Send Invoice
          </Button>
        </>
      ),
    },
  ];

  const customStyles = {
    header: {
      style: {
        minHeight: "56px",
      },
    },
    headRow: {
      style: {
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        borderTopColor: "#e4e4e4",
        backgroundColor: "#f5f5f5",
      },
    },
    headCells: {
      style: {
        color: "#4a4a4a",
        fontWeight: "bold",
        fontSize: "14px",
        borderBottomWidth: "1px",
        borderBottomColor: "#e4e4e4",
        borderBottomStyle: "solid",
      },
    },
  };

  useEffect(() => {
    getStudents();
  }, []);

  useEffect(() => {
    const resultSet = students.filter((student) => {
      return student.studentName.toLowerCase().match(search.toLowerCase());
    });
    setFilteredStudents(resultSet);
  }, [search]);

  return (
    <>
      <Box className="student-table-container" p={4} w="100%" maxW="1200px" mx="auto">
        <Flex className="header-container" justify="space-between" align="center" mb={4}>
          <Box fontSize={["lg", "xl", "2xl"]} fontWeight="bold">
            Admin Dashboard
          </Box>
          <Button colorScheme="red" onClick={handleLogout}>
            Logout
          </Button>
        </Flex>
        <Box overflowX="auto">
          <DataTable
            columns={columns}
            data={filteredStudents}
            pagination
            selectableRows
            selectableRowsHighlight
            highlightOnHover
            customStyles={customStyles}
            subHeader
            subHeaderComponent={
              <Flex
                flexDirection={["column", "row"]}
                alignItems={["start", "center"]}
                gap={4}
              >
                <Input
                  placeholder="Search here..."
                  size="sm"
                  width={["100%", "auto"]}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </Flex>
            }
          />
        </Box>
      </Box>

      {/* View Student Details Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Student Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedStudent && (
              <div>
                <p>
                  <strong>Name:</strong> {selectedStudent.studentName}
                </p>
                <p>
                  <strong>Roll Number:</strong> {selectedStudent.rollNumber}
                </p>
                <p>
                  <strong>Fees:</strong> {selectedStudent.fees}
                </p>
                <p>
                  <strong>Payment Status:</strong> {selectedStudent.paymentStatus}
                </p>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* Edit Student Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Student</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editStudent && (
              <div>
                <FormControl id="studentName" isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name="studentName"
                    value={editStudent.studentName}
                    onChange={handleEditChange}
                  />
                </FormControl>
                <FormControl id="fees" mt={4} isRequired>
                  <FormLabel>Fees</FormLabel>
                  <Input
                    name="fees"
                    value={editStudent.fees}
                    onChange={handleEditChange}
                  />
                </FormControl>
                <FormControl id="paymentStatus" mt={4} isRequired>
                  <FormLabel>Payment Status</FormLabel>
                  <Input
                    name="paymentStatus"
                    value={editStudent.paymentStatus}
                    onChange={handleEditChange}
                  />
                </FormControl>
                <Button mt={4} colorScheme="teal" onClick={handleEditSubmit}>
                  Save
                </Button>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default StudentTable;
