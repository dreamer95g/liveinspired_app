import { TAGS } from "../../graphql/queries/TagsQueries";

import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useLazyQuery } from "@apollo/client";

export const GenericTagsSelect = ({ setTags, selectedTags }) => {
  const [getTags, { data: tagsFromServer }] = useLazyQuery(TAGS);

  let OPTIONS = tagsFromServer !== undefined ? tagsFromServer.tags : [];

  const [selectedItems, setSelectedItems] = useState([]);

  const handleChange = (selectedItems) => {
    // console.log(selectedItems)
    setSelectedItems(selectedItems);
  };

  const filteredOptions = OPTIONS.filter(
    (search) => !selectedItems.includes(search)
  );

  const getTagIdsFromSelectedItems = (selectedItems) => {
    let tagsId = [];

    selectedItems.forEach((name) => {
      OPTIONS.forEach((element) => {
        if (element.name === name) {
          tagsId.push(element.id);
        }
      });
    });

    return tagsId;
  };

  useEffect(() => {
    const tags = getTagIdsFromSelectedItems(selectedItems);

    setTags(tags);
  }, [selectedItems]);

  useEffect(() => {
    getTags();
  }, []);

  useEffect(() => {
    const selectedItms = selectedTags.map((cat) => {
      return cat.name;
    });

    setSelectedItems(selectedItms);
  }, [selectedTags]);

  useEffect(() => {
    if (tagsFromServer !== undefined) {
      OPTIONS = tagsFromServer.tags;
    }
  }, [tagsFromServer]);

  return (
    <div>
      <Select
        mode="multiple"
        placeholder="Seleccione las Etiquetas"
        value={selectedItems}
        onChange={handleChange}
        style={{ borderRadius: "10px", width: "350px" }}
      >
        {filteredOptions.map((item) => (
          <Select.Option key={item.id} value={item.name}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};
