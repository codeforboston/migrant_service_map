import React, { Component } from "react";

export default class Filter extends Component {

  render() {
    return (
      <div>
        <div>
          <ul>
            <li className="nowrap">
            <p>Distance From Specified Location:</p>
            </li>
            <li className="nowrap">
              <input type="checkbox" id="check"/>
              <label htmlFor="check">0.5 Miles</label>
            </li>
            <li className="nowrap">
              <input type="checkbox" id="check"/>
              <label htmlFor="check">1 Mile</label>
            </li>
            <li className="nowrap">
              <input type="checkbox" id="check"/>
              <input type="number" name="quantity" min="1" max="1000" defaultValue="3"/>
            </li>
          </ul>

        </div>


        <div>
          <select multiple>
            <option value="Green Card Holders Only">Green Card Holders Only</option>
            <option value="No Documentation Needed">No Documentation Needed</option>
            <option value="US State Dept Refugee Visa">US State Dept Refugee Visa</option>
          </select>
        </div>

        <div>
          Accepting New Clients:&nbsp;&nbsp;
          <select>
            <option value="t">Yes</option>
            <option value="f">No</option>
          </select>

        </div>


      </div>

    );
  }
}