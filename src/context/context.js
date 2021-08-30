import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  const [error, setError] = useState({ show: false, msg: "" });

  // Request loading

  const [requests, setRequests] = useState(0);

  const checkRequests = () => {
    axios
      .get(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;
        setRequests(remaining);
        if (remaining === 0) {
          toggleError(true, "Requests limits exceted");
        }
      })
      .catch((err) => console.log(err));
  };

  const getGithubUser = async (user) => {
    const response = await axios
      .get(`https://api.github.com/users/${user}`)
      .catch((err) => console.log(err));
    if (response) {
      setGithubUser(response.data);
    } else {
      toggleError(true, "there is no user with that username");
    }
  };

  const toggleError = (show, msg) => {
    setError({ show, msg });
  };

  useEffect(checkRequests);

  return (
    <GithubContext.Provider
      value={{ githubUser, repos, followers, requests, error, getGithubUser }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };
