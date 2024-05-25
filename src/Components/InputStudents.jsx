import React, { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const InputStudents = () => {
  const navigate = useNavigate();
  const [disableData, setDisableData] = useState();
  const [resetData, setResetData] = useState();
  const location = useLocation();
  const receivedData = location?.state?.data;

  useEffect(() => {
    if (location?.state?.type === "view") {
      setResetData(location?.state);
      setDisableData(true);
    } else {
      setResetData(location?.state);
      setDisableData(false);
    }
  }, [location?.state]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  console.log("resetData", resetData);

  useEffect(() => {
    if (receivedData) {
      setValue("firstName", receivedData.firstname);
      setValue("lastName", receivedData.lastname);
      setValue("gender", receivedData.gender);
    }
  }, [receivedData]);

  const _onSubmitData = (val) => {
    const postData = {
      firstname: val.firstName,
      lastname: val.lastName,
      gender: val.gender,
    };

    if (resetData?.type === "edit" || resetData?.state?.type === "edit") {
      let studentId = resetData?.state?.data?.id;
      axios
        .put(`http://localhost:5000/studentsDataUpdate/${studentId}`, postData)
        .then((response) => {
          console.log("post data", response.data);
          reset();
          const newLocation = {
            ...location,
            state: {
              ...location.state,
              type: " ",
            },
          };
          setResetData(newLocation);
          handleList();
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      axios
        .post("http://localhost:5000/students", postData)
        .then((response) => {
          console.log("post data", response.data);
          reset();
          const newLocation = {
            ...location,
            state: {
              ...location.state,
              type: " ",
            },
          };
          setResetData(newLocation);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const resetLocationStateData = () => {
    const newLocation = {
      ...location,
      state: {
        ...location.state,
        type: "edit",
      },
    };
    setResetData(newLocation);
  };

  const handleList = () => {
    navigate("/");
  };

  return (
    <Fragment>
      <div className='text-center mt-5'>
        <h2>Students Details</h2>
        <button className='btn btn-secondary mt-2 ' onClick={handleList}>
          Students List
        </button>
      </div>

      <form className='content mt-5' onSubmit={handleSubmit(_onSubmitData)}>
        <div className='form-group'>
          <input
            type='text'
            id={"firstName"}
            placeholder='First Name'
            disabled={disableData}
            className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
            {...register("firstName", {
              required: {
                value: true,
                message: "First name is required",
              },
              pattern: {
                value: /^(?=.*[a-zA-Z])[a-zA-Z\- ]+$/,
                message: "First name can only contain letters",
              },

              maxLength: {
                value: 15,
                message: "Maximum 15 characters",
              },
            })}
          />

          <div className='invalid-feedback'>{errors?.firstName?.message}</div>
        </div>
        <div className='form-group mt-4'>
          <input
            type='text'
            id={"lastName"}
            placeholder='Last Name'
            disabled={disableData}
            className={`form-control   ${errors.lastName ? "is-invalid" : ""}`}
            {...register("lastName", {
              required: {
                value: true,
                message: "Last name is required",
              },
              pattern: {
                value: /^(?=.*[a-zA-Z])[a-zA-Z\- ]+$/,
                message: "Last name can only contain letters",
              },
              maxLength: {
                value: 15,
                message: "Maximum 15 characters",
              },
            })}
          />
          <div className='invalid-feedback'>{errors?.lastName?.message}</div>
        </div>
        <div className='col-sm-12 mt-4'>
          <div className='form-check form-check-inline'>
            <input
              className={`form-check-input   ${
                errors.gender ? "is-invalid" : ""
              }`}
              type='radio'
              value='male'
              disabled={disableData}
              {...register("gender", {
                required: {
                  value: true,
                  message: "This field is required",
                },
              })}
            />
            <label>Male </label>
          </div>

          <div className='form-check form-check-inline'>
            <input
              type='radio'
              value='female'
              disabled={disableData}
              className={`form-check-input   ${
                errors.gender ? "is-invalid" : ""
              }`}
              {...register("gender", {
                required: {
                  value: true,
                  message: "This field is required",
                },
              })}
            />

            <label>Female</label>
          </div>
        </div>
        {(resetData?.type === " " ||
          resetData === null ||
          resetData?.state?.type === " ") && (
          <button type='submit' className='btn btn-success mt-4 '>
            Add
          </button>
        )}{" "}
        {(resetData?.type === "edit" || resetData?.state?.type === "edit") && (
          <button type='submit' className='btn btn-success mt-4 '>
            Update
          </button>
        )}
      </form>

      {resetData?.type === "view" && (
        <button
          className='btn btn-secondary mt-4'
          onClick={() => {
            setDisableData(false);
            resetLocationStateData();
          }}>
          Edit
        </button>
      )}
    </Fragment>
  );
};

export default InputStudents;
