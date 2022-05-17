import {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import {FormControl} from "@mui/material";

import ControlHeaderComponent from "../../../../../../../../../../components/headers/ControlsHeader";
import {updateUserPrivacySettings} from "../../../../../../../../../../store/actions/user";

const PrivacySelectComponent = ({
  closePrivacy,
  title,
  prevSelect,
  subTitle,
  footerTitle,
  id,
}) => {
  const [selected, setSelected] = useState(prevSelect);

  const theme = useSelector(state => state.app.theme);
  const privacy = useSelector(state => state.user.user.privacy);

  const dispatch = useDispatch();

  const handleRadioInputChange = event => {
    setSelected(event.target.value);
    const data = {
      ...privacy,
    };

    data[id] = event.target.value;

    dispatch(updateUserPrivacySettings(data));
  };
  return (
    <div className={`privacy-select-component-${theme}-theme`}>
      <ControlHeaderComponent title={title} action={closePrivacy} />

      <div className="privacy-select-component-sub-header">
        <h3>{subTitle}</h3>
      </div>

      <div className="privacy-select-component-body">
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={selected}
            onChange={handleRadioInputChange}
          >
            <FormControlLabel
              value="Everyone"
              control={<Radio size="small" />}
              label="Everyone"
            />
            <FormControlLabel
              value="My Contacts"
              control={<Radio size="small" />}
              label="My Contacts"
            />
            <FormControlLabel
              value="Nobody"
              control={<Radio size="small" />}
              label="Nobody"
            />
          </RadioGroup>
        </FormControl>
      </div>

      {footerTitle && (
        <div className="privacy-select-component-sub-header">
          <h3>{footerTitle}</h3>
        </div>
      )}
    </div>
  );
};

export default PrivacySelectComponent;
