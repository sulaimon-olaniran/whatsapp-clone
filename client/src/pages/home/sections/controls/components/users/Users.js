import {useState, useEffect, useCallback} from "react";
import {useSelector} from "react-redux";
import {useDebounce} from "use-debounce";
import axios from "axios";

import ControlHeaderComponent from "../../../../../../components/headers/ControlsHeader";
import UsersListComponent from "../../../../../../components/users_list/UsersList";
import SearchInputComponent from "../../../../../../components/search_input/SearchInput";
import {userApi} from "../../../../../../api";

import contacts from "../../../../../../jsons/contacts.json";

const ControlsUsersComponent = ({deactiveControl}) => {
  const [fetching, setFetching] = useState(false);
  const [users, setUsers] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState("");

  const [searchValue] = useDebounce(searchInputValue, 500);

  const theme = useSelector(state => state.app.theme);
  const token = useSelector(state => state.user.token);

  const handleSearchUsersInputChange = event => {
    setSearchInputValue(event.target.value);
  };

  const filteredContacts = contacts.filter(contact => {
    return contact.username.toLowerCase().indexOf(searchValue) !== -1;
  });

  const fetchAppUsers = useCallback(() => {
    setFetching(true);

    const config = {
      headers: {
        "content-type": "application/json",
        "oswc-auth-token": token,
      },
    };

    axios
      .get(`${userApi}/fetch/all`, config)
      .then(res => {
        console.log(res.data);
        setUsers(res.data);
        setFetching(false);
      })
      .catch(error => {
        console.log(error);
      });
  }, [token]);

  useEffect(() => {
    fetchAppUsers();
  }, [fetchAppUsers]);

  return (
    <div className={`controls-users-component-${theme}-theme`}>
      <ControlHeaderComponent
        action={deactiveControl}
        title="Add new contact"
      />

      <div className="controls-users-search-container">
        <SearchInputComponent
          handleChange={handleSearchUsersInputChange}
          value={searchInputValue}
        />
      </div>

      <div className="controls-users-body-container">
        <UsersListComponent contacts={filteredContacts} />
      </div>
    </div>
  );
};

export default ControlsUsersComponent;
