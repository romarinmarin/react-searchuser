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
  const [isLoading, setIsLoading] = useState(false);
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
          toggleError(true, "You are over the request limit");
        }
      })
      .catch((err) => console.log(err));
  };

  const getGithubUser = async (user) => {
    toggleError();
    setIsLoading(true);
    const response = await axios
      .get(`${rootUrl}/users/${user}`)
      .catch((err) => console.log(err));

    if (response) {
      setGithubUser(response.data);
    } else {
      toggleError(true, "there is no user with that username");
    }
    setIsLoading(false);
    checkRequests();
  };

  const toggleError = (show, msg) => {
    setError({ show, msg });
  };

  useEffect(checkRequests);

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        getGithubUser,
        isLoading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };
