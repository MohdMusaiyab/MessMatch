import React from "react";
import Sidebar from "./Sidebar";
import Searchbar from "./Searchbar";

const ExplorePage = () => {
  return (
    <div>
      <Searchbar></Searchbar>
      <Sidebar></Sidebar>
      <div>
        Here i will render the rest of the components in style
      </div>
    </div>
  );
};

export default ExplorePage;
