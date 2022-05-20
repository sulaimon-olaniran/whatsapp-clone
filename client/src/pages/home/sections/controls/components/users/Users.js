import {useState} from "react";
import {useSelector} from "react-redux";
import {useDebounce} from "use-debounce";
import axios from "axios";

import ControlHeaderComponent from "../../../../../../components/headers/ControlsHeader";
import UsersListComponent from "../../../../../../components/users_list/UsersList";
import SearchInputComponent from "../../../../../../components/search_input/SearchInput";

import contacts from "../../../../../../jsons/contacts.json";

const ControlsUsersComponent = ({deactiveControl}) => {
  const [searchInputValue, setSearchInputValue] = useState("");

  const [searchValue] = useDebounce(searchInputValue, 500);

  const theme = useSelector(state => state.app.theme);

  const handleSearchUsersInputChange = event => {
    setSearchInputValue(event.target.value);
  };

  const filteredContacts = contacts.filter(contact => {
    return contact.username.toLowerCase().indexOf(searchValue) !== -1;
  });

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
