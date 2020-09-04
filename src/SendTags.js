import React, { useState } from "react";
import Axios from "axios";

export default function SendTags() {
  const [recipients, updateRecipients] = useState("");
  const [qualifier, updateQualifier] = useState("");
  const [sendTo, updateSendTo] = useState("");
  const [sendType, updateSendType] = useState("");
  const [sent, updateSent] = useState(false);

  const handleChange = (event) => {
    const value = event.target.value;
    switch (event.target.name) {
      case "sendType":
        updateSendType(value);
        return;
      case "sendTo":
        updateSendTo(value);
        return;
      case "qualifier":
        updateQualifier(value);
        return;
      default:
        return;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    /*  implement me
            hint: we will probably need to update state here to render the right parts
        */
    /*
    Would have trimmed the space do some da validation. And would have written some test cases if had time
    */
    const { data } = await Axios.get(
      "https://sheetdb.io/api/v1/aka2sv6jd00dh "
    );

    let resultarr;
    if (sendType == "tags") {
      resultarr = [];
      if (qualifier === "OR") {
        let temp = sendTo.split(",");
        data.forEach((element) => {
          for (let i = 0; i < temp.length; i++) {
            if (element[sendType].includes(temp[i])) {
              let res = element["firstName"] + " " + element["lastName"] + ", ";
              resultarr.push(res);
            }
          }
        });
      } else if (qualifier === "AND") {
        let temp = sendTo.split(",");
        let bool = true;
        for (let i = 0; i < temp.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (data[j].tags.includes(temp[i])) {
              let res = data[j]["firstName"] + " " + data[j]["lastName"] + ", ";
              resultarr.push(res);
              break;
            }
          }
        }
      }
    } else {
      resultarr = [];
      data.forEach((element) => {
        if (sendTo === element["organizationId"]) {
          let res = element["firstName"] + " " + element["lastName"] + ",  ";

          resultarr.push(res);
        }
      });
    }
    updateSent(true);
    updateRecipients(resultarr);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
        <label style={{ paddingRight: "10px" }}>
          <div>
            <span style={{ paddingRight: "10px" }}>
              Send Type (Organization, First Name, Last Name, or Tags):
            </span>
            <input type="text" name="sendType" onChange={handleChange} />
          </div>
          <div>
            <span style={{ paddingRight: "10px", paddingTop: "20px" }}>
              Send To (separated by commas):
            </span>
            <input type="text" name="sendTo" onChange={handleChange} />
          </div>
          <div>
            <span style={{ paddingRight: "10px", paddingTop: "20px" }}>
              AND/OR?:{" "}
            </span>
            <input type="text" name="qualifier" onChange={handleChange} />
          </div>
        </label>
        <input type="submit" value="Send Messages" />
      </form>
      {sent && <div>Sent to: {recipients}</div>}
    </div>
  );
}
