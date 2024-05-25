import React, { Fragment, useEffect, useState } from "react";
import ModalPopup from "./ModalPopup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRecoilState } from "recoil";
import { allDataState } from "../recoilState";

const ListStudents = () => {
  const navigate = useNavigate();
  // const [showData, setShowData] = useRecoilState(allDataState);
  const [showData, setShowData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [show, setShow] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  console.log("todoList", showData);

  useEffect(() => {
    fetch("http://localhost:5000/studentsData")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setShowData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  console.log("showData", showData);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    showData &&
    showData?.results &&
    showData?.results?.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(showData?.results?.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleView = (index) => {
    const viewData = showData?.results[index];
    if (viewData) {
      navigate("/inputStudentsList", {
        state: { data: viewData, type: "view" },
      });
    }
  };

  const handleEdit = (index) => {
    const editData = showData?.results[index];
    if (editData) {
      navigate("/inputStudentsList", {
        state: { data: editData, type: "edit" },
      });
    }
  };

  const handleDelete = (index) => {
    setShow(true);
    setDeleteId(showData?.results[index]);
  };

  const handleClose = () => {
    setShow(false);
  };

  const getCapitalize = (text) => {
    if (text) {
      const capitalizedText = text.charAt(0).toUpperCase() + text.slice(1);
      return capitalizedText;
    }
  };
  const handleInputChange = async (event) => {
    setSearchQuery(event.target.value);
    let char = event.target.value;
    if (char) {
      const response = await axios.get(
        `http://localhost:5000/studentsDataChar/${char}`
      );
      setShowData(response?.data);
    } else {
      fetch("http://localhost:5000/studentsData")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setShowData(data);
        });
    }
  };

  // const handleSearchData = async (event) => {
  //   setSearchQuery(event.target.value);
  // };

  // const search = async () => {
  //   if (searchQuery) {
  //     const response = await axios.get(
  //       `http://localhost:5000/studentsDataChar/${searchQuery}`
  //     );
  //     setShowData(response.data);
  //   } else {
  //     fetch("http://localhost:5000/studentsData")
  //       .then((response) => {
  //         if (!response.ok) {
  //           throw new Error("Network response was not ok");
  //         }
  //         return response.json();
  //       })
  //       .then((data) => {
  //         setShowData(data?.results);
  //       });
  //   }
  // };

  const handleAddData = () => {
    navigate("/inputStudentsList");
  };

  return (
    <Fragment>
      <div className='text-center mt-4'>
        <h2>Students List</h2>
        <button className='btn btn-secondary mt-2 ' onClick={handleAddData}>
          Add Data
        </button>
      </div>

      <div className='text-center mt-4'>
        <input
          type='text'
          placeholder='Search...'
          value={searchQuery}
          onChange={handleInputChange}
          // onChange={handleSearchData}
        />
        {/* <button onClick={search}>Search</button> */}
      </div>
      <table className='mt-4'>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        {showData && showData?.results?.length > 0 ? (
          <tbody>
            {currentItems?.map((row, index) => (
              <tr key={index}>
                <td>{getCapitalize(row.firstname)}</td>
                <td>{getCapitalize(row.lastname)}</td>
                <td>{getCapitalize(row.gender)}</td>
                <td>
                  <button
                    className='btn btn-primary '
                    onClick={() => handleView(index)}>
                    View
                  </button>
                  <button
                    className='btn btn-secondary mx-1'
                    onClick={() => handleEdit(index)}>
                    Edit
                  </button>
                  <button
                    className='btn btn-danger'
                    onClick={() => handleDelete(index)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <p className='text-center mt-4'>No Record Found!</p>
        )}
      </table>
      {showData?.results?.length >= 10 && (
        <div className='pagination mt-4 d-flex justify-content-center'>
          <button onClick={prevPage} disabled={currentPage === 1}>
            Prev
          </button>
          {Array.from(
            { length: Math.ceil(showData?.results?.length / itemsPerPage) },
            (_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}>
                {index + 1}
              </button>
            )
          )}
          <button
            onClick={nextPage}
            disabled={
              currentPage ===
              Math.ceil(showData?.results?.length / itemsPerPage)
            }>
            Next
          </button>
        </div>
      )}

      {show && (
        <ModalPopup
          show={show}
          handleClose={handleClose}
          setShow={setShow}
          setShowData={setShowData}
          deleteId={deleteId}
        />
      )}
    </Fragment>
  );
};

export default ListStudents;
