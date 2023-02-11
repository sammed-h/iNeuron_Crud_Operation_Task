import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CrudComponent.css";
const CrudComponent = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [successMessage, setSuccessMessage] = useState();
  const [userId, setUserId] = useState();

  const [errorMessage, setErrorMessage] = useState({
    firstName: "",
    lastName: "",
    age: "",
    phoneNumber: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;
    let errorMessage = {};
    if (firstName === "" || firstName.length > 25) {
      isValid = false;
      errorMessage.firstName =
        "First name cannot be more than 25 characters long.";
    }

    if (lastName === "" || lastName.length > 25) {
      isValid = false;
      errorMessage.lastName =
        "Last name cannot be more than 25 characters long.";
    }

    if (age === "" || age.toString().length > 3) {
      isValid = false;
      errorMessage.age = "Age must be a number with 3 digits or less.";
    }

    if (phoneNumber.toString().length !== 10) {
      isValid = false;
      errorMessage.phoneNumber = "Phone number must be 10 digits long.";
    }

    const inputPayload = {
      firstName,
      lastName,
      age,
      phoneNumber,
    };
    axios
      .post(
        "https://blue-journalist-bbrpv.ineuron.app:4000/user/create",
        inputPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });

    if (isValid) {
      setData(
        selectedIndex === -1
          ? [...data, { firstName, lastName, age, phoneNumber }]
          : data.map((d, index) =>
              index === selectedIndex
                ? { firstName, lastName, age, phoneNumber }
                : d
            )
      );
      if (selectedIndex === -1) {
        setSuccessMessage("Data Added SuccessFully");
      } else {
        setSuccessMessage("Data Updated SuccessFully");
      }
      setFirstName("");
      setLastName("");
      setAge("");
      setPhoneNumber("");
      setSelectedIndex(-1);
      setShowModal(false);
      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } else {
      setErrorMessage(errorMessage);
    }
  };

  const handleDelete = (index, id) => {
    setData(data.filter((item, i) => i !== index));
    axios
      .delete(`https://blue-journalist-bbrpv.ineuron.app:4000/user/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = (index, id) => {
    const editInputPayload = {
      firstName,
      lastName,
      phoneNumber,
      age,
    };
    axios
      .patch(`https://blue-journalist-bbrpv.ineuron.app:4000/user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        editInputPayload,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
    setUserId(id);
    setSelectedIndex(index);
    setFirstName(data[index].firstName);
    setLastName(data[index].lastName);
    setAge(data[index].age);
    setPhoneNumber(data[index].phoneNumber);
    setShowModal(true);
  };

  useEffect(() => {
    const getUsers = async () => {
      const result = await axios(
        "https://blue-journalist-bbrpv.ineuron.app:4000/users"
      );
      setData(result.data.data);
    };
    getUsers();
  }, []);
  return (
    <div className="container">
      {successMessage && (
        <div className="success-Msg-overlay">
          <div className="success-Msg">{successMessage}</div>
        </div>
      )}
      <button className="add-button" onClick={() => setShowModal(true)}>
        Add Data
      </button>
      {showModal && (
        <div className="modal-overlay">
          <form className="modal" onSubmit={handleSubmit}>
            <h2>{selectedIndex === -1 ? "Add" : "Edit"} Data</h2>
            <div className="input-group">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
              {errorMessage.firstName && (
                <p style={{ color: "red", marginTop: "5px" }}>
                  {errorMessage.firstName}
                </p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
              {errorMessage.lastName && (
                <p style={{ color: "red", marginTop: "5px" }}>
                  {errorMessage.lastName}
                </p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="age">Age:</label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={(event) => setAge(event.target.value)}
              />
              {errorMessage.age && (
                <p style={{ color: "red", marginTop: "5px" }}>
                  {errorMessage.age}
                </p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="phoneNumber">Phone Number:</label>
              <input
                type="number"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
              />

              {errorMessage.phoneNumber && (
                <p style={{ color: "red", marginTop: "5px" }}>
                  {errorMessage.phoneNumber}
                </p>
              )}
            </div>

            {selectedIndex === -1 ? (
              <button type="submit">Submit</button>
            ) : (
              <button type="submit">Update</button>
            )}

            <button className="cancel-Btn" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
      <table className="data-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, index) => (
            <tr key={index}>
              <td>{d.firstName}</td>
              <td>{d.lastName}</td>
              <td>{d.age}</td>
              <td>{d.phoneNumber}</td>
              <td>
                <button
                  className="edit-Btn"
                  onClick={() => handleEdit(index, d._id)}
                >
                  Edit
                </button>
                <button
                  className="delete-Btn"
                  onClick={() => handleDelete(index, d._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CrudComponent;
