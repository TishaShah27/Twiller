import React, { useState } from "react";
import { Box, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import TextField from "@mui/material/TextField";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./Editprofile.css";
import { useTranslation } from "react-i18next";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 8,
};

function Editchild({ dob, setdob }) {
  const [open, setopen] = useState(false);
  const handleopen = () => {
    setopen(true);
  };
  const handleclose = () => {
    setopen(false);
  };
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <div className="birthdate-section" onClick={handleopen}>
        <text>{t("edit")}</text>
      </div>
      <Modal
        hideBackdrop
        open={open}
        onClose={handleclose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-descriptiom"
      >
        <Box sx={{ ...style, width: 300, height: 300 }}>
          <div className="text">
            <h2>{t("edit_date_of_birth")}</h2>
            <p>
              {t("dob_change_warning_line1")}
              <br />
              {t("dob_change_warning_line2")}
            </p>
            <input type="date" onChange={(e) => setdob(e.target.value)} />
            <button
              className="e-button"
              onClick={() => {
                setopen(false);
              }}
            >
              {t("Cancel")}
            </button>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

const Editprofile = ({ user, loggedinuser }) => {
  const [name, setname] = useState("");
  const [bio, setbio] = useState("");
  const [location, setlocation] = useState("");
  const [website, setwebsite] = useState("");
  const [open, setopen] = useState(false);
  const [dob, setdob] = useState("");
  const { t } = useTranslation();

  const handlesave = () => {
    const editinfo = {
      name,
      bio,
      location,
      website,
      dob,
    };
    fetch(`http://localhost:5000/userupdate/${user?.email}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(editinfo),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("done", data);
      });
  };

  return (
    <div>
      <button
        onClick={() => {
          setopen(true);
        }}
        className="Edit-profile-btn"
      >
        {t("Edit Profile")}
      </button>

      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-descriptiom"
      >
        <Box style={style} className="modal">
          <div className="header">
            <IconButton onClick={() => setopen(false)}>
              <CloseIcon />
            </IconButton>
            <h2 className="header-title">{t("Edit Profile")}</h2>
            <button className="save-btn" onClick={handlesave}>
              {t("Save")}
            </button>
          </div>
          <form className="fill-content">
            <TextField
              className="text-field"
              fullWidth
              label={t("Name")}
              id="fullWidth"
              variant="filled"
              onChange={(e) => setname(e.target.value)}
              deafultValue={loggedinuser?.name ? loggedinuser.name : ""}
            />
            <TextField
              className="text-field"
              fullWidth
              label={t("Bio")}
              id="fullWidth"
              variant="filled"
              onChange={(e) => setbio(e.target.value)}
              deafultValue={loggedinuser?.bio ? loggedinuser.bio : ""}
            />
            <TextField
              className="text-field"
              fullWidth
              label={t("Location")}
              id="fullWidth"
              variant="filled"
              onChange={(e) => setlocation(e.target.value)}
              deafultValue={
                loggedinuser?.location ? loggedinuser.location : ""
              }
            />
            <TextField
              className="text-field"
              fullWidth
              label={t("Website")}
              id="fullWidth"
              variant="filled"
              onChange={(e) => setwebsite(e.target.value)}
              deafultValue={
                loggedinuser?.website ? loggedinuser.website : ""
              }
            />
          </form>
          <div className="birthdate-section">
            <p>{t("Birth Date")}</p>
            <p>.</p>
            <Editchild dob={dob} setdob={setdob} />
          </div>
          <div className="last-section">
            {loggedinuser?.dob ? (
              <h2>{loggedinuser?.dob}</h2>
            ) : (
              <h2>{dob ? dob : t("Add Your DOB")}</h2>
            )}
            <div className="last-btn">
              <h2>{t("Switch to Professional")}</h2>
              <ChevronRightIcon />
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Editprofile;
