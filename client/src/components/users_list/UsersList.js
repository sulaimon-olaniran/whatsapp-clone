import {useSelector} from "react-redux";

import UserComponent from "../user/User";

const UsersListComponent = ({contacts, action, selectedContacts}) => {
  const theme = useSelector(state => state.app.theme);
  const blocked_contacts = useSelector(
    state => state.user.user.privacy.blocked_contacts
  );

  const filteredContacts = contacts.filter(contact => {
    if (!selectedContacts) return contacts;

    return selectedContacts.indexOf(contact) < 0;
  });

  const splitContactsAlphabetically = filteredContacts.reduce((a, c) => {
    // c[0] should be the first letter of an entry
    //
    let k = c.username[0].toLocaleUpperCase();

    // either push to an existing dict entry or create one
    if (a[k]) a[k].push(c);
    else a[k] = [c];

    return a;
  }, {});

  //CONVERTS SPLITCONTACTSALPHABETICALLY INTO AN ARRAY THAT RETURNS ARRAY IN BELOW FORMAT
  // array = [
  //   ["A", ["Andrew", "Andy", "Ahmed", "Annie"]],
  //   ["S", ["Salmon", "Shelly", "Sherlock"]],
  //   ["B", ["Banny", "Bella", "Brooks"]]
  // ]
  const splitContactsArray = Object.entries(splitContactsAlphabetically);

  //SORTS OUT THE SPLITTED ARRAY ALPHABETTICALLY
  const sortedSplitContactsArray = splitContactsArray.sort();

  return (
    <div className={`users-list-component-${theme}-theme`}>
      {sortedSplitContactsArray.map(splitContacts => {
        return (
          <div
            key={splitContacts[0]}
            className="each-split-users-aphabetic-section"
          >
            <div className="each-split-users-title">
              <p>{splitContacts[0]}</p>
            </div>

            <div className="each-split-users-listing">
              {splitContacts[1].map(contact => {
                //console.log(contact);
                return (
                  <UserComponent
                    key={contact.username}
                    user={contact}
                    userAction={action}
                    disabled={blocked_contacts.includes(contact._id)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UsersListComponent;
