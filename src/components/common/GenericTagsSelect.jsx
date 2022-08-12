import { TAGS } from "../../graphql/queries/TagsQueries";

import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useLazyQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";

export const GenericTagsSelect = ({ setTags, selectedTags }) => {
  const [getTags, { data: tagsFromServer }] = useLazyQuery(TAGS);
  const { id: user_id } = useSelector((state) => state.auth);
  let OPTIONS = tagsFromServer !== undefined ? tagsFromServer.Tags : [];

  const [selectedItems, setSelectedItems] = useState([]);

  const handleChange = (selectedItems) => {
    // console.log(selectedItems)
    setSelectedItems(selectedItems);
  };

  const filteredOptions =
    OPTIONS !== undefined
      ? OPTIONS.filter((search) => !selectedTags.includes(search))
      : [];

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
    getTags({ variables: { user_id: user_id } });
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
        placeholder="Seleccione las palabras clave"
        value={selectedItems}
        onChange={handleChange}
        style={{ borderRadius: "10px", width: "350px" }}
      >
        {filteredOptions.map((item) => (
          <Select.Option
            key={item.id}
            value={item.name}
            style={{ borderRadius: "10px" }}
          >
            {item.name}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};
