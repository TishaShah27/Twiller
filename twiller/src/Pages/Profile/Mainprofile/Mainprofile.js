import React, { useState, useEffect } from "react";
import Post from "../Posts/posts";
import { useNavigate } from "react-router-dom";
import "./Mainprofile.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak";
import LockResetIcon from "@mui/icons-material/LockReset";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import AddLinkIcon from "@mui/icons-material/AddLink";
import Editprofile from "../Editprofile/Editprofile";
import useLoggedinuser from "../../../hooks/useLoggedinuser";
import AvatarCustomization from "../Avatar/avatar";
import Switch from "@mui/material/Switch";
import { useTranslation } from "react-i18next";
import Skeleton from "@mui/material/Skeleton";

const Mainprofile = ({ user }) => {
  const navigate = useNavigate();
  const [isUploadingCover, setUploadingCover] = useState(false);
  const [isUploadingProfile, setUploadingProfile] = useState(false);
  const [loggedinuser, setLoggedinuser] = useLoggedinuser();
  const username = user?.email?.split("@")[0];
  const [post] = useState([]);
  const { t } = useTranslation();
  const [useAvatar, setUseAvatar] = useState(false);
  const [avatarSvg, setAvatarSvg] = useState(null);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const handleOpenAvatarModal = () => setAvatarModalOpen(true);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/loggedinuser?email=${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setLoggedinuser(data[0]); // ✅ Always set as object
            console.log("Fetched loggedinuser:", data[0]);
          } else {
            console.warn("No user data found");
          }
        })
        .catch((err) => console.error("Error loading loggedinuser:", err));
    }
  }, [user?.email, setLoggedinuser]);

  useEffect(() => {
    if (loggedinuser) {
      if (loggedinuser.avatar) setAvatarSvg(loggedinuser.avatar);
      if (loggedinuser.useAvatar !== undefined)
        setUseAvatar(loggedinuser.useAvatar);
    }
  }, [loggedinuser]);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.set("image", file);
    const res = await fetch(
      "https://api.imgbb.com/1/upload?key=8eab5e80436a5a03116ffe0368a553c7",
      { method: "POST", body: formData }
    );
    const data = await res.json();
    return data?.data?.display_url;
  };

  const refreshLoggedInUser = () => {
    fetch(`http://localhost:5000/loggedinuser?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLoggedinuser(data[0]); // ✅ still set as object
        }
      });
  };

  const handleuploadcoverimage = async (e) => {
    setUploadingCover(true);
    const file = e.target.files[0];
    try {
      const url = await uploadImage(file);
      if (url) {
        await fetch(`http://localhost:5000/userupdate?email=${user?.email}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user?.email, coverimage: url }),
        });
        refreshLoggedInUser();
      }
    } catch (err) {
      console.error("Cover upload error:", err);
    }
    setUploadingCover(false);
  };

  const handleuploadprofileimage = async (e) => {
    setUploadingProfile(true);
    const file = e.target.files[0];
    try {
      const url = await uploadImage(file);
      if (url) {
        await fetch(`http://localhost:5000/userupdate?email=${user?.email}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user?.email, profileImage: url }),
        });
        refreshLoggedInUser();
      }
    } catch (err) {
      console.error("Profile upload error:", err);
    }
    setUploadingProfile(false);
  };

  return (
    <div>
      <ArrowBackIcon className="arrow-icon" onClick={() => navigate("/")} />
      <h4 className="heading-4">{username}</h4>
      <div className="mainprofile">
        <div className="profile-bio">
          <div>
            <div className="coverImageContainer">
              {!coverLoaded && (
                <Skeleton variant="rectangular" width="100%" height={200} />
              )}
              {loggedinuser && (
                <img
                  src={
                    loggedinuser.coverimage
                      ? `${loggedinuser.coverimage}?t=${Date.now()}`
                      : user?.photoURL
                  }
                  alt="Cover"
                  className="coverImage"
                  style={{ display: coverLoaded ? "block" : "none" }}
                  onLoad={() => setCoverLoaded(true)}
                />
              )}
              <div className="hoverCoverImage">
                <div className="imageIcon_tweetButton">
                  <label htmlFor="image" className="imageIcon">
                    {isUploadingCover ? (
                      <LockResetIcon className="photoIcon photoIconDisabled" />
                    ) : (
                      <CenterFocusWeakIcon className="photoIcon" />
                    )}
                  </label>
                  <input
                    type="file"
                    id="image"
                    className="imageInput"
                    onChange={handleuploadcoverimage}
                  />
                </div>
              </div>
            </div>

            <div className="avatar-img">
              <div className="avatarContainer">
                {!profileLoaded && (
                  <Skeleton variant="circular" width={100} height={100} />
                )}
                {loggedinuser && (
                  <img
                    src={
                      useAvatar && avatarSvg
                        ? avatarSvg
                        : loggedinuser.profileImage
                        ? `${loggedinuser.profileImage}?t=${Date.now()}`
                        : user?.photoURL
                    }
                    alt=""
                    className="avatar"
                    style={{ display: profileLoaded ? "block" : "none" }}
                    onLoad={() => setProfileLoaded(true)}
                  />
                )}
                <div className="hoverAvatarImage">
                  <div className="imageIcon_tweetButton">
                    <label htmlFor="profileImage" className="imageIcon">
                      {isUploadingProfile ? (
                        <LockResetIcon className="photoIcon photoIconDisabled" />
                      ) : (
                        <CenterFocusWeakIcon className="photoIcon" />
                      )}
                    </label>
                    <input
                      type="file"
                      id="profileImage"
                      className="imageInput"
                      onChange={handleuploadprofileimage}
                    />
                  </div>
                </div>
              </div>

              <Switch
                checked={useAvatar}
                onChange={() => {
                  const updatedValue = !useAvatar;
                  setUseAvatar(updatedValue);
                  if (!loggedinuser?.email) {
                    console.error("No email found. Cannot save avatar.");
                    return;
                  }
                  fetch("http://localhost:5000/save-avatar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      email: loggedinuser.email,
                      avatar: avatarSvg,
                      useAvatar: updatedValue,
                    }),
                  })
                    .then((res) => res.json())
                    .then(() => refreshLoggedInUser())
                    .catch((err) =>
                      console.error("Error saving avatar:", err)
                    );
                }}
                color="primary"
              />
              <span className="toggle-label">Use Avatar</span>

              {avatarModalOpen && user?.email && (
                <AvatarCustomization
                  onSave={(svg) => {
                    const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(
                      svg
                    )}`;
                    setAvatarSvg(dataUri);
                    setAvatarModalOpen(false);
                    setUseAvatar(true);
                  }}
                  onClose={() => setAvatarModalOpen(false)}
                  userEmail={loggedinuser.email}
                />
              )}

              <div className="userInfo">
                <div>
                  <h3 className="heading-3">
                    {loggedinuser?.name ?? user?.displayName}
                  </h3>
                  <p className="usernameSection">@{username}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Editprofile user={user} loggedinuser={loggedinuser} />
                  <button className="create-avatar-btn" onClick={handleOpenAvatarModal}>
                    {t("Create Avatar")}
                  </button>
                </div>
              </div>

              <div className="infoContainer">
                {loggedinuser?.bio && <p>{loggedinuser.bio}</p>}
                <div className="locationAndLink">
                  {loggedinuser?.location && (
                    <p className="suvInfo">
                      <MyLocationIcon /> {t("Location")}: {loggedinuser.location}
                    </p>
                  )}
                  {loggedinuser?.website && (
                    <p className="subInfo link">
                      <AddLinkIcon />
                      {t("Website")}: {loggedinuser.website}
                    </p>
                  )}
                </div>
              </div>

              <h4 className="tweetsText">{t("Tweets")}</h4>
              <hr />
            </div>

            {post.map((p) => (
              <Post key={p._id || p.id} p={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mainprofile;
