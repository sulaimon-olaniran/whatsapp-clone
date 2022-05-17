import moment from "moment";

export const groupArrayByDatesFunction = (array, token) => {
  return array.reduce(function (val, obj) {
    let comp = moment(obj["time"]).format(token);
    (val[comp] = val[comp] || []).push(obj);
    return val;
  }, []);
};
