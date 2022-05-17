import {useState, useRef} from "react";
import {useSelector} from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {IconButton} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchInputComponent = ({value, handleChange, id, placeholder}) => {
  const [inputActive, setInputActive] = useState(false);

  const inputRef = useRef(null);

  const theme = useSelector(state => state.app.theme);

  const handleOnBlur = () => {
    setInputActive(false);
  };

  const handleOnFocus = () => {
    setInputActive(true);
  };

  const handleFocusOnInput = () => {
    inputRef.current.focus();
  };

  return (
    <div className={`search-input-component-${theme}-theme`}>
      <IconButton
        size="small"
        onClick={!inputActive ? handleFocusOnInput : null}
      >
        {inputActive ? (
          <ArrowBackIcon fontSize="small" style={{color: "#00a884"}} />
        ) : (
          <SearchIcon fontSize="small" style={{color: "#8696a0"}} />
        )}
      </IconButton>

      <input
        onBlur={handleOnBlur}
        onFocus={handleOnFocus}
        onChange={handleChange}
        ref={inputRef}
        value={value}
        id={id}
        placeholder={placeholder || "Search"}
      />
    </div>
  );
};

export default SearchInputComponent;
